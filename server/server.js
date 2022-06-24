//
//  Copyright 2021 DataStax, Inc. 
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  
//

const express = require('express');
'use strict';

const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');
const watch = require('./file-watch.js');
const fs = require('fs');
const path = require('path');
const randomId = require('random-id');
const cfg = require('./config.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');
cfg.L.debug('Global config ', cfg.globalConf)
require('dotenv').config()


let k8s = ''
const cluster = cfg.globalConf.home_cluster;

if (cfg.globalConf.auth_mode === "k8s") {
  cfg.L.info("Kubernetes authentication enabled")
  k8s = require('./k8s.js')
} else if (cfg.globalConf.auth_mode === "user") {
  cfg.L.info("Username/password authentication enabled")
}

const app = express(),
      cookieSession = require('cookie-session');


const isUserAuthenticated = async (username, password) => {

  cfg.L.info("Authenticating user: " + username)

  let result = false
  if (cfg.globalConf.auth_mode === 'user') {

    if (cfg.globalConf.server_config.user_auth.username &&
      cfg.globalConf.server_config.user_auth.password &&
        username === cfg.globalConf.server_config.user_auth.username && 
        password === cfg.globalConf.server_config.user_auth.password ) {

      result = true
    }
    
  } else if (cfg.globalConf.auth_mode === 'k8s') {
    result = await k8s.authenticate(username, password);
  }
  return result
}

// place holder for the user data
const users = [];

app.use(bodyParser.json({ strict: false}));

app.use('/ws/', createProxyMiddleware({
  target: cfg.globalConf.server_config.websocket_url,
  ws: true,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
}));

const connectorPathRewrite = (path, req) => {
  return path.replace(`/api/v1/${cluster}/`, '/admin/v3/')
}

const rootPathRewrite = (path, req) => {
  return path.replace(`/api/v1/${cluster}/`, '/admin/v2/')
}

// broker/load-report handler
app.use('/api/v1/brokerPath/', (req, res, next) => {
  const broker = req.url.replace('/', '');
  const brokerTarget = `http://${broker}/admin/v2/broker-stats/load-report`;

  const headers = req.headers;

  axios({
    url: brokerTarget,
    headers
  }).then((resp) => {
    res.status(resp.status).send(JSON.stringify(resp.data))
  }).catch((error) => {
    console.error(error);
    res.status(error.response.status).send(error.response.data)
  })
})

// Serve the configuration parameters for the dashboard
// We need to remove the server options which can be sensitive
app.use('/config.js', (req, res, next) => {
  let dashboardConf = { ...cfg.globalConf }
  // Remove server config
  delete dashboardConf.server_config
  const response = "var globalConf = " + JSON.stringify(dashboardConf)
  res.send(response)
})

// Right the body to the req object. Fixes the issues body-parser causes for the proxies
const onProxyReq = (proxyReq, req, res) => {
  const emptyObj = '{}'
  if (req.body == undefined || JSON.stringify(req.body) == emptyObj) {
    return;
  }

  const writeBody = (bodyData) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  };

  if (proxyReq.getHeader('Content-Type') === 'application/json') {
    writeBody(JSON.stringify(req.body));
  }
}

let httpsAgent;
if (!cfg.globalConf.server_config.ssl.hostname_validation) {
  httpsAgent = new https.Agent({ checkServerIdentity: () => undefined })
}

// Handle Redirects
const onProxyRes = (proxyRes, req, res) => {
  if (proxyRes?.headers?.location) {
    const headers = req.headers;
    const body = req.body;

    axios({
      url: proxyRes.headers.location,
      beforeRedirect: (options, { headers }) => {
        console.log('multi-redirect handler ')
        options.headers.authorization = req.headers.authorization
      },
      headers,
      httpsAgent,
      method: req.method,
      data: body
    }).then((resp) => {
      res.status(resp.status).send(resp.data)
    }).catch((error) => {
      console.error(error)
      res.status(error.response.status).send(error.response.data)
    })
  } else {
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  }
};

// Proxies
app.use(`/api/v1/${cluster}/functions`, createProxyMiddleware({
  target: cfg.globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  selfHandleResponse: true
}));

app.use(`/api/v1/${cluster}/sinks`, createProxyMiddleware({
  target: cfg.globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  selfHandleResponse: true
}));

app.use(`/api/v1/${cluster}/sources`, createProxyMiddleware({
  target: cfg.globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  selfHandleResponse: true
}));

