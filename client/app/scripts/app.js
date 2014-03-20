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
  'ngCookies',
  'ngSanitize',
  'google-maps',
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
  'mgcrea.ngStrap',
  'directives.customvalidation',
  'ui.keypress',
  'pascalprecht.translate'
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
  .config(function ($routeProvider, $locationProvider, $sceDelegateProvider, $translateProvider) {
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

//            return models.ActivityModel.all();
            var defer = Q.defer();
            var resolvedActivities = [];

            models.ActivityModel.all()
              .then(function (activities) {
                resolvedActivities = activities;

                var allBookableItemsInAllActivities = [];

                _.each(activities, function (activity) {
                  _.forEach(activity.bookableItems, function (item) {
                    allBookableItemsInAllActivities = allBookableItemsInAllActivities.concat(item.load());
                  });
                });
                return Q.all(allBookableItemsInAllActivities);
              })
              .then(function (res) {
                debug("loadedBookableItems", res);
                defer.resolve(resolvedActivities);
              })
              .fail(function (err) {
                debug("Fail loading activities in the myactivities route", err);
                defer.reject(err);
              });

            return defer.promise;
          }],
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
      })
      .
      when('/registration', {
        templateUrl: 'page_basetemplate.html',
        controller: 'RegistrationPageCtrl'
      })
      .when('/registration/forgotpassword/', {
        templateUrl: 'page_basetemplate.html',
        controller: 'ForgotPasswordPageCtrl'
      })
      .when('/registration/forgotpassword/:token/:email/', {
        templateUrl: 'page_basetemplate.html',
        controller: 'ForgotPasswordPageCtrl'
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
        templateUrl: 'page_basetemplate.html',
        controller: 'LoginCtrl',
        resolve: {
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }]
        }
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
                    debug("loadingBookableItems", res);
                    return activity;  // return the activity, when all bookableItems have been loaded
                  });
              })
              .fail(function (err) {
                debug("Fail loading activities in the myactivities route", err);
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
      .when('/admin/allActivities/:id/', {
        templateUrl: 'admin/admin_basetemplate.html',
        controller: 'AdminMyactivitiesDetailCtrl',
        resolve: {
          activity: ['$route', 'models', function ($route, models) {
            return models.ActivityModel.get($route.current.params.id);
          }]
        }
      })
      .when('/admin/editprofile', {
        templateUrl: 'views/admin/editprofile.html',
        controller: 'AdminEditprofileCtrl'
      })
      .when('/activities/:id/', {
        templateUrl: 'views/activities/activity.html',
        controller: 'ActivityCtrl',
        resolve: {     // TODO shall be included in Operator of Activitymodel!
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
      .when('/shoppingcart', {
        templateUrl: 'views/shoppingcart.html',
        controller: 'ShoppingCartCtrl'
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

    $translateProvider.translations('en', {
      'TITLE': 'Hello',
      'FOO': 'Life is beatuifull.',
      'Why reacture': 'Why reacture?',
      'Work with us': 'Work with us!',
      'Contact': 'Contact & Impressum',
      'Please choose': 'Please choose:',
      'Sports and Activities': 'Sports & Activities',
      'of': 'of',
      'Select all': 'Select all',
      'Deselect all': 'Deselect all',
      'Culture': 'Culture',
      'Wellness & Relax': 'Wellness & Relax',
      'Show all': 'Show all',
      'Hide all': 'Hide all',
      'Offered by': 'Offered by:',
      'Availability': 'Availability:',
      'Next available Dates' : 'Next available Dates',
      'Book': 'Book',
      'Prev': 'Prev',
      'Show all Dates': 'Show all Dates',
      'Next': 'Next',
      'Trekking, Biking, Hiking': 'Trekking, Biking, Hiking',
      'Yoga & Pilates': 'Yoga & Pilates',
      'Water Sports': 'Water Sports',
      'Motorized Sports': 'Motorized Sports',
      'Adventure': 'Adventure',
      'Full day activities': 'Full day activities',
      'Winter Sports': 'Winter Sports',
      'Extreme Sports': 'Extreme Sports',
      'Degustations: Wine & Food & Cigars' : 'Degustations: Wine & Food & Cigars',
      'Exhibitions & Fairs' : 'Exhibitions & Fairs',
      'Music & Film' : 'Music & Film',
      'Guided Tours': 'Guided Tours',
      'Opera & Theater': 'Opera & Theater',
      'Massages': 'Massages',
      'Beauty': 'Beauty',
      'Medical Treatments': 'Medical Treatments',
      'Spa & Sauna': 'Spa & Sauna',
      'Your current search location': 'Your current search location'
    });

    $translateProvider.translations('de', {
      'TITLE': 'Herzlich Willkommen',
      'FOO': 'Das Leben ist schön.',
      'Why reacture': 'Warum reacture?',
      'Work with us': 'Arbeiten Sie mit uns!',
      'Contact': 'Kontakt & Impressum',
      'Please choose': 'Bitte wählen Sie:',
      'Sports and Activities': 'Sport & Aktivitäten',
      'of': 'von',
      'Select all': 'Alle auswählen',
      'Deselect all': 'Keine auswählen',
      'Culture': 'Kultur',
      'Wellness & Relax': 'Wellness & Entspannung',
      'Show all': 'Alle anzeigen',
      'Hide all': 'Keine anzeigen',
      'Offered by': 'Angeboten von:',
      'Availability': 'Verfügbarkeit:',
      'Next available Dates' : 'Nächste Verfügbarkeit',
      'Book': 'Buchen',
      'Prev': 'Früher',
      'Show all Dates': 'Alle Verfügbarkeiten anzeigen',
      'Next': 'Später',
      'Trekking, Biking, Hiking': 'Trekking, Biking, Hiking',
      'Yoga & Pilates': 'Yoga & Pilates',
      'Water Sports': 'Wassersport',
      'Motorized Sports': 'Motorsport',
      'Adventure': 'Abenteuer',
      'Full day activities': 'Ganztagsaktivitäten',
      'Winter Sports': 'Wintersport',
      'Extreme Sports': 'Extremsport',
      'Degustations: Wine & Food & Cigars' : 'Verkostungen: Wein & Delikatessen & Zigarren',
      'Exhibitions & Fairs' : 'Ausstellungen & Messen',
      'Music & Film' : 'Musik & Film',
      'Guided Tours': 'Führungen',
      'Opera & Theater': 'Oper & Theater',
      'Massages': 'Massagen',
      'Beauty': 'Schönheit',
      'Medical Treatments': 'Medizinische Behanldungen',
      'Spa & Sauna': 'Spa & Sauna',
      'Your current search location': 'Ihre Suchposition'
    });

    $translateProvider.translations('it', {
      'TITLE': 'bonjorno',
      'FOO': 'la vita e bella.',
      'Why reacture': 'Perche reacture?',
      'Work with us': 'Lavora con noi!',
      'Contact': 'Contattaci',
      'Please choose': 'Si prega di scegliere',
      'Sports and Activities': 'Sport & Attività',
      'of': 'di',
      'Select all': 'Seleziona tutte',
      'Deselect all': 'Deseleziona tutte',
      'Culture': 'Cultura',
      'Wellness & Relax': 'Wellness & Relax',
      'Show all': 'Vedi tutto',
      'Hide all': 'Nascondi tutto',
      'Offered by': 'Offerto da:',
      'Availability': 'Disponibilità:',
      'Next available Dates' : 'Date prossime',
      'Book': 'Prenota',
      'Prev': 'Prima',
      'Show all Dates': 'Mostra tutte le date',
      'Next': 'Più tardi',
      'Trekking, Biking, Hiking': 'Trekking, Bicicletta, Escursionismo',
      'Yoga & Pilates': 'Yoga & Pilates',
      'Water Sports': 'Sport acquatici',
      'Motorized Sports': 'Sport motorizzati',
      'Adventure': 'Avventura',
      'Full day activities': 'Attività di giorno completo',
      'Winter Sports': 'Sport invernali',
      'Extreme Sports': 'Sport estremi',
      'Degustations: Wine & Food & Cigars' : 'Degustazioni: Vino & Gastronomia & Sigari',
      'Exhibitions & Fairs' : 'Mostre & Fiere',
      'Music & Film' : 'Musica & Cinema',
      'Guided Tours': 'Visite guidate',
      'Opera & Theater': 'Opera & Teatro',
      'Massages': 'Massaggi',
      'Beauty': 'Bellezza',
      'Medical Treatments': 'Trattamenti medici',
      'Spa & Sauna': 'Spa & Sauna',
      'Your current search location': 'Posizione di ricerca'
    });

//    $translateProvider.preferredLanguage('en');

    $translateProvider
      .translations('en', { /* ... */ })
      .translations('de', { /* ... */ })
      .translations('it', { /* ... */ })
      .registerAvailableLanguageKeys(['en', 'de', 'it'], {
        'en_US': 'en',
        'en_UK': 'en',
        'de_DE': 'de',
        'de_CH': 'de',
        'de_AT': 'de',
        'IT_IT': 'it',
        'it_IT': 'it'
      })
      .determinePreferredLanguage();

    $translateProvider.useLocalStorage();

  })
  .run(function ($rootScope, $log, debug, currentUser, $location, $route, APP_CONFIG, models) {
    "use strict";

    debug("application run called");
    $rootScope.debug = debug;
    $rootScope.models = models;
    var checkRouteForAuthorization;

    var connector = Model.AngularConnector(APP_CONFIG.modelizerurl);

    _.forEach(models, function (model) {  // setup connection for each model
      model.connection(connector);
    });

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
        if (next.$$route.originalPath.match(/^\/registration/)) {
          $location.path('/admin');
        }
      }

    });

  });

// @TODO check logging if it is neccessary to start via DI?
// DO not remove logging from DI list!
angular.module('anorakApp')
  .controller('AppCtrl', function ($scope, $location, $translate) {
    'use strict';

    $scope.gotoLogin = function () {
      $location.path('/login/');
    };

  });
