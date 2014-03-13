'use strict';

angular.module('anorakApp')
  .directive('uploadform', function ($timeout, $http, APP_CONFIG) {
    return {
      templateUrl: 'directives/uploadform.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var activityid = "1234";

        var myDropzone = new Dropzone('#dropzone', {
          url: APP_CONFIG.APIUrl + "upload/activityimage/",
          withCredentials: true, // For CORS.
          params: {
            activityid: "1223456"
          },
          addRemoveLinks: true,
          previewsContainer: $(element).find(".dropzone-previews")[0],
          maxFiles: 5,
          thumbnailWidth: 150,
          thumbnailHeight: 150
        });

        myDropzone.on("complete", function (file) {
          console.log("upload complete");
        });

        myDropzone.on("success", function (file, response) {
          console.log("success", response);
          file.responsedata = response;
        });

        myDropzone.on("maxfilesreached", function (file) {
          console.log("maxfilesreached", file);
        });

        myDropzone.on("maxfilesexceeded", function (file) {
          console.log("maxfilesexceeded", file);
        });

        myDropzone.on("removedfile", function (file) {
          // delete file from server implemented here
          $http.delete(APP_CONFIG.APIUrl + 'upload/activityimage/' + file.responsedata.data.public_id + "/",
            {
              withCredentials: true
            }
          )
            .then(function (response) {
            });

        });

      }
    };
  });
