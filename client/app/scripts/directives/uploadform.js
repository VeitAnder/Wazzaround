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
        var addToImagesArray,
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
          },
          addRemoveLinks: true,
          previewsContainer: $(element).find(".dropzone-previews")[0],
          thumbnailWidth: 150,
          thumbnailHeight: 150
        });

        myDropzone.on("success", function (file, response) {
          file.cloudinary_public_id = response.data.public_id;
          file.cloudinary_format = response.data.format;
          file.cloudinary_url = response.data.url;
          // pass file to angular
          addToImagesArray(file);
          // remove file from Dropzone store
          myDropzone.removeFile(file);
        });

        //listen to $destroy event of directive and cancel upload
        scope.$on('$destroy', function () {
          myDropzone.destroy();
        });

      }
    };
  });
