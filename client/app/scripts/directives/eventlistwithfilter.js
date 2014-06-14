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
//        $scope.acticity = angular.copy($scope.activity);

//        $scope.vm = {
//          activity : angular.copy($scope.activity)
//        };

        var filter = function() {
          // init enabled bookableItem-Filter
          for (var i in $scope.activity.bookableItems) {
            $scope.activity.bookableItems[i].filter = function() {
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
            _.forEach($scope.activity.bookableItems, function(item) {
              if (!item.filter.enabled()) {
                res = false;
              }
            });
            return res;
          };

          this.bookableItemsToggleAll = function() {
            var value = !this.bookableItemsIsAllSelected();
            _.forEach($scope.activity.bookableItems, function(item) {
              item.filter.set(value);
            });
          };


          // finde frühestes event
          this.from = new Date(_.min(
            _.map($scope.activity.bookableItems, function(item) {
              return _.min(_.map(item.events, 'start'));
            })
          ));

          // finde spätestes event
          this.until = new Date( _.max(
            _.map($scope.activity.bookableItems, function(item) {
              return _.max(_.map(item.events, 'end'));
            })
          ));

          this.from_min = new Date(this.from);
          this.from_max = new Date(this.until);

          this.until_min = new Date(this.from);
          this.until_max = new Date(this.until);

        };
        $scope.filter = new filter();

      }
    };
  });
