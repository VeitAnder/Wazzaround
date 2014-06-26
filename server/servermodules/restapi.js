var config = require('../config.js');
var upload = require('../routes/upload.js');

var googleTranslate = require('google-translate')("AIzaSyDeA3pWT15QSri8b00AVVqVCmAY_Niqbvg");

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

  // kalixa post redirect request test endpoint
  app.get('/api/kalixa/testredirect', function (req, res) {

    var https = require('https');

    // Build the post string from an object
    var post_data = '<?xml version="1.0" encoding="utf-8"?> ';
    post_data += '  <getRedirectDataRequest xmlns="http://www.cqrpayments.com/PaymentProcessing"  ';
    post_data += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  ';
    post_data += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema">  ';
    post_data += '    <merchantID>Reacture</merchantID>';
    post_data += '    <redirectParameters xsi:type="paymentMethodDetailsRedirectParameters">   ';
    post_data += '      <shopID>Reacture</shopID>   ';
    post_data += '      <httpMethod>POST</httpMethod>   ';
    post_data += '      <returnUrl>https://www.reacture.com/</returnUrl>  ';
    post_data += '      <languageCode>en</languageCode>  ';
    post_data += '      <currencyCode>EUR</currencyCode>  ';
    post_data += '      <countryCode>AT</countryCode>  ';
    post_data += '      <user>   ';
    post_data += '        <id>12345</id>  ';
    post_data += '        <username xsi:nil="true"/>   ';
    post_data += '        <firstname xsi:nil="true"/>   ';
    post_data += '        <lastname xsi:nil="true"/>    ';
    post_data += '        <currencyCode xsi:nil="true"/>  ';
    post_data += '        <languageCode xsi:nil="true"/>   ';
    post_data += '        <email xsi:nil="true"/>  ';
    post_data += '        <address xsi:nil="true"/>   ';
    post_data += '      </user>                ';
    post_data += '      <merchantTransactionID>anorakgeneratedtransactiohexid</merchantTransactionID>   ';
    post_data += '      <grossAmount>610</grossAmount>        ';
    post_data += '      <minPaymentLimitAmount>1</minPaymentLimitAmount>   ';
    post_data += '      <maxPaymentLimitAmount>3000</maxPaymentLimitAmount>   ';
    post_data += '      <expirationTimeSpanInSeconds>1200</expirationTimeSpanInSeconds>   ';
    post_data += '      <successUrl>www.test.com/success.aspx</successUrl>  ';
    post_data += '      <pendingUrl>www.test.com/pending.aspx</pendingUrl>  ';
    post_data += '      <errorUrl>www.test.com/error.aspx</errorUrl>   ';
    post_data += '      <cancelUrl>www.test.com/cancel.aspx</cancelUrl>  ';
    post_data += '      <refusedUrl>www.test.com/refused.aspx</refusedUrl>   ';
    post_data += '      <paymentMethodID>2</paymentMethodID>    ';
    post_data += '      <isPaymentMethodChangeAllowed>true</isPaymentMethodChangeAllowed>   ';
    post_data += '    </redirectParameters>       ';
    post_data += '  </getRedirectDataRequest>  ';

    // An object of options to indicate where to post to
    var post_options = {
      host: 'test.backend.cqrpayments.com',
      port: '443',
      path: '/PaymentRedirectionService/PaymentRedirectionService.svc/pox',
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Length': post_data.length,
        'Authorization': 'Basic UFNSZWFjdHVyZVN5c3RlbVVzZXI6dHFnYmVkMnpRd2ZrUjg=',
        'Referer': 'https://reactureappdev-10669.onmodulus.net'
      }
    };

    var post_req = https.request(post_options, function (res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function (d) {
        process.stdout.write(d);
      });

      res.on('end', function (d) {
        console.log("on end: ", d);
      });

    })
      .on('error', function (e) {
        console.error(e);
      });

    post_req.write(post_data);
    post_req.end();

  });

  // kalixa post redirect request test endpoint
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