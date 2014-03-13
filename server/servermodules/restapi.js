var upload = require('../routes/upload.js');

var RestApi = function (app) {
  app.post('/upload', upload.postupload);
};

module.exports = {
  "RestApi": RestApi
};