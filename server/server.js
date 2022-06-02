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
const { globalConf } = require('../dashboard/public/config.js')
const axios = require('axios');
const bodyParser = require('body-parser');
cfg.config('../dashboard/dist/index.html');
cfg.L.info('server config ', cfg.dashboardConfig)
require('dotenv').config()


let k8s = ''
const cluster = globalConf.home_cluster;

if (cfg.dashboardConfig.auth_mode === "k8s") {
  k8s = require('./k8s.js')
} 

const app = express(),
      cookieSession = require('cookie-session');

process.env['NODE_ENV']='production'
// place holder for the data
const users = [];

app.use(bodyParser.json());

app.use('/ws/', createProxyMiddleware({
  target: globalConf.server_config.websocket_url,
  'option.ws': true,
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

  const headers = {};
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization
  }

  axios({
    url: brokerTarget,
    headers
  }).then((resp) => {
    res.send(JSON.stringify(resp.data))
  }).catch((error) => {
    console.error(error)
  })
})

// Right the body to the req object. Fixes the issues body-parser causes for the proxies
const onProxyReq = (proxyReq, req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
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

// Handle Redirects
const onProxyRes = (proxyRes, req, res) => {
  if (proxyRes?.headers?.location) {
    const headers = req.headers;
    const body = req.body;
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization
    }

    axios({
      url: proxyRes.headers.location,
      headers,
      method: req.method,
      data: body
    }).then((resp) => {
      res.send(resp.data)
    }).catch((error) => {
      console.error(error)
    })
  } else {
    proxyRes.pipe(res);
  }
};

app.use(`/api/v1/${cluster}/functions`, createProxyMiddleware({
  target: globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyRes,
  secure: false,
  selfHandleResponse: true
}));

app.use(`/api/v1/${cluster}/sinks`, createProxyMiddleware({
  target: globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyRes,
  secure: false,
  selfHandleResponse: true
}));

app.use(`/api/v1/${cluster}/sources`, createProxyMiddleware({
  target: globalConf.server_config.pulsar_url,
  pathRewrite: connectorPathRewrite,
  onProxyRes,
  secure: false,
  selfHandleResponse: true
}));

app.use(`/api/v1/${cluster}`, createProxyMiddleware({
  target: globalConf.server_config.pulsar_url,
  pathRewrite: rootPathRewrite,
  onProxyReq,
  onProxyRes,
  secure: false,
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
  cfg.L.info('api/users called!!!!!!!')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  user.id = randomId(10);
  cfg.L.info('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

app.post('/api/v1/auth/token', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (username && password) {
      let result = await k8s.authenticate(username, password);
      if (result) {
        const secret = process.env.TOKEN_SECRET || globalConf.token_secret || "default-secret"
        // This loosely complies with https://openid.net/specs/openid-connect-core-1_0.html section 3.2.2.5. Successful Authentication Response
        res.send({access_token: jwt.sign({user: username}, secret, {expiresIn: '1d'})});
        return;
      }
    }
    res.status(401).send("incorrect credentials");
  } catch (e) {
    cfg.L.error(e);
    res.status(401).send("login exception");
  }
});

app.post('/auth', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    let result = await k8s.authenticate(username, password);
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

const caPath = process.env.CA_PATH || globalConf.ssl.ca_path || '';
const certPath = process.env.CERT_PATH || globalConf.ssl.cert_path || '';
const keyPath = process.env.KEY_PATH || globalConf.ssl.key_path || '';
if (caPath != '' && certPath != '' && keyPath != '') {
  const options = {
    ca: [fs.readFileSync(caPath)],
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };
  
  watch.exitOnFileChange(caPath);
  watch.exitOnFileChange(certPath);
  watch.exitOnFileChange(keyPath);

  const server = https.createServer(options, app);
  server.listen(cfg.serverConfig.PORT);
} else {
  app.listen(cfg.serverConfig.PORT, () => {
    cfg.L.info(`Server listening on the port:${cfg.serverConfig.PORT}`);
  });
}