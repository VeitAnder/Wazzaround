var cloudinary = require('cloudinary');
var fs = require("fs");

//var ObjectId = require('mongojs').ObjectId;
//var models = require("../models/models.js");       TODO commenting that in generates modelizer error at the moment and renders client useless

cloudinary.config({ cloud_name: 'dqe7zmb1k', api_key: '619226866778758', api_secret: 'yA_Xv9LXc9aEab05M9YNlEgpQsw' });

exports.postupload = function (req, res, next) {
  var activityid = req.body.activityid;

//  models.ActivityModel.get(ObjectId(activityid)).then(function () {
//
//  });

//  if (req.session.auth) {
  var imageStream = fs.createReadStream(req.files.file.path, { encoding: 'binary' }),
    cloudStream = cloudinary.uploader.upload_stream(function (data) {
      res.send({data: data});
    });

  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
//  } else {
//    res.send(401, "access denied");
//  }
};

exports.deleteupload = function (req, res, next) {
  var resourceid = req.params.resourceid;
  cloudinary.api.delete_resources([resourceid], function (data) {
    res.send(data);
  });
};