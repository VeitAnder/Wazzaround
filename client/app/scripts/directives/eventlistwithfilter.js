'use strict';

angular.module('anorakApp')
  .directive('eventListWithFilter', function () {
    return {
      templateUrl: 'views/directives/eventListWithFilter.html',
      restrict: 'E',
      scope : {
        activity : "="
      },
      controller : function ($scope) {

        $scope.vm = {
          activity : $scope.activity
        };

        var filter = function() {
          this.bookableItems = [];

          // init enabled bookableItem-Filter
          for (var i in $scope.activity.bookableItems) {
            this.bookableItems[i] = function() {
              var value = true;
              return {
                enabled : function() {
                  return value;
                },
                toggle : function() {
                  value = !value;
                },
                set : function(v) {
                  value = v;
                }
              }
            }();
          }

          this.bookableItemsIsAllSelected = function() {
            var res = true;
            _.forEach(this.bookableItems, function(item) {
              if (!item.enabled()) {
                res = false;
              }
            });
            return res;
          };

          this.bookableItemsToggleAll = function() {
            var value = !this.bookableItemsIsAllSelected();
            _.forEach(this.bookableItems, function(item) {
              item.set(value);
            });
          };


          // finde frühestes event
          this.from = _.min(
            _.map($scope.activity.bookableItems, function(item) {
              return _.min(_.map(item.events, 'start'));
            })
          );

          // finde spätestes event
          this.until = _.max(
            _.map($scope.activity.bookableItems, function(item) {
              return _.max(_.map(item.events, 'end'));
            })
          );

          this.from_min = new Date(this.from);
          this.from_max = new Date(this.until);

          this.until_min = new Date(this.from);
          this.until_max = new Date(this.until);

        };
        $scope.filter = new filter();


        console.log("$scope.filter", $scope.filter);
      }
    };
  });
