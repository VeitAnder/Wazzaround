'use strict';

/*
 IE - if console is not defined, handle it to not block execution in IE <= 9
 */
// make it safe to use console.log always
// http://www.jquery4u.com/snippets/safe-console-log/
(function (a) {
  function b() {
  }

  for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {
    a[d] = a[d] || b;
  }
})
((function () {

  try {
    console.log();
    return window.console;
  } catch (a) {
    return (window.console = {});
  }
})());

angular.module('anorakApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngMessages',
  'ui.bootstrap',
  'ui.select',
  'uiGmapgoogle-maps',
  'mgcrea.ngStrap',
  'textAngular',
  'ui.keypress',
  'momentjs',
  'services.authentication',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'services.localizedMessages',
  'templates.app',
  'modelizer',
  'directives.customvalidation',
  'ui.keypress',
  'pascalprecht.translate',
  'ngStorage',
  'ng-currency'
]);

angular.module('anorakApp').constant('I18NMESSAGES', {
  'errors.route.changeError': 'Route change error',
  'crud.user.save.success': "A user with id '{{id}}' was saved successfully.",
  'crud.user.remove.success': "A user with id '{{id}}' was removed successfully.",
  'crud.user.save.error': "Something went wrong when saving a user...",
  'crud.project.save.success': "A project with id '{{id}}' was saved successfully.",
  'crud.project.remove.success': "A project with id '{{id}}' was removed successfully.",
  'crud.project.save.error': "Something went wrong when saving a project...",
  'login.error.notAuthorized': "You do not have the necessary access permissions.  Do you want to login as someone else?",
  'login.error.notAuthenticated': "You must be logged in to access this part of the application."
});

angular.module('anorakApp')
  .config(function ($routeProvider, $locationProvider, $sceDelegateProvider, $translateProvider, $compileProvider, uiSelectConfig) {

    uiSelectConfig.theme = 'bootstrap';

    // disable debugInfos except on localhost
    if (window.location.hostname === "localhost") {
      $compileProvider.debugInfoEnabled(true);
    } else {
      $compileProvider.debugInfoEnabled(false);
    }

    $locationProvider.html5Mode((function () {
      return !!(window.history && history.pushState);
    }()));

    //if no route specified, go to default route
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'indexCtrl',
        resolve: {
          categories: ['models', function (models) {
            return models.CategoryModel.all();
          }],
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/registration', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'RegistrationPageCtrl'
      })
      .when('/registration/registrationforproviders', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'RegistrationRegistrationforprovidersPageCtrl'
      })
      .when('/registration/forgotpassword/', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'ForgotPasswordPageCtrl'
      })
      .when('/registration/forgotpassword/:token/:email/', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'ForgotPasswordPageCtrl'
      })
      .when('/legalnotes', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'LegalnotesCtrl'
      })
      .when('/affiliateagreement', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'AffiliateagreementCtrl'
      })
      .when('/why', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'WhyCtrl'
      })
      .when('/workwithus', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'WorkwithusPageCtrl'
      })
      .when('/login', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'LoginCtrl',
        resolve: {
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/admin/myactivities/:id/edit', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesEditPageCtrl',
        resolve: {
          categories: ['models', function (models) {
            return models.CategoryModel.all();
          }],
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/myactivities/new', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesEditPageCtrl',
        resolve: {
          categories: ['models', function (models) {
            return models.CategoryModel.all();
          }],
          activity: ['models', function (models) {
            return models.ActivityModel.create();
          }]
        }
      })
      .when('/admin/myactivities/:id/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl',
        resolve: {
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminIndexCtrl',
        resolve: {
          currentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/admin/myactivities/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesIndexCtrl',
        resolve: {
          myActivitiesList: ['models', function (models) {
            return models.ActivityModel.getMyActivities();
          }]
        }
      })
      .when('/admin/promotion/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'PromotionIndexCtrl',
        resolve: {
          promotionUserList: ['currentUser', function (currentUser) {
            return models.UserModel.getMyPromotedUsers();
          }]
        }
      })
      .when('/admin/bookings/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminBookingsCtrl',
        resolve: {
          bookedEvents: ['models', function (models) {
            return models.BookedEventModel.all();
          }]
        }
      })
      .when('/admin/allbookings/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminBookingsCtrl',
        resolve: {
          bookedEvents: ['models', function (models) {
            return models.BookedEventModel.all();
          }]
        }
      })
      .when('/admin/activities', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminAllactivitiesCtrl',
        resolve: {
          activities: ['models', function (models) {
            return models.ActivityModel.all();
          }]
        }
      })
      .when('/admin/activities/:id/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl',
        resolve: {
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/profile', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminProfilePageCtrl',
        resolve: {
          currentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/admin/profile/edit', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminProfileEditPageCtrl',
        resolve: {
          userResolve: ['currentUser', '$q', function (currentUser, $q) {
            var defer = $q.defer();
            currentUser.load().then(function (data) {
              defer.resolve(data.user);
            });
            return defer.promise;
          }]
        }
      })
      .when('/admin/providers', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'ProvidersCtrl',
        resolve: {
          providers: ['models', function (models) {
            return models.UserModel.getProviders();
          }]
        }
      })
      .when('/admin/providers/:id', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'ProviderDetailCtrl',
        resolve: {
          provider: ['$route', 'models', function ($route, models) {
            return models.UserModel.get($route.current.params.id);
          }],
          activities: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.byOwner({id: $route.current.params.id});
          }]
        }
      })
      .when('/admin/providers/:id/edit/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminProfileEditPageCtrl',
        resolve: {
          userResolve: ['$route', 'models', function ($route, models) {
            return models.UserModel.get($route.current.params.id);
          }]
        }
      })
      .when('/activities/:id/', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'ActivityPageCtrl',
        resolve: {     // TODO shall be included in Operator of Activitymodel!
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/payment', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'PaymentPageCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://localhost:3000/**',
      'http://localhost:9000/**',
      'http://osx.local:3000/**',
      'http://osx.local:9000/**',
      'http://0.0.0.0:9000/**',
      'http://0.0.0.0:3000/**',
      'http://127.0.0.1:9000/**',
      'http://127.0.0.1:3000/**',
      'http://res.cloudinary.com/**'
    ]);

