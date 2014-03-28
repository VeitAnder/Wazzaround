'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditPageCtrl', function ($scope, activity, categories) {

    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/edit.html';
    };

    $scope.activity = activity;
    $scope.categories = categories;

  })
  .controller('AdminMyactivitiesEditCtrl', function ($scope, APP_CONFIG, $http, $location, activitybackendmap, $route, $rootScope, $translate) {

    console.log("AdminMyactivitiesEditCtrl executed");

    $translate('Your unsaved data will be lost if you leave this page').then(function (leavepagequestion) {
      $scope.$on("$locationChangeStart", function (event) {
        var leavepage;
        if (!$scope.noDataEntered() && !$scope.state.saveinprogress) {
          leavepage = confirm(leavepagequestion);
          if (!leavepage) {
            event.preventDefault();
          }
        }
      });
    });

    $scope.originalActivity = {};

    $scope.noDataEntered = function () {
      return angular.equals($scope.originalActivity, $scope.activity);
    };

    //only check once at initialization time
    if ($route.current.$$route.originalPath === "/admin/myactivities/new") {
      $scope.newMode = true;
    } else {
      $scope.newMode = false;
    }

    // don't initialize activity and category if a new one is created
    // otherwise already entered data will vanisch on language change!
    if (!$scope.newMode) {
      $scope.categories = $scope.$parent.categories;
      $scope.activity = $scope.$parent.activity;

      $scope.originalActivity = angular.copy($scope.activity);
    }

    $scope.state = {
      submitted: false,
      saveinprogress: false,
      formfieldslanguage: {
        name: "",
        description: ""
      },
      additionalformchecks: {
        images: true,
        bookableevents: true
      }
    };

    $scope.createEventSeries = function (item, event) {
      console.log("createRepeatingEvents called", item, event);

      if (!event.repeating) {
        return;
      }

      var startDate = moment(event.start);
      // ensure that date format is in english to ensure weekday comparison is always against english weekdays
      startDate.lang('en');
      var duration = event.duration;
      var quantity = event.quantity;
      var endDate = moment(event.end).hour(23).minute(59);

      if (moment().subtract('days', 1) > startDate) {
        console.log("you're trying to add events in the past");
        return;
      }

      if (endDate.diff(startDate, 'years') > 2) {
        console.log("you're trying to add events for more than two years");
        return;
      }

      startDate.add('days', 1);  // start Date + 1

      while (startDate <= endDate) {
        // add new event
        if (event.dayOfWeek[startDate.format('ddd')]) {  // Wochentag angehakt
          console.log('Create Event at: ', startDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

          var newEvent = item.createEvents();

          newEvent.start = new Date(startDate.toDate());
          newEvent.duration = duration;
          newEvent.quantity = quantity;
        }
        startDate.add('days', 1);
      }

    };

    $scope.createEvent = function (bookableItem) {
      var event = bookableItem.createEvents();
      event.start = new Date();

      bookableItem.events[bookableItem.events.length - 1].mode = 'new';
      //event.mode = 'edit';   // funktioniert so leider nicht
    };

    $scope.removeEvent = function (item, idx) {
//      if (item.events[idx]._reference) {
//        item.events[idx].ref().remove().done();
//      }  // if already persisted
      item.events.splice(idx, 1);  // remove from array
    };

    $scope.removeItem = function (item, idx) {

      _.forEach(item.events, function (event) {  // remove saved events
        console.log("TODO: remove this event");   // TODO
      });

//      item.remove().done();
      $scope.activity.bookableItems.splice(idx, 1);
    };

    $scope.moment = moment;
    $scope.moment.lang($translate.use());

    $scope.isNewMode = function () {
      return $scope.newMode;
    };

    /* handle activity input language */
    // set language if not already set in activity
    if (!$scope.activity.inputlanguage) {
      $scope.activity.inputlanguage = $translate.use();
    }

    // when language changes globally, reset also in directive
    $rootScope.$on('$translateChangeSuccess', function () {
      $scope.activity.inputlanguage = $translate.use();
    });

    $scope.getInputLanguage = function () {
      return $translate.use();
    };
    /* handle activity input language end */

    $scope.getSubCategories = function () {
      var maincategory = _.find($scope.categories, { 'key': $scope.activity.category.main });
      if (maincategory) {
        return maincategory.sub;
      }
    };

    $scope.isKeyInSubcats = function (key) {
      var found = _.filter($scope.activity.category.subs, function (sub) {
        if (sub.key === key) {
          return true;
        }
      });
      if (found.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.setSubcat = function (key) {
      if (!$scope.activity.category.subs) {
        $scope.activity.category.subs = [];
      }
      if ($scope.isKeyInSubcats(key)) {
        _.remove($scope.activity.category.subs, { 'key': key });
      } else {
        $scope.activity.category.subs.push({ 'key': key });
      }
    };

    $scope.map = activitybackendmap.map;

    activitybackendmap.centerMapAndMarker($scope.activity);

    $scope.getMarkerIcon = function () {
      if ($scope.activity.category.main) {
        return "/img/mapicons/marker-" + $scope.activity.category.main + ".svg";
      } else {
        return "/img/mapicons/marker.svg";
      }
    };

    $scope.getMarkerLabel = function () {
      return "Activity location";
    };

    // address:
    // user enters address
    // address will be set on
    $scope.setAddressOnMap = function () {
      activitybackendmap.findAddressOnMap(activitybackendmap.map, $scope.activity);
      $scope.map = activitybackendmap.map;
    };

    $rootScope.$on("SetAddressEvent", function (event, message) {
      if ($scope.map.address) {
        $scope.activity.address = $scope.map.address;
      }
      $scope.activity.latitude = $scope.map.clickedMarker.latitude;
      $scope.activity.longitude = $scope.map.clickedMarker.longitude;
    });

    $rootScope.$on("EditMapChangeEvent", function (event, message) {
      debug("EDIT MAP CHANGED !!! MARKERS: ", $scope.map.markers);
      //update model and set marker to display result to user
      $scope.activity.latitude = $scope.map.center.latitude;
      $scope.activity.longitude = $scope.map.center.longitude;
      $scope.map.clickedMarker.latitude = $scope.map.center.latitude; // TODO move to service?
      $scope.map.clickedMarker.longitude = $scope.map.center.longitude;
      $scope.map.clickedMarker.title = 'Location of activity';
    });

    // Save the Activiy
    $scope.save = function () {
      debug("save() called");

      $scope.state.submitted = true;

      $scope.additionalFormChecks();

      // TODO: validierung ist im Arsch!
      if ($scope.valForm.$valid && $scope.additionalFormChecks()) {

        // check if there was only a marker set or an address entered
        if (!$scope.activity.latitude) {
          $scope.activity.latitude = $scope.map.clickedMarker.latitude;
          $scope.activity.longitude = $scope.map.clickedMarker.longitude;
        }

        $scope.state.saveinprogress = true;

        Q()
          .then(function () {
            var saveEventsPromises = [];
            _.forEach($scope.activity.bookableItems, function (item) {
              _.forEach(item.ref().events, function (event) {
                saveEventsPromises.push(event.ref().save());  // save the events
              });
            });
            return Q.all(saveEventsPromises);
          })
          .then(function (events) {
            var savePromises = [];
            _.forEach($scope.activity.bookableItems, function (item) {
              savePromises.push(item.ref().save());  // save the items
            });
            return Q.all(savePromises);
          })
          .then(function (items) {  // all BookableItems are saved
            debug("all results", items);
            return $scope.activity.save();  // save the activity
          })
          .then(function (activity) {
            debug("SAVED ACTIVITY");
            $location.path("/admin/myactivities/");
            $scope.$apply();
          })
          .fail(function (err) {
            debug("Could not save activity");
            $scope.state.error = true;
            $scope.state.message = err.message;
            $scope.$apply();

            console.log(err.message, err.stack);
          });
      }
    };

    $scope.delete = function () {
      var deletePromises = [];
      _.forEach($scope.activity.bookableItems, function (item) {
        deletePromises.push(item.ref().remove());
      });

      Q.all(deletePromises)
        .then(function (results) {
          return $scope.activity.remove();
        })
        .then(function () {
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done();
    };

    $scope.cancel = function () {
      $location.path("/admin/myactivities/");
    };

    /*
     // only when creating element
     if (!$scope.activity.availability[0]) {
     $scope.newavailability = {
     start: undefined,
     end: undefined,
     quantity: undefined
     };

     $scope.activity.availability[0] = $scope.newavailability;

     }
     */

    $scope.selectedAddress = "";
    $scope.getAddress = activitybackendmap.getAddress;

    // image upload functionality
    $scope.removeImage = function (image, $index) {
      $scope.activity.images.splice($index, 1);

      // delete file from server implemented here
      // question is when to delete file from server??
//      $http.delete(APP_CONFIG.APIUrl + 'upload/activityimage/' + image.public_id + "/",
//        {
//          withCredentials: true
//        }
//      )
//        .catch(function (err) {
//          console.log(err);
//        });

    };

    $scope.mainCategoryChanged = function () {
      $scope.activity.category.subs = [];
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    $scope.showError = function (fieldName, error) {
      var formName = "valForm";
      var showerror = false;
      if ($scope[formName][fieldName].$error[error] && (!$scope[formName][fieldName].$pristine || $scope.state.submitted)) {
        showerror = true;
      }
      return showerror;
    };

    $scope.additionalFormChecks = function () {
      var valid = true;

      // check for uploaded images
      if ($scope.activity.images.length < 1) {
        $scope.state.additionalformchecks.images = false;
        valid = false;
      } else {
        $scope.state.additionalformchecks.images = true;
      }

      // check for bookableItems
      if ($scope.activity.bookableItems && $scope.activity.bookableItems[0]) {
        $scope.state.additionalformchecks.bookableevents = true;
      } else {
        $scope.state.additionalformchecks.bookableevents = false;
        valid = false;
      }

      // check for bookableItems
      if ($scope.activity.category && $scope.activity.category.subs.length > 0) {
        $scope.state.additionalformchecks.subcategories = true;
      } else {
        $scope.state.additionalformchecks.subcategories = false;
        valid = false;
      }

      return valid;
    };

    $scope.$watch(function () {
      return $scope.activity;
    }, function (oldVal, newVal) {
      if ($scope.state.submitted) {
        $scope.additionalFormChecks();
      }
    }, true);

  });
