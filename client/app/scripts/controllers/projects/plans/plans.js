angular.module('anorakApp')
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/projects/:projectid/plans/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'PlansListPageCtrl',
        resolve: {
          resolveplanliste: ['Plans',
            function (Plans) {
              return Plans.getFromServer();
            }],
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }]
        }
      })
      .when('/projects/:projectid/plans/new/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'PlansNewPageCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }]
        }
      })
      .when('/projects/:projectid/plans/:planid/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'PlansDetailPageCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }],
          resolveplan: ['$route', 'Plans',
            function ($route, Plans) {
              return Plans.getById($route.current.params.planid);
            }],
          resolveDownloadRevisionActivitiesList: ['$route', 'Activities',
            function ($route, Activities) {
              return Activities.getRevisionDownloadsOfPlan($route.current.params.planid);
            }],
          resolveSendRevisionActivitiesList: ['$route', 'Activities',
            function ($route, Activities) {
              return Activities.getRevisionSentOfPlan($route.current.params.planid);
            }]
        }
      });

  })
  .controller('PlansListPageCtrl', function ($scope, $location, $routeParams, resolveplanliste, Projects) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'projects/plans/plans_list_page.tpl.html';
    };

    //skip animations on initial loading
    $scope.showanimations = false;

    //set navbaractivetab
    $scope.navbaractivetab = "plans";

    $scope.plans = resolveplanliste;

    $scope.currentproject = Projects.getResolvedCurrentProject();

    $scope.navigateToPlanDetail = function (planid) {
      $location.path("/projects/" + $routeParams.projectid + "/plans/" + planid + "/");
    };

    $scope.navtonewplan = { requestInProgress: false };
    $scope.navigateToNewPlan = function () {
      $scope.navtonewplan.requestInProgress = true;
      $location.path("/projects/" + $routeParams.projectid + "/plans/new/");
    };

    /*
     tagging

     checkout
     http://jsfiddle.net/BinaryMuse/cqTKG/
     http://stackoverflow.com/questions/14163027/show-an-aggregated-list-in-angularjs
     https://coderwall.com/p/-t1w2g                         e24da4aa
     http://devgirl.org/2013/03/21/fun-with-angularjs/

     */
    $scope.orderField = "name";
    $scope.previousOrderField = "";
    $scope.orderReverse = false;

    $scope.setOrderField = function (field) {
      if ($scope.orderField === field) {
        $scope.orderReverse = !$scope.orderReverse;
      } else {
        $scope.orderReverse = false;
      }
      $scope.previousOrderField = $scope.orderField;
      $scope.orderField = field;
    };

    $scope.orderByField = function (plan) {
      switch ($scope.orderField) {
        case "name":
          return plan.name;
        case "content":
          return plan.content;
        case "index":
          return plan.revisions[plan.revisions.length - 1].index;
        case "phase":
          return plan.phasetag;
        case "files_pdf":
          if (plan.revisions[plan.revisions.length - 1].pdf_file && plan.revisions[plan.revisions.length - 1].pdf_file.filename) {
            return plan.revisions[plan.revisions.length - 1].pdf_file.filename;
          }
          return "";
        case "files_dwg":
          if (plan.revisions[plan.revisions.length - 1].dwg_file && plan.revisions[plan.revisions.length - 1].dwg_file.filename) {
            return plan.revisions[plan.revisions.length - 1].dwg_file.filename;
          }
          return "";
        case "by":
          return plan.revisions[plan.revisions.length - 1].createdby.email;
        case "update":
          if ($scope.previousOrderField !== "update") {
            $scope.orderReverse = true;
          }
          return plan.modified;
      }
    };

    $scope.whichPhaseTag = {
      "idx": $scope.currentproject.phasetags.at.length
    };

    $scope.setPhaseTagIdx = function (index) {
      $scope.whichPhaseTag.idx = index;
    };

    $scope.numOfPlans = { all: 0 };
    $scope.getNumberOfPlans = function () {
      $scope.numOfPlans.all = resolveplanliste.length;
    };

    $scope.getNumberOfPlansForPhasetag = function (tag) {
      $scope.numOfPlans[tag] = 0;
      angular.forEach(resolveplanliste, function (plan) {
        if (plan.phasetag === tag) {
          $scope.numOfPlans[tag]++;
        }
      });
    };

    // filter plans by phasetag
    $scope.byPhaseTag = function (plan) {
      if ($scope.whichPhaseTag.idx === $scope.currentproject.phasetags.at.length || $scope.whichPhaseTag.idx === plan.phasetag) {
        return true;
      } else {
        return false;
      }
    };

    // filter plans by role of creator of the latest revision which is shown in the list
    $scope.filter = { roles: [""] };
    $scope.byRole = function (plan) {
      if ($scope.filter.roles.length !== 0 && $scope.filter.roles[0] !== "") {
        var latestRevision = plan.getGetLatestRevision();
        if (latestRevision.creator_roles && latestRevision.creator_roles.length > 0) {
          return $scope.filter.roles[0] === latestRevision.creator_roles[0].role;
        } else {
          return false;
        }
      }
      return true;
    };

    $scope.query = {"searchText": ""};
    $scope.queryPlans = function (plan) {

      var text = "";
      if (!$scope.query.searchText || $scope.query.searchText.length === 0) {
        return true;
      }
      text = $scope.query.searchText.toLowerCase();

      var foundFileName = false;
      angular.forEach(plan.revisions, function (revision) {

        if (revision && revision.pdf_file && revision.pdf_file.filename &&
          revision.pdf_file.filename.toLowerCase().indexOf(text) !== -1) {
          foundFileName = true;
        }
        if (revision && revision.dwg_file && revision.dwg_file.filename &&
          revision.dwg_file.filename.toLowerCase().indexOf(text) !== -1) {
          foundFileName = true;
        }
      });

      var foundModifiedBy = false;
      if (plan.modifiedby && plan.modifiedby.profile &&
        ((plan.modifiedby.profile.firstName.toLowerCase().indexOf(text) !== -1) ||
          (plan.modifiedby.profile.lastName.toLowerCase().indexOf(text) !== -1) ||
          (plan.modifiedby.email.toLowerCase().indexOf(text) !== -1))) {
        foundModifiedBy = true;
      }

      var foundCreatedBy = false;
      if (plan.createdby && plan.createdby.profile &&
        ((plan.createdby.profile.firstName.toLowerCase().indexOf(text) !== -1) ||
          (plan.createdby.profile.lastName.toLowerCase().indexOf(text) !== -1) ||
          (plan.createdby.email.toLowerCase().indexOf(text) !== -1))) {
        foundCreatedBy = true;
      }

      if (foundFileName || foundModifiedBy || foundCreatedBy || plan.name.toLowerCase().indexOf(text) !== -1 || plan.content.toLowerCase().indexOf(text) !== -1) {
        return true;

      } else {
        return false;
      }
    };

  })
  .controller('PlansDetailPageCtrl', function (APP_CONFIG, $scope, $location, $routeParams, $route, $timeout, resolveplan, Projects, Activities, $q, resolveDownloadRevisionActivitiesList, resolveSendRevisionActivitiesList, Plans, orderByFilter, $window) {
    //checkout http://www.bennadel.com/blog/2450-Using-ngController-With-ngRepeat-In-AngularJS.htm for per item controller behaviour
    'use strict';

    $scope.getPagePartial = function () {
      return 'projects/plans/plans_detail_page.tpl.html';
    };

    //set navbaractivetab
    $scope.navbaractivetab = "plans";

    //get plan
    $scope.plan = resolveplan;
    $scope.currentproject = Projects.getResolvedCurrentProject();

    $scope.downloadrequesturl = APP_CONFIG.APIUrl;

    $scope.navigateToPlanList = function () {
      $location.path("/projects/" + $routeParams.projectid + "/plans/");
    };

    /*
     old revisions list
     */

    $scope.showAllRevisions = function () {
      $scope.showallrevisionsflag = true;
    };

    $scope.hideAllRevisions = function () {
      $scope.showallrevisionsflag = false;
    };

    /* edit plan phase */
    $scope.phase = { edit: false };
    $scope.phase = { tag: $scope.plan.phasetag };

    $scope.setPhaseTagIndex = function (index) {
      $scope.phase.tag = index;
    };

    $scope.updateplanphase = { requestInProgress: false };

    $scope.updatePlanPhase = function () {
      $scope.updateplanphase.requestInProgress = true;

      if ($scope.plan.phasetag === $scope.phase.tag) {
        return;
      }

      $scope.plan.phasetag = $scope.phase.tag;

      $scope.plan.updatePhase(
        function (plan) {
          $scope.debug("plan phase update success", plan);
          $scope.phase.edit = false;
          $scope.updateplanphase.requestInProgress = false;
        },
        function (err) {
          $scope.debug("plan phase update failed", err);
          $scope.phase.edit = false;
          $scope.updateplanphase.requestInProgress = false;
        }
      );
    };

    $scope.cancelUpdatePlanPhase = function () {
      $scope.phase.tag = $scope.plan.phasetag;
      $scope.phase.edit = false;
    };

    $scope.getPhaseTagLabel = function (phaseTagIdx) {
      var idx = 0;
      var tag = _.find($scope.currentproject.phasetags.at, function (phaseTag) {
        if (phaseTagIdx === idx) {
          return phaseTag;
        } else {
          idx++;
        }
      });
      return tag.label;
    };

    $scope.downloadRevision = function (revision, fileType, update) {
      //ensure that file exists in revision
      if (!$scope.isFileInRevision(revision, fileType)) {
        return;
      }

      // download
      if (update === true) {
        // @TODO downloadRevision - make it promise based to handle error in one place, not two functions as now
        $scope.plan.downloadRevision(revision._id, fileType, function (url) {
          // this workaround because browser opens always a new window, when not in a function directly called by the user

          Activities.getRevisionDownloadsOfPlan($routeParams.planid)
            .then(function (activities) {
              $scope.addLogToRevision(activities, "downloadRevision", "downloader");
              $window.location.href = url.url;

            })
            .catch(function (error) {
              $scope.debug("Error in getting download activities ", error);
            });

        }, function (error) {
          $scope.debug("Error when trying to get revision", error);
        });
      }
    };

    $scope.isFileInRevision = function (revision, fileType) {
      var flag = false;
      // first ensure that file exists in revision
      if (fileType === "dwg") {
        if (revision.dwg_file && revision.dwg_file.filename) {
          if (revision.dwg_file.filename.length > 0) {
            flag = true;
          }
        }
      } else if (fileType === "pdf") {
        if (revision.pdf_file && revision.pdf_file.filename) {
          if (revision.pdf_file.filename.length > 0) {
            flag = true;
          }
        }
      }
      return flag;
    };

    $scope.allDownloads = {};
    $scope.allRecipients = {};
    $scope.showReceivers = { list: [] }; // receivers of the plan, that means displayed in the view and checkbox checked
    $scope.receivers = [];
    // scope here, because this method is also used in NewRevisionCtrl which is a child of this controller
    $scope.addLogToRevision = function (activities, eventType, userType) {

      // copy plan.revisions list to local object
      var localRevisionsList = [];
      angular.copy($scope.plan.revisions, localRevisionsList);

      // loop through revisions and attach activitylog to each revision
      angular.forEach(localRevisionsList, function (revision) {

        var userObjects = [];
        var revisionId = revision._id;

        if (!revision.activitylog) {
          revision.activitylog = {};
        }

        revision.activitylog[eventType] = {};
        revision.activitylog[eventType].users = [];

        _.each(activities, function (event) {

          if (revisionId === (event.doc.revisionid || event.doc.revision._id)) {
            // event.doc[recipients] is an array of users
            // event.doc[downloader] is one user
            if (eventType === "sendRevision") {
              angular.forEach(event.doc[userType], function (user) {
                user.date = event.date;
              });
              // prepare showReceivers list for view
              $scope.receivers.push(event);

              userObjects = userObjects.concat(event.doc.recipients);

            } else if (eventType === "downloadRevision") {
              //initialize event.doc.downloader to make property downloader writeable
              event.doc.downloader = {};
              event.doc.downloader.date = event.date;
              event.doc.downloader.user = event.user;
              event.doc.downloader.action = event.action;
              userObjects.push(event.doc.downloader);
            }
          }
        });

        if (eventType === "downloadRevision") {
          userObjects = orderByFilter(userObjects, ['-date']);
          $scope.allDownloads[revision._id] = { num: _.uniq(userObjects,function (userlog) {
            return userlog.user.email;
          }).length };
          //downloadRevision
        } else if (eventType === "sendRevision") {
          $scope.allRecipients[revision._id] = { num: _.uniq(userObjects,function (userlog) {
            return userlog.email;
          }).length };
          userObjects = orderByFilter(userObjects, ['-date']);
        } // sendRevision

        // copy activitylog to current revision
        angular.copy(userObjects, revision.activitylog[eventType].users);

      });// loop throuch each revision end

      // put back revisionlist to plan.revisions
      angular.copy(localRevisionsList, $scope.plan.revisions);

      // get receivers to display in view
      if (eventType === "sendRevision") {

        var keysArray = _.keys(_.groupBy($scope.receivers, function (event) {
          return event.date;
        }));
        var latestDate = _.sortBy(keysArray, function (key) {
          return -(new Date(key));
        })[0];

        $scope.showReceivers.list = _.groupBy($scope.receivers, function (event) {
          return event.date;
        });

        if ($scope.showReceivers.list && $scope.showReceivers.list[latestDate] && $scope.showReceivers.list[latestDate][0] && $scope.showReceivers.list[latestDate][0].doc) {
          $scope.showReceivers.list = $scope.showReceivers.list[latestDate][0].doc.recipients;
        }

      }

    };

    $scope.addLogToRevision(resolveDownloadRevisionActivitiesList, "downloadRevision", "downloader");
    $scope.addLogToRevision(resolveSendRevisionActivitiesList, "sendRevision", "recipients");

    $scope.resetPlanMailer = function () {
      $scope.bksendplan.toggle = false;
      $scope.emailWasSent.message = "";
    };

    var clearMailForm = function () {
      $scope.hide = {};
      $scope.email.address = "";
      $scope.$$childTail.$$childTail.mailForm.$setPristine(); // TODO better way to find stuff in scope?
      $scope.emailAddresses.list = [];
      $scope.checkCheckboxOf.list = [];
      $scope.sendTo.list = [];

      $scope.sendrevision.requestInProgress = false;
      $scope.sendrevision.norecipienterror = false;
    };

    var updateProjectAfterSending = function () {
      Projects.findById($scope.currentproject._id)
        .then(function (project) {
          $scope.currentproject = project;
          clearMailForm();
        })
        .catch(function (error) {
          $scope.debug("Error in refreshing project ", error);
          clearMailForm();
        });
    };

    $scope.emailWasSent = {message: "", sendErrors: []};
    $scope.emailWasSent.error = false;
    var createMessageAndSend = function () {
      var revision = $scope.plan.getGetLatestRevision();

      $scope.plan.sendRevision($scope.currentproject.title, $scope.plan, revision._id, $scope.sendTo.list)
        .then(function (activities) {
          $scope.debug("Successfully sent revision", activities);

          // sort activities by date so we have the current activity first
          activities = _.sortBy(activities, function (activity) {
            return -(new Date(activity.date));
          });

          // check if current activity has errors to be shown to user
          $scope.emailWasSent.error = false;
          $scope.emailWasSent.message = "sentSuccess";
          if (activities[0].doc.sendErrors && activities[0].doc.sendErrors.length !== 0) {
            $scope.emailWasSent.error = true;
            $scope.emailWasSent.message = "error";
            angular.copy(activities[0].doc.sendErrors, $scope.emailWasSent.sendErrors);
          }

          // after successful sending, update activity list and attach message to revision
          $scope.addLogToRevision(activities, "sendRevision", "recipients");
          updateProjectAfterSending();
        })
        .catch(function (error) {
          $scope.debug("Error in sending", error);
          $scope.emailWasSent.message = "error";
          $scope.emailWasSent.error = true;
          updateProjectAfterSending();
        });
    };

    $scope.emailAddresses = { list: [] }; // all email addresses in the view
    $scope.checkCheckboxOf = { list: [] }; // newly added users will have their checkbox checked
    $scope.sendTo = { list: [] }; // receivers of the plan, that means displayed in the view and checkbox checked
    $scope.sendrevision = {
      requestInProgress: false,
      norecipienterror: false
    };

    $scope.sendRevision = function () {
      $scope.debug("sendRevision Called");
      if (!$scope.sendrevision.requestInProgress) {
        if ($scope.sendTo.list.length > 0) {
          $scope.sendrevision.requestInProgress = true;
          $scope.sendTo.list = _.uniq($scope.sendTo.list);
          createMessageAndSend();
        } else {
          $scope.sendrevision.norecipienterror = true;
        }
      }
    };

// participant ids of people that you will send a plan to
    $scope.toggleReceiver = function (email) {
      if ($scope.sendTo.list.indexOf(email) === -1) {
        $scope.sendTo.list.push(email);
      } else {
        $scope.sendTo.list = _.without($scope.sendTo.list, email);
      }
    };

    $scope.bksendplan = { toggle: false };

    $scope.isSilentUser = function (participant) {
      return participant.permission === 'silent';
    };
    $scope.isNotSilentUser = function (participant) {
      return participant.permission !== 'silent';
    };

    $scope.addEmailAddress = function (email) {

      if (checkIfEmailAddressExists(email) === false) {
        $scope.checkCheckboxOf.list.push(email);
        $scope.emailAddresses.list.push(email);
        $scope.sendTo.list.push(email);
        $scope.email.error = "invalidAddress";

        $scope.email.address = "";
        // this is 2 times subordinated to $scope
        this.mailForm.$setPristine();

      } else {
        $scope.email.error = "addressExists";
        this.mailForm.email.$valid = false;
      }

      $timeout(function () {
        $scope.$apply();
      });
    };

    $scope.email = {address: ""};
    $scope.email = { error: "invalidAddress" };
    var checkIfEmailAddressExists = function (email) {
      var emailExists = false;
      // check if the email already exists in participants
      // check if it already exists in external addresses
      // display message if so
      // otherwise add and refresh display
      angular.forEach($scope.currentproject.participants, function (participant) {
        if (participant.user.email === email) {
          emailExists = true;
        }
      });
      if ($scope.emailAddresses.list.indexOf(email) !== -1) {
        emailExists = true;
      }
      return emailExists;
    };

    $scope.hide = {};
    $scope.removeFromView = function (email) {
      $scope.hide[email] = true;

      $scope.emailAddresses.list = _.without($scope.emailAddresses.list, email);
      $scope.checkCheckboxOf.list = _.without($scope.checkCheckboxOf.list, email);
      $scope.sendTo.list = _.without($scope.sendTo.list, email);

      $timeout(function () {
        $scope.$apply();
      });
    };

    $scope.closeMailForm = function () {
      $scope.resetPlanMailer();
      clearMailForm();
    };

  })
  .controller('PlansNewPageCtrl', function ($scope, $location, $routeParams) {
    //checkout http://www.bennadel.com/blog/2450-Using-ngController-With-ngRepeat-In-AngularJS.htm for per item controller behaviour
    'use strict';

    $scope.getPagePartial = function () {
      return 'projects/plans/plans_new_page.tpl.html';
    };

    //set navbaractivetab
    $scope.navbaractivetab = "plans";

    $scope.navigateToPlanList = function () {
      $location.path("/projects/" + $routeParams.projectid + "/plans/");
    };

  })
  .controller('PlansNewCtrl', function (APP_CONFIG, $scope, $location, $routeParams, $route, Plans, Projects, $rootScope, currentUser, $timeout, s3uploadservice, fileuploadcheck) {
    //checkout http://www.bennadel.com/blog/2450-Using-ngController-With-ngRepeat-In-AngularJS.htm for per item controller behaviour
    'use strict';

    $scope.revision = {};
    $scope.plan = {};
    $scope.s3uploadservice = s3uploadservice;
    $scope.s3uploadservice.pdf.reset();
    $scope.s3uploadservice.dwg.reset();

    // initialize fileuploadcheck in clean state
    // @TODO - find better solution to avoid call of reset()
    fileuploadcheck.reset();
    $scope.fileuploadcheck = fileuploadcheck;

    $scope.downloadrequesturl = APP_CONFIG.APIUrl + "s3/download/?s3fileurl=";

    $scope.currentproject = Projects.getResolvedCurrentProject();
    $scope.whichPhaseTag = {};

    $scope.setPhaseTagIndex = function (index) {
      $scope.whichPhaseTag.idx = index;
    };

    $scope.onRevisionCreated = function () {
      $scope.showuploadrevisiondialog = false;
      $scope.revision = {};
    };

    $scope.submitted = {
      it: false
    };
    $scope.saveplan = { requestInProgress: false };

    $scope.save = function (valid) {

      // submitted.it is used in view to display messages after submit has been done
      $scope.submitted.it = true;

      $scope.fileuploadcheck.submitted = true;

      if (!fileuploadcheck.uploaded || !valid || $scope.whichPhaseTag.idx === undefined) {
        $scope.debug("Cannot save form, it is not valid");
        return;
      }

      $scope.saveplan.requestInProgress = true;

      var participant = _.find($scope.currentproject.participants, function (participant) {
        return participant.user._id === currentUser.info().id;
      });

      var planresource = new Plans();

      var plandata = {
        "name": $scope.plan.name,
        "content": $scope.plan.content,
        "tags": [],
        "phasetag": $scope.whichPhaseTag.idx,
        "projectid": $routeParams.projectid,
        "revisions": [
          {
            "revisionindex": 0,
            "index": $scope.revision.index,
            "pdf_file": {
              "key": $scope.s3uploadservice.pdf.key,
              "filename": $scope.s3uploadservice.pdf.filename,
              "filesize": $scope.s3uploadservice.pdf.filesize
            },
            "dwg_file": {
              "key": $scope.s3uploadservice.dwg.key,
              "filename": $scope.s3uploadservice.dwg.filename,
              "filesize": $scope.s3uploadservice.dwg.filesize
            },
            "comment": $scope.revision.comment,
            "creator_roles": participant && participant.roles && participant.roles.length > 0 ? participant.roles : []
          }
        ]
      };
      angular.extend(planresource, plandata);
      // its a new plan, which is stored as first revision on index 0, which also makes revisionindex 0

      planresource.$save()
        .then(function (plan) {
          $scope.currentproject = Projects.getResolvedCurrentProject();
          $location.path("/projects/" + $routeParams.projectid + "/plans/" + plan._id + "/");

        })
        .catch(function (err) {
          $scope.debug("Error while plan saving", err);
          $scope.saveplan.requestInProgress = false;
        });
    };

  })
  .controller('NewRevisionCtrl', function ($scope, $rootScope, Activities, currentUser, s3uploadservice, fileuploadcheck, Projects) {
    'use strict';

    $scope.s3uploadservice = s3uploadservice;
    $scope.s3uploadservice.pdf.reset();
    $scope.s3uploadservice.dwg.reset();

    // initialize fileuploadcheck in clean state
    // @TODO - find better solution to avoid call of reset()
    fileuploadcheck.reset();
    $scope.fileuploadcheck = fileuploadcheck;

    $scope.revision = {};

    $scope.onRevisionCreated = function () {
      $scope.showuploadrevisiondialog = false;
      $scope.revision = {};
      fileuploadcheck.reset();
    };

    $scope.submitted = { it: false };
    $scope.fileUploaded = { check: false };
    $scope.addrevision = { requestInProgress: false };
    $scope.addRevision = function (isValFormNewRevisionValid) {

      // submitted.it is used in view to display messages after submit has been done
      $scope.submitted.it = true;
      $scope.fileuploadcheck.submitted = true;

      if (!fileuploadcheck.uploaded || !isValFormNewRevisionValid) {
        $scope.debug("Cannot save, form is not valid");
        return;
      }

      $scope.addrevision.requestInProgress = true;
      var participant = _.find($scope.currentproject.participants, function (participant) {
        return participant.user._id === currentUser.info().id;
      });

      var tempplan = {};
      var revision = {
        "index": $scope.revision.index,
        "pdf_file": {
          "key": $scope.s3uploadservice.pdf.key,
          "filename": $scope.s3uploadservice.pdf.filename,
          "filesize": $scope.s3uploadservice.pdf.filesize
        },
        "dwg_file": {
          "key": $scope.s3uploadservice.dwg.key,
          "filename": $scope.s3uploadservice.dwg.filename,
          "filesize": $scope.s3uploadservice.dwg.filesize
        },
        "comment": $scope.revision.comment,
        "creator_roles": participant && participant.roles && participant.roles.length > 0 ? participant.roles : []
      };

      angular.copy($scope.$parent.plan, tempplan);
      tempplan.revisions.unshift(revision);

      // @TODO - promise based addRevision
      tempplan.addRevision(
        function (plan) {
          //update plan object in parent scope ($scope.$parent.plan) with data from server
          angular.extend($scope.$parent.plan, plan);
          $scope.plansuccessfullystoredonserver = true;

          $scope.currentproject = Projects.getResolvedCurrentProject();
          $scope.onRevisionCreated();

          Activities.getRevisionDownloadsOfPlan($scope.$parent.plan._id).then(function (activities) {
            $scope.addLogToRevision(activities, "downloadRevision", "downloader");
          });

          Activities.getRevisionSentOfPlan($scope.$parent.plan._id).then(function (activities) {
            $scope.addLogToRevision(activities, "sendRevision", "recipients");
          });

          $scope.addrevision.requestInProgress = false;
        },
        function (err) {
          $scope.debug("plan add revision error", err);
          $scope.addrevision.requestInProgress = false;
        });
    };

    $scope.closeUploadRevisionDialog = function () {
      //close new revision dialog
      $scope.showuploadrevisiondialog = false;
      // reset revision and fileuploadstates
      $scope.revision = {};
    };

    $scope.openUploadRevisionDialog = function () {
      $scope.showuploadrevisiondialog = true;
      $scope.submitted.it = false;
      $scope.resetPlanMailer();
      $scope.s3uploadservice.pdf.reset();
      $scope.s3uploadservice.dwg.reset();
    };

  })
  .controller('EditPlanNameCtrl', function (APP_CONFIG, $scope) {
    //checkout http://www.bennadel.com/blog/2450-Using-ngController-With-ngRepeat-In-AngularJS.htm for per item controller behaviour
    'use strict';
    $scope.storedPlanData = {};

    $scope.editPlanName = function () {
      $scope.editplannameflag = true;
      //store plan data
      angular.copy($scope.plan, $scope.storedPlanData);
    };

    $scope.editPlanNameCancel = function () {
      $scope.editplannameflag = false;
      //restore plan data on cancel
      angular.copy($scope.storedPlanData, $scope.plan);
    };

    $scope.saveplannameisinprogress = false;
    $scope.updatePlanName = function () {
      if (!$scope.editPlanNameValForm.$invalid && $scope.editplannameflag && !$scope.saveplannameisinprogress) {
        $scope.saveplannameisinprogress = true;

        // @TODO updateName has to be promise based
        $scope.plan.updateName(
          function () {
            $scope.editplannameflag = false;
            $scope.saveplannameisinprogress = false;
          }, function () {
            $scope.saveplannameisinprogress = false;
          });
      }

    };

  });