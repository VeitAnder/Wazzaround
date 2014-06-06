'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditPageCtrl', function ($scope, activity, categories) {

    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/edit.html';
    };

    $scope.activity = activity;
    $scope.categories = categories;

  })
  .controller('AdminMyactivitiesEditCtrl', function ($scope, APP_CONFIG, $http, $location, $route, $rootScope, $translate, currentUser, $timeout) {
    $scope.vm = {
    };

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

    $scope.originalActivity = {

    };

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
    } else {
      //initialize map data to start in Turin, Italy
      // @TODO more intelligent initialization, eg. coords of last activity added or browser location of user
      $scope.activity.location = {
        "lng": 7.686856499999976,
        "lat": 45.070312
      };
      $scope.activity.address = "Turin, Italy";
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

    $scope.start = { time: moment().hours(9).minute(0).toDate() };
    $scope.end = { time: moment().hours(22).minute(0).toDate() };

    $scope.setTime = function (dateString, time) {
      var date = moment(dateString);
      var timeToSet = moment(time);
      date.hours(timeToSet.hours());
      date.minute(timeToSet.minute());
      date.second(0);
      return date.toDate();
    };

    $scope.setEndDate = function (eventStartDate, eventEndDate) {
      var start = moment(eventStartDate);
      var end = moment(eventEndDate);

      if (start.isAfter(end)) {
        end = moment(start).add('hours', 1);
        return end.toDate();

      } else {
        return eventEndDate;
      }
    };

    $scope.isAtLeastOneWeekdaySelected = function (event) {
      var isselected = false;
      _.each(event.dayOfWeek, function (value) {
        if (value) {
          isselected = true;
        }
      });
      return isselected;
    };

    $scope.createEventSeries = function (item, event, eventForm) {

      eventForm.submitted = true;

      if (eventForm.$invalid) {
        return;
      }
      event.mode = 'view';

      if (!event.repeating) {
        return;
      }

      var endrepeatDate = moment(event.endrepeatDate).hour(23).minute(59);

      if (moment().subtract('days', 1) > endrepeatDate) {
        console.log("you're trying to add events in the past");
        return;
      }

      if (endrepeatDate.diff(moment(event.start), 'years') > 2) {
        console.log("you're trying to add events for more than two years");
        return;
      }

      var dayoffset = 0;
      var iteratorDate = angular.copy(event.start);
      iteratorDate = moment(iteratorDate);

      while (iteratorDate <= endrepeatDate) {
        // add new event
        if (event.dayOfWeek['day' + moment(event.start).add('days', dayoffset).day()]) {  // Wochentag angehakt
          var newEvent = item.createEvents();
          newEvent.start = moment(event.start).add('days', dayoffset).toDate();
          newEvent.end = moment(event.end).add('days', dayoffset).toDate();
          newEvent.quantity = event.quantity;
          newEvent.price = event.price;
        }
        dayoffset += 1;
        iteratorDate.add('days', 1);
      }

      // disable event.repeating in original event
      event.repeating = false;
    };

    $scope.createEvent = function (bookableItem) {
      var event = bookableItem.createEvents();
      event.start = new Date();
      event.end = moment(event.start).add('hours', 1).toDate();

      bookableItem.events[bookableItem.events.length - 1].mode = 'new';
    };

    $scope.removeEvent = function (item, event_idx) {
      item.events.splice(event_idx, 1);  // remove from array
    };

    $scope.removeItem = function (activity, item_idx) {
      activity.bookableItems.splice(item_idx, 1);
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

    $scope.onSubCategoryChanged = function () {
      $scope.activity.category.subs = _.map(_.filter($scope.vm.subcategories, {selected: true}), function (subcat) {
        return {key: subcat.key};
      });
    };

    $scope.onMainCategoryChanged = function () {
      $scope.activity.category.subs = [];
      $scope.updateVmSubCategories();
    };

    $scope.updateVmSubCategories = function () {
      var maincategory = _.find($scope.categories, { 'key': $scope.activity.category.main });
      if (maincategory) {
        $scope.vm.subcategories = maincategory.sub;

        // set seleted true on all elements found in $scope.activity.category.subs
        _.each($scope.vm.subcategories, function (subcat) {
          var found = _.find($scope.activity.category.subs, function (sub) {
            if (sub.key === subcat.key) {
              return true;
            }
          });

          if (found) {
            subcat.selected = true;
          } else {
            subcat.selected = false;
          }
        });
      }
    };
    $scope.updateVmSubCategories();

    // Save the Activiy
    $scope.save = function () {
      debug("save() called");

      $scope.state.submitted = true;

      $scope.additionalFormChecks();

      if ($scope.valForm.$valid && $scope.additionalFormChecks()) {

        // check if there was only a marker set or an address entered
        if (!$scope.activity.location.lat) {
          $scope.activity.location.lat = $scope.map.clickedMarker.latitude;
          $scope.activity.location.lng = $scope.map.clickedMarker.longitude;
        }

        $scope.state.saveinprogress = true;

        $scope.activity.company = currentUser.user.profile.company;

        $scope.activity.save()  // save the activity
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
      $scope.activity.remove()
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
      /*      if ($scope.activity.images.length < 1) {
       $scope.state.additionalformchecks.images = false;
       valid = false;
       } else {
       $scope.state.additionalformchecks.images = true;
       }
       */

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

    $scope.makeTeaserImage = function (index) {
      function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }

      arraymove($scope.activity.images, index, 0);
    };

  });
