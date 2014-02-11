/*
 IE - if console is not defined, handle it to not block execution in IE <= 9
 */
// make it safe to use console.log always
// http://www.jquery4u.com/snippets/safe-console-log/
(function (a) {
  "use strict";
  function b() {
  }

  for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {
    a[d] = a[d] || b;
  }
})
  ((function () {
    "use strict";
    try {
      console.log();
      return window.console;
    } catch (a) {
      return (window.console = {});
    }
  })());

angular.module('anorakApp', [
  'ngRoute',
  'google-maps',
  'mgcrea.ngStrap.datepicker',
  //'textAngular',
  'ui.keypress',
  'registration',
  'momentjs',
  'services.authentication',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'templates.app'
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
  .config(function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    'use strict';

    $locationProvider.html5Mode((function () {
      return !!(window.history && history.pushState);
    }()));

    //if no route specified, go to default route
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'indexCtrl',
        resolve: {
          resolvedActivities: function () {
            // todo: use service for Modelizer
            return ActivityModel.use.all();
          },
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/legalnotes', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'LegalnotesCtrl'
      })
      .when('/why', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'WhyCtrl'
      })
      .when('/workwithus', {
        templateUrl: 'views/page_basetemplate.html',
        controller: 'WorkwithusCtrl'
      })
      .when('/login', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'LoginCtrl',
        resolve: {
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/admin/myactivities/:id/edit', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesEditCtrl'
      })
      .when('/admin/myactivities/new', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesNewCtrl'
      })
      .when('/admin/myactivities/:id/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl'
      })
      .when('/admin/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminIndexCtrl'
      })
      .when('/admin/myactivities/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesIndexCtrl'
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
      'http://127.0.0.1:3000/**'
    ]);

    // The blacklist overrides the whitelist so the open redirect here is blocked.
//    $sceDelegateProvider.resourceUrlBlacklist(
//      [
//        'http://myapp.example.com/clickThru**'
//      ]
//    );

    // Allows XHR Requests to other domains and includes cookies
    $httpProvider.defaults.withCredentials = true;

  })
  .run(function ($rootScope, $log, debug, currentUser) {
    "use strict";

    debug("application run called");
    $rootScope.debug = debug;

    var connector = Model.AngularConnector("http://localhost:3000/");
    UserModel.connection(connector);
    ActivityModel.connection(connector);

    $rootScope.currentUser = currentUser;
    // load current User from server
    currentUser.load().done();

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

      debug("routeChangeStart");

      // no trailing slash
      // regexpr literals
      // all subroutes of registration and login are also public because regex will test true
//      var routesThatDontRequireAuth = [/\/registration/, /\/login/, /\//];

//      AuthenticationService.requestCurrentUser()
//        .then(function (user) {
//          if (!user.isAuthenticated()) {
//            var ispublicroute = false;
//
//            //if not a public route -> redirect to /login
//            angular.forEach(routesThatDontRequireAuth, function (value, key) {
//              if (value.test($location.path())) {
//                ispublicroute = true;
//              }
//            });
//
//            if (!ispublicroute) {
//              $location.search('redirect', $window.location.pathname);
//              $location.path('/login');
//            }
//
//          } else {
//            //redirect /login to /projects if currentUser.isAuthenticated()
//            if (/\/login/.test($location.path())) {
//              $location.path('/projects');
//            }
//          }
//
//        })
//        .catch(function (err) {
//          // @TODO show error in UI
//          $log("AthenticationService - Error when requesting current user: ", err);
//        });

    });

  });

// @TODO check logging if it is neccessary to start via DI?
// DO not remove logging from DI list!
angular.module('anorakApp')
  .controller('AppCtrl', function () {
    'use strict';

  });
