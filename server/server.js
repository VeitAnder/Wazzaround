//var http = require('http');

// process uncaught Exceptions
process.on('uncaughtException', function (err) {
  console.log('Caught exception', err);
});

var _ = require('lodash');

var express = require('express');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var passport = require('passport');
var config = require('./config.js');
var logger = require('./lib/logger.js');

var cacheControl = require('./lib/cacheControl');

// sitemap service;
var sitemap = require('sitemap');
var Q = require("q");

// export express
var app = module.exports = express();

// prerender.io service
app.use(require('prerender-node').set('prerenderToken', 'KINFE7SXJyJIWbZnFRiO'));

app.use(compress());                                // enable gzip compression for res.send()

logger.info("Node environment: NODE_ENV=%s", process.env.NODE_ENV);

//switch to https immediately
if (config.security.switchToHttps === "true") {
  require("./servermodules/security.js").switchToHTTPS(app);
}

// Apply Express Middleware Filters
app.use(logger.expressLogger);

require("./servermodules/security.js").allowCors(app);
require("./servermodules/serveclient.js").setupStaticAssetsServer(app, (86400000 * 365));

require("./servermodules/serveclient.js").setupMaintenanceMode(app);

// Fix Issue http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large
app.use(bodyParser.json({
    limit: '50mb'
  })
);
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//    extended: true
//  })
//);
app.set('json spaces', 2);

if (process.env.NODE_ENV === "production") {
  app.get('/*', function (req, res, next) {
    if (!req.headers.host.match(/^www\./) && req.headers.host.indexOf("onmodulus.net") < 0 && req.headers.host.indexOf("herokuapp.com") < 0) {
      res.redirect(config.clienthost);
    } else {
      return next();
    }
  });
}

// init mongodb database connection
var mongojs = require('mongojs');
var db;

(function () {
  var authMechanism;

  if (process.env.NODE_ENV === "dev") {
    //MongoDB 3.0
    authMechanism = 'ScramSHA1';
  } else {
    // Mongodb 2.6
    authMechanism = 'MongoCR';
  }

  db = mongojs(
    'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName,
    [],
    {
      authMechanism: authMechanism
    }
  );
})();

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
app.use('/' + config.api.apiversion + 'users', require("./routes/users.js"))

app.get('/sitemap.xml', function (req, res, next) {
  var lang = "en";

  if (req.query.lang) {
    lang = req.query.lang;
  }

  var sm = sitemap.createSitemap({
    hostname: 'https://www.wazzaround.com/',
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
      {url: '/?lang=' + lang, changefreq: 'daily', priority: 1},
      {url: '/#!/why/?lang=' + lang, changefreq: 'monthly', priority: 0.7},
      {url: '/#!/workwithus/?lang=' + lang, changefreq: 'monthly', priority: 0.7},
      {url: '/#!/legalnotes/?lang=' + lang, changefreq: 'monthly', priority: 0.3}
    ]
  });

  function getActivities() {
    var deferred = Q.defer();

    var activities = db.collection('activities');
    var query = {
      published: true
    };
    // find everything
    activities.find(query, function (err, docs) {
      if (err) {
        deferred.reject(err);
      }

      if (docs === null) {
        deferred.resolve = [];
      } else {
        deferred.resolve(docs);
      }

    });
    return deferred.promise;
  }

  getActivities()
    .then(function (activities) {
      return activities.map(function (activity) {
        return {
          url: '/#!/activities/' + activity._id.toString() + '/?lang=' + lang,
          changefreq: 'daily',
          priority: 0.8
        };
      });
    })
    .then(function (urls) {
      sm.urls = sm.urls.concat(urls);
      sm.toXML(function (err, xml) {
        if (err) {
          res.status(500).end();
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      });
    });

});

/*
 @TODO refactor out quickfixapi route into normal REST API when deprecating modelizer
 */
app.get('/quickfixapi/find/', function (req, res, next) {

  var activities = db.collection('activities');
  var params = JSON.parse(req.query.query);
  var query;

  // branch query into group events / single events query
  if (params.numberOfPersons > 1) {
    // Group events query branch
    query = {
      location: {
        '$geoWithin': {
          '$box': [
            [params.from.lng, params.from.lat],
            [params.to.lng, params.to.lat]
          ]
        }
      },
      bookableItems: {
        $elemMatch: {
          events: {
            $elemMatch: {
              start: {
                '$gte': new Date(params.startDate),
                '$lte': new Date(params.endDate)
              },
              groupEvent: true,
              groupMinPersons: {
                '$gte': params.numberOfPersons
              },
              groupMaxPersons: {
                '$lte': params.numberOfPersons
              }
            }
          }
        }
      }
    };

  } else {
    // single events query branch
    query = {
      location: {
        '$geoWithin': {
          '$box': [
            [params.from.lng, params.from.lat],
            [params.to.lng, params.to.lat]
          ]
        }
      },
      bookableItems: {
        $elemMatch: {
          events: {
            $elemMatch: {
              start: {
                '$gte': new Date(params.startDate),
                '$lte': new Date(params.endDate)
              }
            }
          }
        }
      }
    };
  }

  // find read filter
  // allow global read access
  // authorized users
  if (req.isAuthenticated()) {
    if (req.user.userType === 'user') {
      query.published = true;
    }

    if (req.user.userType === 'provider') {
      query.$or = [
        {"published": true},
        {"owner._reference": req.user._id}
      ];
    }

    // kann alles lesen
    //if (req.user.userType === 'admin') {
    //}
    // end authorized users
  } else {
    // für nicht eingeloggt user:
    query.published = true;
  }

  // find everything
  activities.find(query)
    .limit(50, function (err, docs) {
      if (docs === null || docs === undefined) {
        docs = [];
      } else {

        // get Lowest Price

        var lowestPriceOfSelectedActivity = function (activity) {
          var min = _.min(
            _.map(activity.bookableItems, function (item) {
              return _.min(item.events, 'price').price;
            })
          );
          return min;
        };

        // docs is an array of all the documents in mycollection
        docs.forEach(function (doc) {
          doc.lowestPrice = lowestPriceOfSelectedActivity(doc);
          doc.bookableItems = [];
        });

      }
      res.status(200).send(docs);
    });
});

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
//if (require.main === module) {
app.listen(serverport, function (err) {
  logger.info('Reacture App Server - listening on port: ' + serverport);
});
//}

