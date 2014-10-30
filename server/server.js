//var http = require('http');

// process uncaught Exceptions
process.on('uncaughtException', function (err) {
  console.log('Caught exception', err);
});

var express = require('express');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var passport = require('passport');
var config = require('./config.js');
var logger = require('./lib/logger.js');

var cacheControl = require('./lib/cacheControl');

// export express
var app = module.exports = express();

app.use(compress());                                // enable gzip compression for res.send()

logger.info("Node environment: NODE_ENV=%s", process.env.NODE_ENV);

// Apply Express Middleware Filters
app.use(logger.expressLogger);

require("./servermodules/security.js").allowCors(app);
require("./servermodules/serveclient.js").setupStaticAssetsServer(app, (86400000 * 365));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('json spaces', 2);

if (process.env.NODE_ENV === "production") {
  app.get('/*', function (req, res, next) {
    if (!req.headers.host.match(/^www\./) && req.headers.host.indexOf("onmodulus.net") < 0) {
      res.redirect('https://www.reacture.com');
    } else {
      return next();
    }
  });
}

// init mongodb database connection
var mongojs = require('mongojs');
if (config.mongo.local) {
  var db = mongojs('mongodb://127.0.0.1:27017/' + config.mongo.dbName);
} else {
  var db = mongojs('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName);
}
app.use(cookieParser());
app.use(cookieParser(config.server.cookieSecret));            // Hash cookies with this secret
app.use(cookieSession({
  keys: [config.server.cookieSecret],
  secureProxy: false // if you do SSL outside of node
}));

// Passport/Express Config
app.use(passport.initialize());                               // Initialize PassportJS
// Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
app.use(passport.session());
// modelizer uses passport auth - so modelizer middleware has to be placed after passport middleware
require("./servermodules/modelizer.js").initModelizer(app, db);
// require security after modelizer!
var security = require('./lib/security');
security.initialize();                                        // Add a Mongo strategy for handling the authentication

app.use(cacheControl);

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "developmentmodulus") {
  require("./servermodules/security.js").useCSRFProtection(app);
}

app.use('/' + config.api.apiversion + 'upload', require("./routes/upload.js"));
app.use('/' + config.api.apiversion + 'users', require("./routes/users.js"));

require("./servermodules/serveclient.js").serveClient(app);

// Start up the server on the port specified in the config
var serverport;
if (process.env.PORT) {
  // modulus.io provides the server port on process.env.PORT
  serverport = process.env.PORT;
} else {
  serverport = config.server.listenPort;
}

// start the server if `$ node server.js`
if (require.main === module) {
  app.listen(serverport, function(err) {
    logger.info('Reacture App Server - listening on port: ' + serverport);
  });
}

