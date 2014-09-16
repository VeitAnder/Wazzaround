var config = require("../config.js");
var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
cloudinary.config(config.cloudinary);
var fs = require("fs");
var multiparty = require("multiparty");  // necessary as separate module since ExpressJS 4.0
var Q = require('q');

var security = require('../lib/security.js');
var Images = require('../models/model_images.js');

router.use(security.passwordAuthenticationRequired);

router.post('/', function (req, res, next) {

  var saveImageToImageCollection = function (data) {
    return Q()
      .then(function () {
        var image = new Images();
        image.public_id = data.public_id;
        image.format = data.format;
        image.url = data.url;
        image.name = data.name;
        image.createdby = req.user._id;
        return image.saveQ();
      })
      .then(function (image) {
        return image;
      });
  };

  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    if (err) {
      next(err);
      return;
    }
    var imageStream = fs.createReadStream(files.file[0].path, { encoding: 'binary' });
    var cloudStream = cloudinary.uploader.upload_stream(function (data) {
      if (err) {
        next(err);
        return;
      }

      saveImageToImageCollection(data)
        .then(function (image) {
          res.send({data: image});
        })
        .fail(function (err) {
          next(err);
        });
    });
    imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
  });

});

//router.delete('/', function (req, res, next) {
//  var resourceid = req.params.resourceid;
//  cloudinary.api.delete_resources([resourceid], function (data) {
//    res.send(data);
//  });
//});

module.exports = router;