var config = require('../config.js');
var upload = require('../routes/upload.js');

var googleTranslate = require('google-translate')(config.google.apikey);

var RestApi = function (app, db) {
  // filter to allow cross origin requests
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
//    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if ('OPTIONS' === req.method) {
      return res.send(200);
    }
    next();
  });

  // Cloudinary Upload routes
  app.post('/' + config.api.apiversion + 'upload/activityimage/', upload.postupload);
  app.delete('/' + config.api.apiversion + 'upload/activityimage/:resourceid/', upload.deleteupload);

  app.get('/' + config.api.apiversion + 'translate/', function (req, res) {
    var text = req.query.text;

    googleTranslate.translate(text, 'de', 'fr', function (err, translation) {
      console.log(translation);
      res.send({"translation": translation});
    });

  });

};

module.exports = {
  "RestApi": RestApi
};