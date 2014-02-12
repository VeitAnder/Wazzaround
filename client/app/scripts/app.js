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
  'textAngular',
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
          categories: function () {
            return CategoryModel.use.all();
          },
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
        controller: 'AdminMyactivitiesEditCtrl',
        resolve: {
          activity: ['$route', function ($route) {
            return ActivityModel.use.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/myactivities/new', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesNewCtrl',
        resolve: {
          categories: function () {
            return CategoryModel.use.all();
          },
          activity: function () {
            return ActivityModel.createObject();
          }
        }
      })
      .when('/admin/myactivities/:id/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl',
        resolve: {
          activity: ['$route', function ($route) {
            return ActivityModel.use.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminIndexCtrl'
      })
      .when('/admin/myactivities/', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesIndexCtrl',
        resolve: {
          activitieslist: function () {
            return ActivityModel.use.all();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .run(function ($rootScope, $log, debug, currentUser, $location, $route) {
    "use strict";

    debug("application run called");
    $rootScope.debug = debug;
    var checkRouteForAuthorization;

    var connector = Model.AngularConnector("http://localhost:3000/");
    UserModel.connection(connector);
    ActivityModel.connection(connector);
    CategoryModel.connection(connector);

    debug("$route", $route);

    checkRouteForAuthorization = function () {
      debug("routeChangeStart", $route.current.$$route.originalPath);

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

    });

  });

// @TODO check logging if it is neccessary to start via DI?
// DO not remove logging from DI list!
angular.module('anorakApp')
  .controller('AppCtrl', function () {
    'use strict';

  });
