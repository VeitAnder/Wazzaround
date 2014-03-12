'use strict';
// https://github.com/jbcpollak/cloudinary_angular

angular.module('anorakApp')
  .service('cloudinary', function ($http, models, $rootScope) {
    return {

      'getUploadAttrs': function (tags) {
        return  models.SignatureModel.generateSignatureObj({
          timeStamp: new Date().getTime(),
          tags: tags
        })
          .then(function (signatureObj) {
            debug("Got cloudinary image upload signature", signatureObj);
            return signatureObj;
          })
          .fail(function (err) {
            debug("Could not generate signature", err);
          });
      }
    };
  });

//     call like that
//cloudinary.getUploadAttrs(tags, function(data) {
//
//  data.uploadDone = function(e, cloudinaryResponse) {
//    // custom processing to save the new cloudinary ID goes here...
//  };
//
//  $scope.cloudinaryData = data;
//}

//cloudinaryData = {
//  url: https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/auto/upload
//formData: {
//  timestamp : 1375363550;
//  tags : sampleTag,
//    api_key : YOUR_API_KEY,
//    callback : URL TO cloudinary_cors.html,
//    signature : '53ebfe998d4032318c9aba08517d26f7408851a5'
//},
//uploadStart : function(e, response) { },
//uploadDone : function(e, response) { }
//}