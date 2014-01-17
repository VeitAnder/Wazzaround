angular.module('services.s3uploadservice', [])
  .factory('s3uploadservice',  function () {
    "use strict";

    var originalStatus = {
      "pdf": {
        "uploadcompleted": false,
        "uploadrunning": false,
        "key": "",
        "filename": "",
        "filesize": 0
      },
      "dwg": {
        "uploadcompleted": false,
        "uploadrunning": false,
        "key": "",
        "filename": "",
        "filesize": 0
      }
    };

    var status = {
      pdf: {
        reset: function () {
          angular.extend(status.pdf, originalStatus.pdf);
          angular.forEach(status.pdf.resetSubscriber, function (onesubscriber) {
            onesubscriber();
          });
        },
        resetSubscriber: [],
        subscribeToReset: function (callback) {
          status.pdf.resetSubscriber.push(callback);
        }
      },
      dwg: {
        reset: function () {
          angular.extend(status.dwg, originalStatus.dwg);
          angular.forEach(status.dwg.resetSubscriber, function (onesubscriber) {
            onesubscriber();
          });
        },
        resetSubscriber: [],
        subscribeToReset: function (callback) {
          status.dwg.resetSubscriber.push(callback);
        }
      }
    };

    angular.extend(status.pdf, originalStatus.pdf);
    angular.extend(status.dwg, originalStatus.dwg);

    return status;
  });