// The blacklist overrides the whitelist so the open redirect here is blocked.
//    $sceDelegateProvider.resourceUrlBlacklist(
//      [
//        'http://myapp.example.com/clickThru**'
//      ]
//    );

// Allows XHR Requests to other domains and includes cookies
// DO NOT ENABLE - Causes CORS trouble with google maps
// $httpProvider.defaults.withCredentials = true;

// Translation source is this Google Spreadsheet:
// https://docs.google.com/spreadsheets/d/10o5NKCAckc2rIaLX1dKMnh2VAT66yK9UpzGDAK8wwx8/edit#gid=424150697
// Google-User: reactureapp@gmail.com
    $translateProvider.useStaticFilesLoader({
      prefix: '/scripts/translations/locale-',
      suffix: '.json?' + APP_CLIENTINFO.version
    });

    $translateProvider.registerAvailableLanguageKeys(['en', 'de', 'it'], {
      'en_US': 'en',
      'en_us': 'en',
      'en_UK': 'en',
      'en_uk': 'en',
      'de_DE': 'de',
      'de_de': 'de',
      'de_CH': 'de',
      'de_ch': 'de',
      'de_AT': 'de',
      'de_at': 'de',
      'IT_IT': 'it',
      'it_it': 'it',
      'it_IT': 'it'
    })
      .determinePreferredLanguage();
// hint: en_us and en_US are different, is a case-sensitive check bug in angular-translate
// is fixed in https://github.com/angular-translate/angular-translate/issues/431
// but not released yet
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useLocalStorage();

  })
  .
  run(function ($rootScope, $locale, $log, debug, currentUser, $location, $route, APP_CONFIG, models, $translate, translationutils, $window) {
    $rootScope.debug = debug;
    $rootScope.models = models;
    var checkRouteForAuthorization;

    var Model = require('modelizer');
//    var connector = Model.AngularConnector(APP_CONFIG.modelizerurl);
    var connector = Model.ClientConnector(APP_CONFIG.modelizerhost, APP_CONFIG.modelizerport);

    _.forEach(models, function (model) {  // setup connection for each model
      model.connection(connector);
    });

    moment.locale($translate.use());  // setup moment language

    checkRouteForAuthorization = function () {

      // if you try to access a admin route without being authenticated -> redirect to /login
      if (!currentUser.authenticated) {
        if ($route.current.$$route.originalPath.match(/^\/admin/) || $route.current.$$route.originalPath.match(/^\/account/)) {
          $rootScope.$apply(function () {
            $location.path('/login');
          });
        }
      }
    };

    $rootScope.currentUser = currentUser;
    // load current User from server
    // @TODO - content flickers as long as route has not been checked
    currentUser.load()
      .then(function () {
        checkRouteForAuthorization();
      })
      .done();

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      // if you try to access the register route being authenticated -> redirect to /admin
      if (currentUser.authenticated) {
        if (next.$$route.originalPath.match(/^\/registration/)) {
          $location.path('/admin');
        }
      }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
      $window.scrollTo(0, 0);
    });

    // service to determine available language in case of ng-model binding in view
    $rootScope.getAvailableTranslationLanguageKey = translationutils.getAvailableTranslationLanguageKey;

  }
);

// @TODO check logging if it is neccessary to start via DI?
// DO not remove logging from DI list!
angular.module('anorakApp')
  .controller('AppCtrl', function ($scope, $location) {
    $scope.gotoLogin = function () {
      $location.path('/login/');
    };

  });

angular.module('anorakApp')
  .config(['$timepickerProvider', function ($timepickerProvider) {
    angular.extend($timepickerProvider.defaults, {
      timeFormat: 'HH:mm',
      length: 7,
      minuteStep: 15,
      autoclose: 1
    });
  }]);

