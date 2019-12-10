const moduleAlias = require('module-alias'),
   express = require('express'),
  session = require('express-session'),
  fileUpload = require('express-fileupload'),
  MongoStore = require('connect-mongo')(session),
  consola = require('consola'),
  { Nuxt, Builder } = require('nuxt');

// Set up aliases
moduleAlias.addAlias('@root', __dirname);
moduleAlias.addAlias('@lib', __dirname + '/lib');
moduleAlias.addAlias('@models', __dirname + '/models');

const passport = require('./passport'),
  app = express(),
  db = require('./db'),
  mailer = require('./mailer'),
  api = require('./api'),
  config = require('./config');

// Import and Set Nuxt.js options
let nuxtConf = require('../nuxt.config.js');
nuxtConf.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  await db.connect(config.mongoose.url);
  await mailer.setup(config.mailer);

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

  db.models.Settings.findOne({ name: 'default' }).then(function (foundSettings) {
    if (!foundSettings) {
      consola.info("No settings found, creating");
      let defaultSettings = new db.models.Settings(config.admin.defaultSettings);
      defaultSettings.name = 'default';

      return defaultSettings.save().then(function () {
        consola.success("Created default settings:", defaultSettings);
      });
    } else {
      consola.info("Settings found, checking for missing fields");
      let needUpdate = false;
      for (let key in config.admin.defaultSettings) {
        if (config.admin.defaultSettings.hasOwnProperty(key) && (!foundSettings.hasOwnProperty(key) || foundSettings[key] == null)) {
          foundSettings[key] = config.admin.defaultSettings[key];
          needUpdate = true;
        }
      }
      if (needUpdate) {
        return foundSettings.save().then(function () {
          consola.success("Settings updated:", foundSettings);
        });
      }
    }
  });

  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConf);

  const { host, port } = nuxt.options.server;

  app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
  }));
  app.use(express.json({ limit: '10mb' }));
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
    rolling: true,
    cookie: {
      secure: !nuxtConf.dev,
      domain: nuxtConf.dev ? '' : 'food4.ge'
    },
    store: new MongoStore({
      mongooseConnection: db.mongoose.connection,
      collection: config.session.collection
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', api);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });

  // Build only in dev mode
  if (nuxtConf.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);
}

start();
