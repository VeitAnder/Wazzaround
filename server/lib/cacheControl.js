// http://stackoverflow.com/questions/9147516/how-would-one-make-connect-express-use-non-expiring-caching-on-a-particular-dire

/*
 * this filter is a fix only for IE, check for better solution
 */
module.exports = function (req, res, next) {
  if (req.headers.accept.indexOf('application/json') > -1) {
    res.setHeader("Cache-Control", "public, max-age=0");
    res.setHeader("Expires", new Date(Date.now() + 0).toUTCString());
  }
  next();
};