var config = require("../config.js");

var cloudinary = require('cloudinary');
var fs = require("fs");
var multiparty = require("multiparty");  // necessary as separate module since ExpressJS 4.0

//var ObjectId = require('mongojs').ObjectId;
//var models = require("../models/models.js");

cloudinary.config(config.cloudinary);

exports.postupload = function (req, res, next) {
  if (!req.session.auth) {
    res.send(403, "Not Authorized");  // if not logged in don't allow write operations
    return;
  }

  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var imageStream = fs.createReadStream(files.file[0].path, { encoding: 'binary' });
    var cloudStream = cloudinary.uploader.upload_stream(function (data) {
      res.send({data: data});
    });
    imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
  });
};

exports.deleteupload = function (req, res, next) {
  var resourceid = req.params.resourceid;
  cloudinary.api.delete_resources([resourceid], function (data) {
    res.send(data);
  });
};