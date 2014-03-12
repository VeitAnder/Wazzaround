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
  'mgcrea.ngStrap',
  'textAngular',
  'ui.keypress',
  'registration',
  'forgotpassword',
  'momentjs',
  'services.authentication',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'services.localizedMessages',
  'templates.app',
  'modelizer',
  'mgcrea.ngStrap',
  'directives.customvalidation'
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
  .config(function ($routeProvider, $locationProvider) {
    'use strict';

    $locationProvider.html5Mode((function () {
      return !!(window.history && history.pushState);
    }()));

    //if no route specified, go to default route
    $routeProvider
      .when('/', {
        templateUrl: 'index.html',
        controller: 'indexCtrl',
        resolve: {
          categories: ['models', function (models) {
            return models.CategoryModel.all();
          }],
          resolvedActivities: ['models', function (models) {
            return models.ActivityModel.all();
          }],
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/registration/forgotpassword/', {
        templateUrl: 'registration/forgotpassword/forgotpassword_page.tpl.html',
        controller: 'ForgotpasswordPageCtrl'
      })
      .when('/legalnotes', {
        templateUrl: 'page_basetemplate.html',
        controller: 'LegalnotesCtrl'
      })
      .when('/why', {
        templateUrl: 'page_basetemplate.html',
        controller: 'WhyCtrl'
      })
      .when('/workwithus', {
        templateUrl: 'page_basetemplate.html',
        controller: 'WorkwithusCtrl'
      })
      .when('/login', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'LoginCtrl',
        resolve: {
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .when('/register', {
        templateUrl: 'page_basetemplate.html',
        controller: 'RegisterCtrl'
      })
      .when('/admin/myactivities/:id/edit', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesEditCtrl',
        resolve: {
          categories: ['models', function (models) {
            return models.CategoryModel.all();
          }],
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id)
              .then(function (activity) {
                // load bookable items
                var loadingBookableItems = [];
                _.forEach(activity.bookableItems, function (item) {
                  loadingBookableItems.push(item.load());
                });

                return Q.all(loadingBookableItems)
                  .then(function (res) {
                    console.log("loadingBookableItems", res);
                    return activity;  // return the activity, when all bookableItems have been loaded
                  });
              })
              .fail(function (err) {
                console.log("Fail loading activities in the myactivities route", err);
              })
              ;
          }]
        }
      })
      .when('/admin/myactivities/new', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesEditCtrl',
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
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl',
        resolve: {
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminIndexCtrl'
      })
      .when('/admin/myactivities/', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesIndexCtrl',
        resolve: {
          myActivitiesList: ['models', function (models) {
            return models.ActivityModel.getMyActivities();
          }]
        }
      })
      .when('/admin/allActivities', {
        //templateUrl: 'views/admin/allactivities.html',
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminAllactivitiesCtrl',
        resolve: {
          activities: ['models', function (models) {
            return models.ActivityModel.all();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .run(function ($rootScope, $log, debug, currentUser, $location, $route, APP_CONFIG, models) {
    "use strict";

    debug("application run called");
    $rootScope.debug = debug;
    $rootScope.models = models;
    var checkRouteForAuthorization;

    var connector = Model.AngularConnector(APP_CONFIG.modelizerurl);
    models.UserModel.connection(connector);
    models.ActivityModel.connection(connector);
    models.CategoryModel.connection(connector);
    models.BookableItemModel.connection(connector);
    models.BookingsModel.connection(connector);
    models.AccesstokenModel.connection(connector);
    models.SignatureModel.connection(connector);

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

      // if you try to access the register route being authenticated -> redirect to /admin
      if (currentUser.authenticated) {
        if (next.$$route.originalPath.match(/^\/register/)) {
          $location.path('/admin');
        }
      }

    });

  });

// @TODO check logging if it is neccessary to start via DI?
// DO not remove logging from DI list!
angular.module('anorakApp')
  .controller('AppCtrl', function () {
    'use strict';

  });
