var csurf = require('csurf');

// allow Cross Origin Requests for development on localhost
// yeoman grunt serve runs on port 9000, REST API on port 3000
var allowCors = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    if ('OPTIONS' === req.method) {
      res.status(200).end();
    } else {
      next();
    }
  });
};

var useCSRFProtection = function (app) {
  var csrfValue = function (req) {

    var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']) || (req.cookies['XSRF-TOKEN']);
    return token;
  };
  app.use(csurf({value: csrfValue}));                  // XSRF protection via express filter - http://expressjs.com/api.html#csrf // csurf in expressjs >= v4.x
  app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });
};

module.exports = {
  "allowCors": allowCors,
  "useCSRFProtection": useCSRFProtection
};