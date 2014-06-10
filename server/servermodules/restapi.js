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
  app.post('/api/kalixa/', function (req, res) {
    // page 75 /Dropbox/Projekte/Reacture/KalixaPaymentProviderDoku/IntegrationManual_PaymentService_API_v3_en_merged(1).pdf page
    var pox_response = '<?xml version="1.0" encoding="utf-8"?>';
    pox_response += '<handlePaymentStateChangedNotificationResponse ';
    pox_response += 'xmlns="http://www.cqrpayments.com/PaymentProcessing" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">';
    pox_response += '<resultCode> <key>0</key>';
    pox_response += '<value>ProcessedSuccessfully</value> </resultCode> ';
    pox_response += '<resultMessage />';
    pox_response += '</handlePaymentStateChangedNotificationResponse>';

    var kalixapushnotifications = db.collection('kalixapushnotifications');
    kalixapushnotifications.save({date: new Date(), headers: req.headers, body: req.body });

    res.set('Content-Type', 'text/xml');
    res.send(200, pox_response);
  });

};

module.exports = {
  "RestApi": RestApi
};