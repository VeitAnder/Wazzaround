angular.module('directives.customvalidation', [])
  .directive('uniqueEmailForLoginAccount', function (UserRegistrations) {
    'use strict';
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, el, attrs, ctrl) {

        // Dont use push here, because reaction in the view is too slow
        // user will enter stuff and error message comes much later
        ctrl.$parsers.unshift(function (viewValue) {
          if (viewValue && viewValue.length > 0) {
            UserRegistrations.isEmailAvailableForLoginAccount(viewValue)
              .then(function (data) {
                if (data.data.isavailable) {
                  ctrl.$setValidity('uniqueEmail', true);
                } else {
                  ctrl.$setValidity('uniqueEmail', false);
                }
              });
          }
          return viewValue;
        });
      }
    };
  })
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
  .directive('emailNotInProjectAlready', function ($routeParams, Projects) {
    'use strict';
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, el, attrs, ctrl) {

        // Dont use push here, because reaction in the view is too slow
        // user will enter stuff and error message comes much later
        ctrl.$parsers.unshift(function (viewValue) {
          if (viewValue && viewValue.length > 0) {
            var available = true;
            _.each(Projects.getResolvedCurrentProject().participants, function (participant) {
              if (participant.user.email.toLowerCase() === viewValue.toLowerCase() && participant.permission !== "silent") {
                available = false;
              }
            });
            ctrl.$setValidity('notInProject', available);
          }
          return viewValue;
        });
      }//link

    };

  })

  /*
   * Fileupload evaluation for new plans or new revisions, there has to be at least one file
   */
  .directive('fileuploadcheck', function ($timeout, s3uploadservice, fileuploadcheck) {
    'use strict';
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'directives/fileuploadcheck.tpl.html',
      scope: {
      },
      link: function (scope, el, attrs) {
        scope.uploaded = fileuploadcheck.uploaded;
        scope.fileuploadcheck = fileuploadcheck;
        scope.pristine = true;
        scope.filemissing = { type: "" };
        scope.uploadinprogress = false;

        // reference service via scope
        scope.s3uploadservice = s3uploadservice;

        scope.pdf_uploadcompleted = s3uploadservice.pdf.uploadcompleted;
        scope.dwg_uploadcompleted = s3uploadservice.dwg.uploadcompleted;

        function checkFileUploads() {
          // first check if no fileupload is running
          if (!scope.s3uploadservice.pdf.uploadrunning && !scope.s3uploadservice.dwg.uploadrunning) {
            // if there is one file available, enable saving
            if (scope.s3uploadservice.pdf.uploadcompleted || scope.s3uploadservice.dwg.uploadcompleted) {
              fileuploadcheck.uploaded = true;
              scope.uploaded = true;
            } else {
              fileuploadcheck.uploaded = false;
              scope.uploaded = false;
            }
          } else {
            // uploads are running
            scope.uploadinprogress = true;
            fileuploadcheck.uploaded = false;
            scope.uploaded = false;
          }
        }

        scope.$watch(
          function () {
            return s3uploadservice.pdf.uploadcompleted;
          },
          function (newVal) {
            scope.pdf_uploadcompleted = newVal;

            if (scope.s3uploadservice.pdf.uploadcompleted) {
              scope.pristine = false;
            }
            checkFileUploads();
          }
        );

        scope.$watch(
          function () {
            return s3uploadservice.dwg.uploadcompleted;
          },
          function (newVal) {
            scope.dwg_uploadcompleted = newVal;

            if (scope.s3uploadservice.dwg.uploadcompleted) {
              scope.pristine = false;
            }
            checkFileUploads();
          }
        );

        scope.$watch(
          function () {
            return s3uploadservice.dwg.uploadrunning;
          },
          function () {
            checkFileUploads();
          }
        );

        scope.$watch(
          function () {
            return s3uploadservice.pdf.uploadrunning;
          },
          function () {
            checkFileUploads();
          }
        );

        // use this to watch whether "Save" button is clicked to save new plan or save revision
        scope.$watch('fileuploadcheck.submitted', function (value, oldValue) {
          console.log("value oldValue", value, oldValue);
          if (oldValue !== value && value === true) {
            scope.pristine = false;
            $timeout(function () {
              checkFileUploads();
            });
          }
        });

        scope.resetpdfform = function () {
          scope.s3uploadservice.pdf.reset();
        };

        scope.resetdwgform = function () {
          scope.s3uploadservice.dwg.reset();
        };

      }
    };
  });
