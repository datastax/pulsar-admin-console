const express = require('express');
const path = require('path');
const randomId = require('random-id');
const { serverConfig } = require('./config.js');
const cfg = require('./config.js')
cfg.config('../dashboard/dist/index.html')
cfg.L.info('server config ', cfg.dashboardConfig)
const app = express(),
      bodyParser = require("body-parser");

const k8s = require('./k8s.js');

process.env['NODE_ENV']='production'
process.env['VUE_APP_YANDEX_METRICS_KEY']=''
// place holder for the data
const users = [];

app.use(bodyParser.json());
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

app.get('/login', async (req, res) => {
  let v = await k8s.authenticate('admin', 'testpassword');
  cfg.L.info('auth result '+v)
  if (v) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

app.listen(serverConfig.PORT, () => {
    cfg.L.info(`Server listening on the port:${serverConfig.PORT}`);
});