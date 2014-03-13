var upload = require('../routes/upload.js');

var RestApi = function (app) {
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
  app.post('/upload/activityimage/', upload.postupload);
  app.delete('/upload/activityimage/:resourceid/', upload.deleteupload);
};

module.exports = {
  "RestApi": RestApi
};