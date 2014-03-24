angular.module('directives.customvalidation', [])
  .directive("repeatPassword", function() {
    return {
      require: "ngModel",
      link: function(scope, elem, attrs, ctrl) {
        var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

        ctrl.$parsers.push(function(value) {
          if(value === otherInput.$viewValue) {
            ctrl.$setValidity("repeat", true);
            return value;
          }
          ctrl.$setValidity("repeat", false);
        });

        otherInput.$parsers.push(function(value) {
          ctrl.$setValidity("repeat", value === ctrl.$viewValue);
          return value;
        });
      }
    };
  })
  .directive('passwordValidate', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.push(function(viewValue) {

          scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
          scope.pwdHasUppercaseLetter = (viewValue && /[A-Z]/.test(viewValue)) ? 'valid' : undefined;
          scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

          if(scope.pwdValidLength && scope.pwdHasUppercaseLetter && scope.pwdHasNumber) {
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
