//var http = require('http');

// process uncaught Exceptions
process.on('uncaughtException', function (err) {
  console.log('Caught exception', err);
});

var express = require('express');
var connect = require('connect');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
//require('express-namespace');
//var passport = require('passport');

var config = require('./config.js');
var logger = require('./lib/logger.js');
//var security = require('./lib/security');
//var protectJSON = require('./lib/protectJSON');
var cacheControl = require('./lib/cacheControl');

var app = express();

logger.info("Node environment: NODE_ENV=%s", process.env.NODE_ENV);

//require("./servermodules/mongodb.js").connectToDatabase();

// Apply Express Middleware Filters
app.use(logger.expressLogger);

//require("./servermodules/security.js").allowCors(app);
require("./servermodules/serveclient.js").setupStaticAssetsServer(app, (86400000 * 3));

app.use(bodyParser());
app.set('json spaces', 2);

// init mongodb database connection
var mongojs = require('mongojs');

var db = mongojs('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName);

//var MongoStore = require('connect-mongostore')(express);

app.use(cookieParser());
app.use(cacheControl);

//app.use(passport.initialize());                             // Initialize PassportJS
//app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
// @TODO - refactor out connect dependency and use passport for session management.
app.use(connect.session({
  secret: config.server.cookieSecret,
  store: new connect.session.MemoryStore
//  store: new MongoStore({
//    'db': config.mongo.dbName,
//    'collection' : "sessions",
//    'host' : config.mongo.host,
//    'port' : config.mongo.port,
//    'username' : config.mongo.username,
//    'password' : config.mongo.password
//  })
}));

require("./servermodules/modelizer.js").initModelizer(app, db);

var RestApi = require("./servermodules/restapi.js");


/*
 if (process.env.NODE_ENV !== "testing") {
 // JSON protection

 app.use(protectJSON);                                       // Add JSON Vulnerability Protection -> http://docs.angularjs.org/api/ng.$http
 app.use(compress());                                // enable gzip compression for res.send()
 }
 */
//security.initialize();                                      // Add a Mongo strategy for handling the authentication

//require("./servermodules/serveclient.js").setupMaintenanceMode(app);

/*
 if (process.env.NODE_ENV === "production") {
 require("./servermodules/security.js").switchToHTTPS(app);
 }
 */

//require("./servermodules/security.js").useCSRFProtection(app);

//RestApi.manifest(app);

RestApi.RestApi(app);

require("./servermodules/serveclient.js").serveClient(app);

//require("./servermodules/errorhandling.js").errorHandling(app);

// Start up the server on the port specified in the config
var serverport;
if (process.env.PORT) {
  // modulus.io provides the server port on process.env.PORT
  serverport = process.env.PORT;
} else {
  serverport = config.server.listenPort;
}
app.listen(serverport);
logger.info('Reacture App Server - listening on port: ' + serverport);

/*
 if (process.env.NODE_ENV === "production") {
 // start server monitoring
 require("./servermodules/monitoring.js")();
 }
 */

//module.exports = app;