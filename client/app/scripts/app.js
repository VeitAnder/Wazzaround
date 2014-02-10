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

angular.module('anorakApp', ['ngRoute', 'google-maps', 'login', 'ui.keypress', 'registration', 'momentjs', 'projectowner',
//  'mongolabResource', 'resources.users', 'resources.activities', 'resources.projects', 'resources.plans',
  'services.authentication',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'services.filenameValidation',
  'directives.s3uploadform', 'directives.customvalidation', 'directives.fullname', 'directives.spinner', 'directives.downloadlink',
  'templates.app', 'resources.userregistrations', 'forgotpassword', 'services.supportbar', 'directives.roleselector', 'services.s3uploadservice', 'services.fileuploadcheck', 'filename']);

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
            }
        }
      })
      .when('/legalnotes', {
        templateUrl: 'views/legalnotes.html',
        controller: 'LegalnotesCtrl'
      })
      .when('/why', {
        templateUrl: 'views/why.html',
        controller: 'WhyCtrl'
      })
      .when('/workwithus', {
        templateUrl: 'views/workwithus.html',
        controller: 'WorkwithusCtrl'
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
  .run(function ($rootScope, $log, debug) {
    "use strict";

    debug("application run called");
    $rootScope.debug = debug;

    var connector = Model.AngularConnector("http://localhost:3000/");
    UserModel.connection(connector);
    ActivityModel.connection(connector);

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

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
