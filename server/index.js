const express = require('express'),
  session = require('express-session'),
  passport = require('./passport'),
  consola = require('consola'),
  { Nuxt, Builder } = require('nuxt'),
  app = express(),
  db = require('./db'),
  api = require('./api');

// Import and Set Nuxt.js options
let nuxtConf = require('../nuxt.config.js');
nuxtConf.dev = !(process.env.NODE_ENV === 'production');

// Import app config
let config;
try {
  // Try to load local config
  config = require('../config.local');
} catch (e) {
  // Load default config if local config does not exist
  config = require('../config.default')
}

async function start() {
  await db.connect("mongodb://localhost/food4");

  // Ensure at least one admin user exists
  db.models.User.findOne({ role: 'admin' }).then(function(foundUser) {
    if(!foundUser) {
      console.log("No admin user found, creating one");
      let defaultAdmin = new db.models.User(config.admin.defaultAdmin);
      return defaultAdmin.setPassword(config.admin.defaultAdmin.password).then(function(){
        return defaultAdmin.save();
      }).then(function(){
        console.log("Created default admin user:", defaultAdmin.username);
      });
    } else {
      console.log("Admin user found:", foundUser.username);
    }
  }).catch(console.error.bind(console));

  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConf);

  const { host, port } = nuxt.options.server;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1); // trust first proxy (nginx)
  app.use(session({
    secret: 'ajapsandali',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !nuxtConf.dev }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return res.status(500).json(err); }
      if (!user) { return res.status(401).json(info.message); }
      req.logIn(user, function (err) {
        if (err) { return res.status(500).json(err); }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.use('/api', api);

  // Build only in dev mode
  if (nuxtConf.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
