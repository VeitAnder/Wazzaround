'use strict';

angular.module('anorakApp')
  .directive('defaultvalue', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var defaultValue = attrs.defaultvalue;
        ngModel.$parsers.push(function (value) {
          if (!value) {
            var currentValue = ngModel.$modelValue;
            ngModel.$setViewValue(defaultValue);
            ngModel.$render();
            return currentValue;
          } else {
            return value;
          }
        });
      }
    };
  });
