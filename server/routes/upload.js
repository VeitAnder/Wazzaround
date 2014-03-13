var cloudinary = require('cloudinary');
var fs = require("fs");

cloudinary.config({ cloud_name: 'dqe7zmb1k', api_key: '619226866778758', api_secret: 'yA_Xv9LXc9aEab05M9YNlEgpQsw' });

exports.postupload = function (req, res, next) {

  var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary' }),
    cloudStream = cloudinary.uploader.upload_stream(function (data) {
      res.send({});
    });

  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
};