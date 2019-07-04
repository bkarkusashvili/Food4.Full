const express = require('express'),
  session = require('express-session'),
  passport = require('./passport'),
  consola = require('consola'),
  { Nuxt, Builder } = require('nuxt'),
  app = express(),
  db = require('./db'),
  api = require('./api');

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  await db.connect("mongodb://localhost/food4");
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1); // trust first proxy (nginx)
  app.use(session({
    secret: 'ajapsandali',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !config.dev }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/login', function (req, res, next) {
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
  if (config.dev) {
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
