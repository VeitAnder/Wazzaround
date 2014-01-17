angular.module('resources.plans', ['mongolabResource'])
  .factory('Plans', function (mongolabResource, $route, $http) {
    "use strict";

    var Plans = mongolabResource('plans');  // resource without slashes

    var datacollection;

    // add Revision to Plan
    Plans.prototype.addRevision = function (successcb, errorcb) {
      var httpPromise = $http.post(this.getUrl() + "/" + this._id + "/revisions/", this);
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    // update plan name
    Plans.prototype.updateName = function (successcb, errorcb) {
      var httpPromise = $http.put(this.getUrl() + "/" + this._id + "/name/", this);
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    // update plan phase
    Plans.prototype.updatePhase = function (successcb, errorcb) {
      var httpPromise = $http.put(this.getUrl() + "/" + this._id + "/phase/", this);
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    // get latest Revision of plan
    Plans.prototype.getGetLatestRevision = function () {
      var orderedRevisions = _.sortBy(this.revisions, function (revision) {
          return -new Date(revision.created);
        }
      );
      return orderedRevisions[0];
    };

    Plans.prototype.downloadRevision = function (revisionId, fileType, successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/" + this._id + "/revisions/" + revisionId + "/" + fileType + "/");
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Plans.prototype.sendRevision = function (projectTitle, plan, revisionId, recipients, successcb, errorcb) {
      var httpPromise = $http.post(this.getUrl() + "/mail", {
        "projectTitle": projectTitle,
        "plan": plan,
        "revisionId": revisionId,
        "recipients": recipients });
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Plans.get = function () {
      return datacollection;
    };

    Plans.getFromServer = function () {
      var promise = Plans.query({"projectid": $route.current.params.projectid}).then(function (data) {
        datacollection = data;
        return data;
      });
      return promise;
    };

    Plans.getDownloadLink = function (planId, revisionId, fileType, successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/" + planId + "/revisions/" + revisionId + "/" + fileType + "/");
      return Plans.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    return Plans;
  });