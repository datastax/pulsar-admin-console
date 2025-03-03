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
const { privateKeyToPem } = require('./crypto')
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

const app = express();
let server
const cookieSession = require('cookie-session');

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

app.use(bodyParser.json({strict: false}));

app.use('/ws/', createProxyMiddleware({
  logLevel: cfg.globalConf.server_config.log_level,
  target: cfg.globalConf.server_config.websocket_url,
  ws: true,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  changeOrigin: true // necessary for hostname verification to pass because of the `Host` header.
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
    res.status(500).send(`Failed GET ${broker}`)
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
  // Remove the cookie header because this can sometimes cause issues with the pulsar proxy
  proxyReq.removeHeader('cookie')

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

  if (proxyRes?.statusCode >= 400) {
    cfg.L.warn('proxy request failed with status ' + proxyRes.statusCode + ', url: \'' + proxyRes.req.host + proxyRes.req.path + '\'')
  }

  if (proxyRes?.headers?.location) {
    const headers = req.headers;
    const body = req.body;

    // Rewrite host header to support hostname verification.
    headers.host = new URL(proxyRes.headers.location).host

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
      res.status(error?.response?.status || 500)
        .send(error?.response?.data || 'Internal Server Error')
    })
  } else {
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  }
};

// If function work URL is defined, use for function path, otherwise use Pulsar URL
const functionUrl = cfg.globalConf.server_config.function_worker_url ? cfg.globalConf.server_config.function_worker_url : cfg.globalConf.server_config.pulsar_url

// Proxies
app.use(`/api/v1/${cluster}/functions`, createProxyMiddleware({
  logLevel: cfg.globalConf.server_config.log_level,
  target: functionUrl,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  changeOrigin: true // necessary for hostname verification to pass because of the `Host` header.
}));

app.use(`/api/v1/${cluster}/sinks`, createProxyMiddleware({
  logLevel: cfg.globalConf.server_config.log_level,
  target: functionUrl,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  changeOrigin: true // necessary for hostname verification to pass because of the `Host` header.
}));

app.use(`/api/v1/${cluster}/sources`, createProxyMiddleware({
  logLevel: cfg.globalConf.server_config.log_level,
  target: functionUrl,
  pathRewrite: connectorPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  changeOrigin: true // necessary for hostname verification to pass because of the `Host` header.
}));

if (cfg.globalConf.auth_mode === 'openidconnect' && cfg.globalConf.server_config.oauth2.grant_type === 'password') {
  app.use('/api/v1/auth/token', createProxyMiddleware({
    logLevel: cfg.globalConf.server_config.log_level,
    target: cfg.globalConf.server_config.oauth2.identity_provider_url,
    pathFilter: '/api/v1/auth/token',
    pathRewrite: {'^/api/v1/auth/token': cfg.globalConf.server_config.oauth2.token_endpoint},
    changeOrigin: true, // Necessary for hostname verification to pass because of the `Host` header. Also, note
                        // that this has the side effect of making the JWT have the issuer from the proxy's perspective.
                        // That is helpful when running with a Kubernetes based issuer.
  }))
}

app.use(`/api/v1/${cluster}`, createProxyMiddleware({
  logLevel: cfg.globalConf.server_config.log_level,
  target: cfg.globalConf.server_config.pulsar_url,
  pathRewrite: rootPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: cfg.globalConf.server_config.ssl.verify_certs,
  changeOrigin: true // necessary for hostname verification to pass because of the `Host` header.
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
          let secretOrPrivateKey

          const tokenOptions = cfg.globalConf.server_config.token_options || {}
          const privateKeyPath = tokenOptions.private_key_path
          if (privateKeyPath) {
            secretOrPrivateKey = await privateKeyToPem(privateKeyPath)
            cfg.L.info('using local private key ' + privateKeyPath + ' for access_token for user ' + username);
          } else {
            secretOrPrivateKey = process.env.TOKEN_SECRET || cfg.globalConf.server_config.token_secret || "default-secret"
            cfg.L.info('using secret for access_token for user ' + username);
          }

          const algorithm = tokenOptions.algorithm || 'HS256'
          const expiresIn = tokenOptions.expires_in || '12h'
          const claim = tokenOptions.claim || 'sub'
          const claimObj = {}
          claimObj[claim] = username
          const jwtToken = jwt.sign(claimObj, secretOrPrivateKey, {expiresIn: expiresIn, algorithm});

          // This loosely complies with https://openid.net/specs/openid-connect-core-1_0.html section 3.2.2.5. Successful Authentication Response
          res.send({access_token: jwtToken});
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
const start = async () => {
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


    server = https.createServer(options, app)
        .listen(cfg.globalConf.server_config.port, () => {
          cfg.L.info(`HTTPS server listening on the port: ${server.address().port}`);
        })
  } else {
    server = app.listen(cfg.globalConf.server_config.port, () => {
      cfg.L.info(`HTTP server listening on the port: ${server.address().port}`);
    });
  }
}
const shutdown = async () => {
  if (server) {
    server.close()
  }
}
const getServer = () => {
  return server
}
const getConfig = () => {
  return cfg
}


module.exports = {
  start,
  shutdown,
  getServer,
  getConfig
};

if (require.main === module) {
  start()
}
