'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditCtrl', function ($scope, APP_CONFIG, $http, $location, activity, categories, activitybackendmap, $route, $rootScope) {
    $scope.getPagePartial = function () {
      return 'admin/myactivities/edit.html';
    };

    //only check once at initialization time
    if ($route.current.$$route.originalPath === "/admin/myactivities/new") {
      $scope.newMode = true;
    } else {
      $scope.newMode = false;
    }

    $scope.state = {};


    $scope.createEventSeries = function (item, event) {
      console.log("createRepeatingEvents called", item, event);

      if (!event.repeating) return;

      var startDate = moment(event.start);
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

      bookableItem.events[bookableItem.events.length-1].mode = 'edit';
      //event.mode = 'edit';   // funktionier so leider nicht
    };

    $scope.removeEvent = function (item, idx) {
      if (item.events[idx]._reference) item.events[idx].ref().remove().done();  // if already persisted
      item.events.splice(idx, 1);  // remove from array
    };

    $scope.removeItem = function (item, idx) {

      _.forEach(item.events, function(event) {  // remove saved events
        console.log("TODO: remove this event");   // TODO
      });

      item.remove().done();
      activity.bookableItems.splice(idx, 1);
    };

    $scope.moment = moment;

    $scope.isNewMode = function () {
      return $scope.newMode;
    };

    $scope.categories = categories;
    $scope.activity = activity;

    $scope.getSubCategories = function () {
      var maincategory = _.find(categories, { 'key': $scope.activity.category.main });
      if (maincategory) {
        return maincategory.sub;
      }
    };

    $scope.isTitleInSubcats = function (title) {
      var found = _.filter($scope.activity.category.subs, function (sub) {
        if (sub.title === title) {
          return true;
        }
      });
      if (found.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.setSubcat = function (title, key) {
      if (!$scope.activity.category.subs) {
        $scope.activity.category.subs = [];
      }
      if ($scope.isTitleInSubcats(title)) {
        _.remove($scope.activity.category.subs, { 'title': title });
      } else {
        $scope.activity.category.subs.push({ 'title': title });
      }
    };

//    // reset activity.category.sub when activity.category.main changes
//    $scope.$watch('activity.category.main', function () {
//      $scope.activity.category.sub = undefined;
//    });

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
      debug("save() called", $scope.activity.latitude);

      // check if there was only a marker set or an address entered
      if (!$scope.activity.latitude) {
        $scope.activity.latitude = $scope.map.clickedMarker.latitude;
        $scope.activity.longitude = $scope.map.clickedMarker.longitude;
      }

      Q()
        .then(function(){
          var saveEventsPromises = [];
          _.forEach($scope.activity.bookableItems, function (item) {
            _.forEach(item.ref().events, function(event) {
              saveEventsPromises.push(event.ref().save());  // save the events
            });
          });
          return Q.all(saveEventsPromises);
        })
        .then(function(events){
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
        });
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
      activity.images.splice($index, 1);

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

    $scope.mainCategoryChanged = function() {
      $scope.activity.category.subs = [];
    };

  });
