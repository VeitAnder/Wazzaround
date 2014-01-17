angular.module('resources.users', ['mongolabResource'])
  .factory('Users', function (mongolabResource, $http) {
    "use strict";

    var Users = mongolabResource('users');

    Users.prototype.getFullName = function () {
      return this.lastName + " " + this.firstName + " (" + this.email + ")";
    };

    Users.prototype.setPassword = function (password) {
      var promise = $http.post(this.getUrl() + "/" + this._id + "/password/", {password: password}, { });
      return promise;
    };

    Users.prototype.updateProfile = function () {
      var promise = $http.put(this.getUrl() + "/" + this._id + "/profile/", {profile: this.profile}, { });
      return promise;
    };

    Users.allUsers = function () {
      return Users.query();
    };

    Users.sendMail = function () {
      var promise = $http.post(this.getUrl() + "/mail");
      return promise;
    };

    Users.sendSupportMail = function (info, topic, text, successcb, errorcb) {
      var httpPromise = $http.post(this.getUrl() + "/mail/support/", { info: info, topic: topic, text: text });
      return this.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    return Users;
  });
