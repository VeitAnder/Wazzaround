angular.module('services.fileuploadcheck', [])
  .factory('fileuploadcheck', function () {
    "use strict";

    var status = {
      uploaded: false,
      submitted: false,
      reset: function () {
        status.uploaded = false;
        status.submitted = false;
      }
    };

    return status;
  });