angular.module('services.httpRequestTracker', [])
  .factory('httpRequestTracker', function ($http) {
    "use strict";

    var httpRequestTracker = {
      addPendingRequest: function () {
        this.numberOfExternalPendingRequests += 1;
      },
      removePendingRequest: function () {
        this.numberOfExternalPendingRequests -= 1;
        if (this.numberOfExternalPendingRequests < 0) {
          this.numberOfExternalPendingRequests = 0;
        }
      },
      numberOfExternalPendingRequests: 0
    };

    httpRequestTracker.hasPendingRequests = function () {
      return $http.pendingRequests.length > 0 || httpRequestTracker.numberOfExternalPendingRequests > 0;
    };

    return httpRequestTracker;
  });