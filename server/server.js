const { response } = require('express');
const express = require('express');
const path = require('path');
const randomId = require('random-id');
const cfg = require('./config.js');
const jwt = require('jsonwebtoken');
cfg.config('../dashboard/dist/index.html');
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

// app.use(require('cors'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    console.log(e);
    res.status(401);
  }
});

app.post('/auth', async (req, res) => {
  console.log('called ', req.body)
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
app.post('/auth-page', passport.authenticate('local', { successRedirect: '/',
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

app.get('/login', (req,res) => {
  // res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.listen(cfg.serverConfig.PORT, () => {
    cfg.L.info(`Server listening on the port:${cfg.serverConfig.PORT}`);
});