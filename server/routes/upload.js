var config = require("../config.js");

var express = require('express');
var router = express.Router();

var security = require("../lib/security.js");

var cloudinary = require('cloudinary');
var fs = require("fs");
var multiparty = require("multiparty");  // necessary as separate module since ExpressJS 4.0

cloudinary.config(config.cloudinary);

router.use(security.isAuthenticated);

router.post('/activityimage', function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var imageStream = fs.createReadStream(files.file[0].path, { encoding: 'binary' });
    var cloudStream = cloudinary.uploader.upload_stream(function (data) {
      res.send({data: data});
    });
    imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
  });
});

router.delete('/activityimage/:resourceid/?', function (req, res, next) {
  var resourceid = req.params.resourceid;
  cloudinary.api.delete_resources([resourceid], function (data) {
    res.send(data);
  });
});

module.exports = router;