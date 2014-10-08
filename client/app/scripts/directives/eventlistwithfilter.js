'use strict';

angular.module('anorakApp')
  .directive('eventListWithFilter', function () {
    return {
      templateUrl: 'views/directives/eventListWithFilter.html',
      restrict: 'E',
      scope: {
        activity: "="
      },
      controller: function ($scope, $filter, frontendmap) {
//        $scope.acticity = angular.copy($scope.activity);

//        $scope.vm = {
//          activity : angular.copy($scope.activity)
//        };

        var filter = function () {
          var self = this;

          this.frontendmap = frontendmap;

          this.bookableItems = [];

          // init enabled bookableItem-Filter
          for (var i in $scope.activity.bookableItems) {
            this.bookableItems[i] = new function () {
              this.value = true;
              this.enabled = function () {
                return this.value;
              };
              this.toggle = function () {
                this.value = !this.value;
              };
              this.set = function (v) {
                this.value = v;
              };
              this.num = $scope.activity.bookableItems[i].events.length;
            };
          }

          this.numAllEvents = _.reduce(_.map(this.bookableItems, 'num'), function (sum, num) {
            return sum + num;
          });

          this.bookableItemsIsAllSelected = function () {
            var res = true;
            _.forEach(this.bookableItems, function (item) {
              if (!item.enabled()) {
                res = false;
              }
            });
            return res;
          };

          this.bookableItemsToggleAll = function () {
            var value = !this.bookableItemsIsAllSelected();
            _.forEach(this.bookableItems, function (item) {
              item.set(value);
            });
          };

//          // finde frühestes event
//          this.from = new Date(_.min(
//            _.map($scope.activity.bookableItems, function(item) {
//              return _.min(_.map(item.events, 'start'));
//            })
//          ));
//
//          // finde spätestes event
//          this.until = new Date( _.max(
//            _.map($scope.activity.bookableItems, function(item) {
//              return _.max(_.map(item.events, 'end'));
//            })
//          ));

          // benutze globale datums selektion
          this.from = frontendmap.map.searchStartDate;
          this.until = frontendmap.map.searchEndDate;

          this.from_min = new Date(this.from);
          this.from_max = new Date(this.until);

          this.until_min = new Date(this.from);
          this.until_max = new Date(this.until);

          this.calDaysOptions = frontendmap.calDaysOptions;

          this.calDaysOptionsSelected = frontendmap.calDaysOptionsSelected;

          $scope.$watch(function () {
            return self.calDaysOptionsSelected;
          }, function () {
            self.until = moment(self.from)
              .add(self.calDaysOptionsSelected.selection, 'days').toDate();
          }, true);

          $scope.$watch(function () {
            return self.from;
          }, function () {
            self.until = moment(self.from)
              .add(self.calDaysOptionsSelected.selection, 'days').toDate();
          });

        };
        $scope.filter = new filter();


      }
    };
  });
