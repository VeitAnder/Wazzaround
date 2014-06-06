var config = require('../config.js');
var upload = require('../routes/upload.js');

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

  // Kalixa push-notification endpoint
  app.all('/api/kalixa/', function (req, res) {
    var kalixapushnotifications = db.collection('kalixapushnotifications');
    kalixapushnotifications.save({date: new Date(), headers: req.headers, body: req.body });
    res.send(200, {state: "success"});
  });

};

module.exports = {
  "RestApi": RestApi
};