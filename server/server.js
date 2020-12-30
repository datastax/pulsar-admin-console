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
const watch = require('./file-watch.js');
const fs = require('fs');
const path = require('path');
const randomId = require('random-id');
const cfg = require('./config.js');
const jwt = require('jsonwebtoken');
cfg.config('../dashboard/dist/index.html');
cfg.L.info('server config ', cfg.dashboardConfig)

let k8s = ''

if (cfg.dashboardConfig.auth_mode === "k8s") {
  k8s = require('./k8s.js')
} 

const app = express(),
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session');

process.env['NODE_ENV']='production'
// place holder for the data
const users = [];

// app.use(require('cors'));
app.use(bodyParser.json());
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
        const secret = process.env.TOKEN_SECRET || "default-secret"
        res.send({token: jwt.sign({user: username}, secret, {expiresIn: '1d'})});
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

const caPath = process.env.CA_PATH || '';
const certPath = process.env.CERT_PATH || '';
const keyPath = process.env.KEY_PATH || '';
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