if (cfg.globalConf.auth_mode === 'openidconnect' && cfg.globalConf.server_config.oauth2.grant_type === 'password') {
  app.use('/api/v1/auth/token', createProxyMiddleware({
    target: cfg.globalConf.server_config.oauth2.identity_provider_url,
    pathFilter: '/api/v1/auth/token',
    pathRewrite: {'^/api/v1/auth/token': cfg.globalConf.server_config.oauth2.token_endpoint},
    changeOrigin: true, // By changingOrigin, we're able to make internal k8s networking work for the token
  }))
}

app.use(`/api/v1/${cluster}`, createProxyMiddleware({
  target: cfg.globalConf.server_config.pulsar_url,
  pathRewrite: rootPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  selfHandleResponse: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'mysession',
  keys: ['vueauthrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}));
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

app.get('/api/users', (req, res) => {
  cfg.L.info('api/users called')
  res.json(users);
});

app.post('/api/v1/auth/pulsar-token', async (req, res) => {
  cfg.L.info('api/v1/auth/pulsar-token called')
  
  const username = req.body.username
  const password = req.body.password
  const access_token = req.body.access_token

  if (access_token) {
    // check the access token
    const secret = process.env.TOKEN_SECRET || cfg.globalConf.server_config.token_secret || "default-secret"

    try {
      jwt.verify(access_token, secret)
      const retVal = {
        admin_token: cfg.globalConf.server_config.admin_token,
      }
      res.json(retVal);
      return;
    } catch (e) {
      cfg.L.error(e);
      res.status(401).send("Access token invalid");
    }

  } else {
    try {
      if (username && password) {
      
        if (await isUserAuthenticated(username, password)) {
          const retVal = {
            admin_token: cfg.globalConf.server_config.admin_token,
          }
          res.json(retVal);
          return;
        }
      }
      res.status(401).send("incorrect credentials");
    } catch (e) {
      cfg.L.error(e);
      res.status(401).send("login exception");
    }
    
  }

});
app.post('/api/user', (req, res) => {
  const user = req.body.user;
  user.id = randomId(10);
  cfg.L.info('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

// OpenID Connect has a different model defined above.
if (cfg.globalConf.auth_mode !== 'openidconnect') {
  app.post('/api/v1/auth/token', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      if (username && password) {
        if (await isUserAuthenticated(username, password)) {
          const secret = process.env.TOKEN_SECRET || cfg.globalConf.server_config.token_secret || "default-secret"
          // This loosely complies with https://openid.net/specs/openid-connect-core-1_0.html section 3.2.2.5. Successful Authentication Response
          res.send({access_token: jwt.sign({user: username}, secret, {expiresIn: '12h'})});
          return;
        }
      }
      res.status(401).send("incorrect credentials");
    } catch (e) {
      cfg.L.error(e);
      res.status(401).send("login exception");
    }
  });
}

app.post('/auth', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    let result = await isUserAuthenticated();
    cfg.L.info('user ' + username + ' auth result ' + result);

    if (result) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/');
    } else {
      res.status(401).send("incorrect credentials");
      // redirect back to /login ?
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/api/logout', (req, res) => {
  req.logout();
  cfg.L.info('logged out')
  return res.send();
});

app.get('/login', (req,res) => {
  // res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
  res.sendFile(path.join(__dirname + '/login.html'));
});

const caPath = process.env.CA_PATH || cfg.globalConf.server_config.ssl.ca_path || '';
const certPath = process.env.CERT_PATH || cfg.globalConf.server_config.ssl.cert_path || '';
const keyPath = process.env.KEY_PATH || cfg.globalConf.server_config.ssl.key_path || '';
if (caPath != '' && certPath != '' && keyPath != '') {
  const options = {
    ca: [fs.readFileSync(caPath)],
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };
  
  watch.exitOnFileChange(caPath);
  watch.exitOnFileChange(certPath);
  watch.exitOnFileChange(keyPath);

  cfg.L.info(`HTTPS server listening on the port:${cfg.globalConf.server_config.port}`);
  const server = https.createServer(options, app);
  server.listen(cfg.globalConf.server_config.port);
} else {
  app.listen(cfg.globalConf.server_config.port, () => {
    cfg.L.info(`HTTP server listening on the port:${cfg.globalConf.server_config.port}`);
  });
}