// http://stackoverflow.com/questions/9147516/how-would-one-make-connect-express-use-non-expiring-caching-on-a-particular-dire

/*
 * this filter is a fix only for IE, check for better solution
 */

// TODO in development thats OK;
// but for production limit to application/json

module.exports = function(req, res, next) {
  var _send = res.send;
  res.send = function(body) {
    var contentType = res.getHeader('Content-Type');
    if ( contentType && contentType.indexOf('application/json') > -1 ) {
      res.setHeader("Cache-Control", "public, max-age=0");
      res.setHeader("Expires", new Date(Date.now() + 0).toUTCString());
      return _send.call(res, body);
    }
    _send.apply(res, arguments);
  };
  next();
};