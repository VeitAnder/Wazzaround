'use strict';

angular.module('anorakApp')
  .directive('uploadform', function ($timeout, $http, APP_CONFIG) {
    return {
      templateUrl: 'directives/uploadform.html',
      restrict: 'E',
      scope: {
        images: "="
      },
      link: function postLink(scope, element, attrs) {
        //@TODO store activityid in image
        var activityid = "1234",
          addToImagesArray,
          myDropzone;

        addToImagesArray = function (file) {
          var image;

          //initialize scope.images
          if (scope.images === null) {
            scope.images = [];
          }

          image = {
            public_id: file.cloudinary_public_id,
            url: file.cloudinary_url,
            format: file.cloudinary_format,
            name: file.name
          };
          scope.images.push(image);

          $timeout(function () {
            scope.$apply();
          });
        };

        myDropzone = new Dropzone('#dropzone', {
          url: APP_CONFIG.APIUrl + "upload/activityimage/",
          acceptedFiles: "image/*",
          withCredentials: true, // For CORS.
          params: {
            activityid: "1223456"
          },
          addRemoveLinks: true,
          previewsContainer: $(element).find(".dropzone-previews")[0],
//          maxFiles: 5,
          thumbnailWidth: 150,
          thumbnailHeight: 150
        });

        myDropzone.on("complete", function (file) {
          console.log("upload complete");
        });

        myDropzone.on("success", function (file, response) {
          console.log("Dropzone", myDropzone);
          file.cloudinary_public_id = response.data.public_id;
          file.cloudinary_format = response.data.format;
          file.cloudinary_url = response.data.url;

          addToImagesArray(file);
          myDropzone.removeFile(file);
        });

        myDropzone.on("maxfilesreached", function (file) {
          console.log("maxfilesreached", file);
        });

        myDropzone.on("maxfilesexceeded", function (file) {
          console.log("maxfilesexceeded", file);
        });

//        myDropzone.on("removedfile", function (file) {
//          // delete file from server implemented here
//          $http.delete(APP_CONFIG.APIUrl + 'upload/activityimage/' + file.responsedata.data.public_id + "/",
//            {
//              withCredentials: true
//            }
//          )
//            .then(function (response) {
//            });
//
//        });

        //listen to $destroy event of directive and cancel upload
        scope.$on('$destroy', function () {
          myDropzone.destroy();
        });

      }
    };
  });
