angular.module('directives.customvalidation', [])
  .directive('validateEquals', function () {
    'use strict';
    /**
     * A validation directive to ensure that this model has the same value as some other
     */

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {

        function validateEqual(myValue, otherValue) {
          var val;
          if (myValue === otherValue) {
            ctrl.$setValidity('equal', true);
            val = myValue;
          } else {
            ctrl.$setValidity('equal', false);
            val = undefined;
          }
          return val;
        }

        scope.$watch(attrs.validateEquals, function (otherModelValue) {
          ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue);
        });

        ctrl.$parsers.push(function (viewValue) {
          return validateEqual(viewValue, scope.$eval(attrs.validateEquals));
        });

        ctrl.$formatters.push(function (modelValue) {
          return validateEqual(modelValue, scope.$eval(attrs.validateEquals));
        });
      }
    };

  })
  .directive('passwordValidate', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {

          scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
          scope.pwdHasUppercaseLetter = (viewValue && /[A-Z]/.test(viewValue)) ? 'valid' : undefined;
          scope.pwdHasLetter = (viewValue && /[a-z]/.test(viewValue)) ? 'valid' : undefined;
          scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

          if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
            ctrl.$setValidity('pwd', true);
            return viewValue;
          } else {
            ctrl.$setValidity('pwd', false);
            return undefined;
          }

        });
      }
    };
  });
