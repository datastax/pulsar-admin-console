const express = require('express');
const path = require('path');
const randomId = require('random-id');
const cfg = require('./config.js')
cfg.config('../dashboard/dist/index.html')
cfg.L.info('server config ', cfg.dashboardConfig)
const app = express(),
      k8s = require('./k8s.js');
      bodyParser = require('body-parser'),
      cookieSession = require('cookie-session'),
      passport = require('passport');

// the local authentication type
const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    let result = await k8s.authenticate(username, password);
    cfg.L.info('user ' + username + ' auth result ' + result);

    if (result) {
      done(null, {username: username});
    } else {
      done(null, false, { message: 'Incorrect username or password'});
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  done(null, {username: id})
});

process.env['NODE_ENV']='production'
process.env['VUE_APP_YANDEX_METRICS_KEY']=''
// place holder for the data
const users = [];

app.use(bodyParser.json());
app.use(cookieSession({
  name: 'mysession',
  keys: ['vueauthrandomkey'],
  maxAge: 365 * 24 * 60 * 60 * 1000 // 365 days
}));
app.use(passport.initialize())
app.use(passport.session())
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

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

app.post('/api/login', (req, res, next) => {
  cfg.L.debug(JSON.stringify(req.body, null, 2))
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send(info);
    }

    req.login(user, err => {
      res.send("Logged in");
    });
  })(req, res, next);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  cfg.L.info('logged out')
  return res.send();
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

app.listen(cfg.serverConfig.PORT, () => {
    cfg.L.info(`Server listening on the port:${cfg.serverConfig.PORT}`);
});