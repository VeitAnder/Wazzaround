/*
angular.module('resources.activities', ['mongolabResource'])
  .factory('Activities', function (mongolabResource, $http) {
    "use strict";

    var Activities = mongolabResource('activities');

    // if activity-action === postplanrevision
    Activities.prototype.getPlanRevisionIndex = function () {
      var revisionindex = "";
      var activity = this;

      if (activity.action === "postplanrevision") {
        angular.forEach(activity.doc.plan.revisions, function (revision) {
          if (activity.doc.revisionid === revision._id) {
            revisionindex = revision.revisionindex;
          }
        });
      }
      return revisionindex;
    };

    Activities.getAllFromProject = function (projectid) {
      return Activities.query({ projectid: projectid });
    };

    Activities.getAllFromProjectOfParticipant = function (projectid, participantid) {
      return Activities.query({ projectid: projectid, participantid: participantid });
    };

    Activities.getPdfFileDownloads = function (projectid) {
      return Activities.query({ projectid: projectid, action: "getplanrevisionpdf"});
    };

    Activities.getDwgFileDownloads = function (projectid) {
      return Activities.query({ projectid: projectid, action: "getplanrevisiondwg"});
    };

    Activities.getRevisionDownloadsOfPlan = function (planid, successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/revisiondownloads", { params: { "planid": planid} });
      return this.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Activities.getRevisionSentOfPlan = function (planid, successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/revisionsent", { params: { "planid": planid} });
      return this.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    return Activities;
  });
*/