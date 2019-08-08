const express = require('express'),
  session = require('express-session'),
  fileUpload = require('express-fileupload'),
  MongoStore = require('connect-mongo')(session),
  passport = require('./passport'),
  consola = require('consola'),
  fs = require('fs-extra'),
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

if(!fs.pathExistsSync('./static/settings.json')) {
  consola.info("Writing default settings to /static/settings.json");
  fs.writeJSONSync('./static/settings.json', config.defaultSettings);
}

async function start() {
  await db.connect(config.mongoose.url);

  // Ensure at least one admin user exists
  db.models.User.findOne({ role: 'admin' }).then(function (foundUser) {
    if (!foundUser) {
      consola.info("No admin user found, creating one");
      let defaultAdmin = new db.models.User(config.admin.defaultAdmin);
      return defaultAdmin.setPassword(config.admin.defaultAdmin.password).then(function () {
        return defaultAdmin.save();
      }).then(function () {
        consola.success("Created default admin user:", defaultAdmin.email);
      });
    } else {
      consola.success("Admin user found:", foundUser.email);
    }
  }).catch(consola.error.bind(consola));

  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConf);

  const { host, port } = nuxt.options.server;

  app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1); // trust first proxy (nginx)
  // app.use(function(req, res, next){
  //   console.log(req.method, req.path);
  //   next();
  // });
  app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !nuxtConf.dev },
    store: new MongoStore({
      mongooseConnection: db.mongoose.connection,
      collection: config.session.collection
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

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
