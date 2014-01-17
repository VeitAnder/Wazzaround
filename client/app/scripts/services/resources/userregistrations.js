angular.module('resources.userregistrations', ['mongolabResource'])
  .factory('UserRegistrations', function (mongolabResource, $http) {
    "use strict";

    var UserRegistrations = mongolabResource('userregistrations');

    //invite participant to project
    UserRegistrations.isEmailAvailableForLoginAccount = function (email) {
      return $http.get(this.getUrl() + "/isemailavailableforloginaccount", { "params": {"email": email} });
    };

    return UserRegistrations;
  });
