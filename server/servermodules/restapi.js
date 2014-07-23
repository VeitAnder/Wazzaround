var config = require('../config.js');
var upload = require('../routes/upload.js');

var RestApi = function (app) {
  // Cloudinary Upload routes
  app.post('/' + config.api.apiversion + 'upload/activityimage/?', upload.postupload);
  app.delete('/' + config.api.apiversion + 'upload/activityimage/:resourceid/?', upload.deleteupload);
};

module.exports = {
  "RestApi": RestApi
};