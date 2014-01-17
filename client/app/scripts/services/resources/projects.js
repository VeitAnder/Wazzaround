angular.module('resources.projects', ['mongolabResource'])
  .factory('Projects', function (mongolabResource, $route, $q, $http, currentUser) {
    "use strict";

    var Projects = mongolabResource('projects');

    /*
     extend Projects with resolved local data
     */
    var datacollection;

    /*
     extend Projects with resolved local data
     */

    // invite/add participant to project
    Projects.prototype.addParticipant = function (participant) {
      var promise = $http.post(this.getUrl() + "/" + this._id + "/participants/", participant, { });
      return promise;
    };

    // only update title of project
    Projects.prototype.updateTitle = function (successcb, errorcb) {
      var httpPromise = $http.put(this.getUrl() + "/" + this._id + "/title/", this, { });
      return Projects.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    // get the participant id via the user id
    Projects.prototype.getParticipantIdFromUserId = function (userId) {
      var participantid;
      angular.forEach(this.participants, function (participant) {
        if (participant.user._id === userId) {
          participantid = participant._id;
        }
      });
      return participantid;
    };

    // get the participant by id
    Projects.prototype.getParticipantById = function (participantId) {
      var foundparticipant;
      angular.forEach(this.participants, function (participant) {
        if (participant._id === participantId) {
          foundparticipant = participant;
        }
      });
      return foundparticipant;
    };

    // get the participant id via the email address
    Projects.prototype.getParticipantIdFromUserEmailAdress = function (email) {
      var participantid;
      angular.forEach(this.participants, function (participant) {
        if (participant.user.email === email) {
          participantid = participant._id;
        }
      });
      return participantid;
    };

    // get the participant id via the user id
    Projects.prototype.getProjectOwner = function () {
      var project = this;
      var participant = _.find(project.participants, function (participant) {
        return participant.permission === "owner";
      });
      return participant;
    };

    // get the phase tag label via it's id
    Projects.prototype.getPhaseTagLabelById = function (phasetagid) {
      return this.phasetags.at[phasetagid].label;
    };

    Projects.prototype.isCurrentProject = function () {
      if (this.$id() === $route.current.params.projectid) {
        return true;
      } else {
        return false;
      }
    };

    // Access control stuff
    Projects.prototype.isCurrentUserProjectOwner = function () {
      var ownerflag = false;
      var participants = this.participants;

      var currentuserid = currentUser.info().id;

      angular.forEach(participants, function (participant) {
        if (participant.user._id === currentuserid && participant.permission === "owner") {
          ownerflag = true;
        }
      });
      return ownerflag;
    };

    Projects.prototype.isCurrentUserProjectAdmin = function () {
      var ownerflag = false;
      var participants = this.participants;
      var currentuserid = currentUser.info().id;

      angular.forEach(participants, function (participant) {
        if (participant.user._id === currentuserid && participant.permission === "admin") {
          ownerflag = true;
        }
      });
      return ownerflag;
    };

    // get the users permission in this project
    Projects.prototype.getPermissionOfUserViaEmail = function (email) {
      var permission;
      angular.forEach(this.participants, function (participant) {
        if (participant.user.email === email) {
          permission = participant.permission;
        }
      });
      return permission;
    };

    // ACL end

    // only update roles of project
    Projects.prototype.updateRoles = function (successcb, errorcb) {
      var httpPromise = $http.put(this.getUrl() + "/" + this._id + "/roles/", this, { });
      return Projects.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Projects.prototype.updateRolesOfParticipant = function (participantid) {
      var promise = $http.put(this.getUrl() + "/" + this._id + "/participants/" + participantid + "/roles/", this, { });
      return promise;
    };

    // resolve resolveProjectsList() on every route with controllers that inject Projects
    Projects.resolveProjectsList = function () {
      var promise = Projects.all().then(function (data) {
        datacollection = data;
        return data;
      });
      return promise;
    };

    Projects.getResolvedProjectsList = function () {
      return datacollection;
    };

    Projects.getResolvedCurrentProject = function () {
      var current = _.find(datacollection, function (project) {
        if (project.$id() === $route.current.params.projectid) {
          return project;
        }
      });
      return current;
    };

    // get empty project model
    Projects.newprojectmodel = function (successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/new");
      return Projects.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Projects.findById = function (projectId, successcb, errorcb) {
      var httpPromise = $http.get(this.getUrl() + "/" + projectId);
      return Projects.thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Projects.findAllParticipants = function (projectid) {
      var deferred = $q.defer();

      $http.get(this.getUrl() + "/" + projectid + "/participants/")
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });

      return deferred.promise;
    };

    Projects.findParticipantById = function (projectid, participantid) {
      var deferred = $q.defer();
      $http.get(this.getUrl() + "/" + projectid + "/participants/" + participantid)
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });
      return deferred.promise;
    };

    Projects.disableParticipant = function (projectid, participantid) {
      var deferred = $q.defer();
      $http.put(this.getUrl() + "/" + projectid + "/participants/" + participantid + "/changeenabledstate", {enabled: false})
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });
      return deferred.promise;
    };

    Projects.enableParticipant = function (projectid, participantid) {
      var deferred = $q.defer();
      $http.put(this.getUrl() + "/" + projectid + "/participants/" + participantid + "/changeenabledstate", {enabled: true})
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });
      return deferred.promise;
    };

    Projects.updateCompanyOfParticipant = function (projectid, participantid, company) {
      var deferred = $q.defer();
      $http.put(this.getUrl() + "/" + projectid + "/participants/" + participantid + "/company", {"company": company })
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });
      return deferred.promise;
    };

    Projects.updateNameOfParticipant = function (projectid, participantid, firstname, lastname) {
      var deferred = $q.defer();
      $http.put(this.getUrl() + "/" + projectid + "/participants/" + participantid + "/name", {"firstname": firstname, "lastname": lastname })
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(data || "Request failed");
        });
      return deferred.promise;
    };

    return Projects;
  });