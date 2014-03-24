angular.module('anorakApp')
  .config(
  function ($routeProvider) {
    'use strict';

    var resolve = {
      resolveprojectscollection: ['Projects',
        function (Projects) {
          return Projects.resolveProjectsList();
        }],
      resolvecurrentuser: ['Users', 'AuthenticationService',
        function (Users, AuthenticationService) {
          return AuthenticationService.requestCurrentUser().then(function (currentUser) {
            return Users.getById(currentUser.info().id);
          });
        }]
    };

    $routeProvider
      .when('/account', {
        templateUrl: 'views/account/account_basepagetemplate.tpl.html',
        controller: 'AccountCtrl',
        resolve: resolve
      })
      .when('/account/payment', {
        templateUrl: 'views/account/account_basepagetemplate.tpl.html',
        controller: 'AccountPaymentCtrl',
        resolve: resolve
      });

  })
  .controller('AccountCtrl', function ($scope, resolvecurrentuser, $location) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'views/account/account.tpl.html';
    };
    $scope.tabnavlocation = $location.$$path;

    // AccountEditCtrl depends on $scope.user
    $scope.user = resolvecurrentuser;

  })
  .controller('AccountEditCtrl', function ($scope, currentUser) {
    'use strict';

    // get user resource from $parent scope
    // @TODO remove dependency of $parent $scope
    var originalUserData = angular.copy($scope.$parent.user);
    $scope.user = $scope.$parent.user;

    $scope.accountstates = {
      edit: false,
      onerror: false
    };

    $scope.paymentstates = {
      edit: false,
      onerror: false
    };

    $scope.edit = function () {
      $scope.accountstates.edit = true;
      $scope.accountstates.onerror = false;
    };

    $scope.cancel = function () {
      $scope.accountstates.edit = false;
      $scope.accountstates.onerror = false;
      $scope.user = angular.copy(originalUserData);
    };

    $scope.saveaccount = { requestInProgress: false };
    $scope.save = function () {
      $scope.saveaccount.requestInProgress = true;
      $scope.user.updateProfile().then(function () {
        //update old data
        originalUserData = angular.copy($scope.user);
        $scope.accountstates.edit = false;
        $scope.accountstates.onerror = false;
        currentUser.updateProfile(angular.copy($scope.user.profile));
        $scope.saveaccount.requestInProgress = false;
      }, function () {
        $scope.accountstates.onerror = true;
        $scope.saveaccount.requestInProgress = false;
      });
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */

    $scope.showError = function (fieldName, error) {
      var showerror = false;
      if ($scope.valForm[fieldName].$error[error] && !$scope.valForm[fieldName].$pristine) {
        showerror = true;
      }
      return showerror;
    };

    $scope.canSave = function () {
      return $scope.valForm.$valid;
    };

  })
  .controller('AccountPaymentCtrl', function ($scope, resolvecurrentuser, $location) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'views/account/account_payment.tpl.html';
    };
    $scope.tabnavlocation = $location.$$path;

    // AccountEditCtrl depends on $scope.user
    $scope.user = resolvecurrentuser;

  })
  .controller('AccountPaymentEditCtrl', function ($scope, currentUser) {
    'use strict';

    // get user resource from $parent scope
    // @TODO remove dependency of $parent $scope
    var originalUserData = angular.copy($scope.$parent.user);
    $scope.user = $scope.$parent.user;

    $scope.states = {
      edit: false,
      onerror: false,
      requestInProgress: false,
      submitted: false
    };

    $scope.edit = function () {
      $scope.states.edit = true;
      $scope.states.onerror = false;
    };

    $scope.cancel = function () {
      $scope.states.edit = false;
      $scope.states.onerror = false;
      $scope.user = angular.copy(originalUserData);
    };

    $scope.user.payment = {

    };

//
//      $scope.saveaccount = { requestInProgress: false };
    $scope.save = function () {

      $scope.states.submitted = true;

      if ($scope.isFormValid()) {
        //save...
//        $scope.user.updateProfile().then(function () {
//          //update old data
//          originalUserData = angular.copy($scope.user);
//          $scope.accountstates.edit = false;
//          $scope.accountstates.onerror = false;
//          currentUser.updateProfile(angular.copy($scope.user.profile));
//          $scope.saveaccount.requestInProgress = false;
//        }, function () {
//          $scope.accountstates.onerror = true;
//          $scope.saveaccount.requestInProgress = false;
//        });
      }
    };

//
//      /**
//       * Whether to show an error message for the specified error
//       * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
//       * @param  {string} error - The name of the error as given by a validation directive
//       * @return {Boolean} true if the error should be shown
//       */
//

    $scope.showError = function (fieldName, error) {
      var showerror = false;
      //debug("ALL ERRORS", $scope.valFormInvite[fieldName].$error);
      //debug("ERROR " + error, $scope.valFormInvite[fieldName].$error[error]);
      if (($scope.valForm[fieldName].$error[error] && !$scope.valForm[fieldName].$pristine) || ( $scope.valForm[fieldName].$error[error] && $scope.states.submitted )) {
        showerror = true;
      }
      return showerror;
    };

    $scope.isFormValid = function () {
      return $scope.valForm.$valid;
    };

  });
