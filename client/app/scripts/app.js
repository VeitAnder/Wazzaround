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
      .when('/registration/registrationforproviders', {
        templateUrl: 'page_basetemplate.html',
        controller: 'RegistrationRegistrationforprovidersPageCtrl'
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
            return models.ActivityModel.get($route.current.params.id)  // 1. load activity
              .then(function (activity) {
                // load bookable items
                var loadingBookableItems = [];
                _.forEach(activity.bookableItems, function (item) {
                  loadingBookableItems.push(item.load());              // 2. load items
                });

                return Q.all(loadingBookableItems)
                  .then(function (items) {
                    var loadingEvents = [];
                    _.forEach(items, function(item){
                      _.forEach(item.events, function(event) {
                        console.log("event", event);
                        loadingEvents.push(event.load());              // 3. load events
                      });
                    });

                    return Q.all(loadingEvents);
                  })
                  .then(function (events){
                    debug("loaded activity", activity);
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
      // _.footer.html
      'Why reacture': 'Why reActure',
      'Work with us': 'Work with us',
      'Contact': 'Contact & Impressum',
      // index.html
      'Please choose': 'Please choose',
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
      'Your current search location': 'Your current search location',
      // login.html
      'You want to put': 'You want to put',
      'your Activities': 'your activities',
      'to reacture': 'to reActure',
      'Account': 'Account',
      'Login': 'Login',
      'Password': 'Password',
      'Not registered': 'Register as Customer',
      'Not registered as Provider': 'Not registered as provider yet?',
      'Forgot password': 'Forgot password?',
      'Your e-mail address' : 'Your e-mail address',
      'Your password' : 'Your password',
      // shoppingcart.html
      'Shopping Cart': 'Shopping Cart',
      // why.html
      'Why reacture reasons': 'ReActure is a great platform for offering and finding activities around you.',
      'Register': 'Register',
      // workwithus.html
      'Quality': 'Quality',
      'online and offline': 'online and offline',
      'marketing': 'marketing',
      'International': 'International',
      'Plattform': 'Plattform',
      'One-Stop Philosophy': 'One-Stop Philosophy',
      'Local': 'Local',
      'Get': 'Get',
      'instant bookings': 'instant bookings',
      'from': 'from',
      'potential clients': 'potential clients',
      'in your area' : 'in your area',
      'No fixed costs': 'No fixed costs',
      'provision based model': 'provision based model',
      'No reservation costs': 'No reservation costs',
      'Secure': 'Secure',
      'booking': 'booking',
      'Quality managment': 'Quality managment',
      'through administrated rating system': 'through administrated rating system',
      // registration/index.html
      'Registration': 'Registration',
      'Please enter your e-mail address.': 'Please enter your e-mail address.',
      'Please enter a valid e-mail address.': 'Please enter a valid e-mail address.',
      'Password must meet the following requirements:': 'Password must meet the following requirements:',
      'At least': 'At least',
      'one uppercase letter': 'one uppercase letter',
      'one number': 'one number',
      '8 characters long': '8 characters long',
      'Retype Password': 'Retype Password',
      'Please retype the password.': 'Please retype the password.',
      'The passwords have to match.': 'The passwords have to match.',
      'back to login': 'back to login',
      // registration/forgotpassword/setpassword.html
      'Enter your new password': 'Enter your new password',
      'New Password': 'New Password',
      'Password must meet the following requirements': 'Password must meet the following requirements:',
      'Repeat new password': 'Repeat new password',
      "Passwords don't match": "Passwords don't match.",
      'Please fill out this field' : 'Please fill out this field.',
      'Save new password': 'Save new password',
      'The new password was successfully saved': 'The new password was successfully saved.',
      'An error happened. The new password could not be saved': 'An error happened. The new password could not be saved.',
      'password requirements' : 'The password has to contain at least one capital letter, one number and has to have a minimum length of 8.',
      'Your new password': 'Your new password',
      'Retype your new password': 'Retype your new password',
      // registration/forgotpassword/index.html
      'Retype your password': 'Geben Sie Ihr Passwort nochmals ein',
      'Define your password': 'Enter your password',
      'Request a link to reset your password': 'Request a link to reset your password',
      'The link to reset your password was successfully sent to': 'The link to reset your password was successfully sent to',
      'This user does not exist. Check if the email address is correct': 'This user does not exist. Check if the email address is correct.',
      'An error happened. The email to reset your password could not be sent': 'An error happened. The email to reset your password could not be sent.',
      //map/mapsearchbar.html
      'Your location': 'Your location ...',
      'Find': 'Find!',
      'From': 'From',
      'until': 'until',
      'Until': 'Until',
      // directives/bookableitemlist.html
      'No events to display yet': 'No events to display yet',
      'Event': 'Event:',
      'Date': 'Date',
      'Time': 'Time',
      'Duration': 'Duration',
      'Qty': 'Qty.',
      // directives/loginstatus.html
      'Logout': 'Logout',
      // directives/uploadform.html
      'add Image': 'add Image',
      // admin/admin_basetemplate.html
      'My Activities': 'My Activities',
      'Admin All Activities': 'Admin All Activities',
      'Edit your Profile': 'Edit your Profile',
      // admin/allactivities.html
      'Publish Activities': 'Publish Activities',
      'This is the admin/allActivities view': 'This is the admin/allActivities view.',
      'Activity': 'Activity',
      'Main Category': 'Main Category',
      'Sub Category': 'Sub Category',
      'Location': 'Location',
      'publish': 'publish',
      'unpublish': 'unpublish',
      // admin/index.html
      'Administration overview': 'Administration overview',
      // admin/myactivities/detail.html
      'delete': 'delete',
      'Your activity is published': 'Your activity is published!',
      'Your activity isnt published yet': "Your activity isn't published yet!",
      'Company offering this activity': 'Company offering this activity:',
      'back to my activities': "Go to 'My Activities'",
      'edit': 'edit',
      // admin/myactivities/edit.html
      'New activity': 'New activity',
      'Global Activity Info': 'Global Activity Info',
      'Name of Activity or Activities': 'Name of Activity or Activities',
      'Meeting spot of this activity': 'Meeting spot of this activity',
      'Enter address of meeting spot': 'Enter address of meeting spot',
      'Submit address': 'Save address',
      'Click in map to reposition location of activity': 'Click in map to reposition location of activity',
      'Select Main Category': 'Select Main Category',
      'You can choose 2 Subcategories at most': 'You can choose 2 Subcategories at most!',
      'You must choose at least 1 Subcategory': 'You must choose at least 1 Subcategory!',
      'Description': 'Description',
      'Images': 'Images',
      'What can be booked': 'What can be booked?',
      'create a new event': 'Create a new event',
      'Price in €': 'Price in €',
      'Delete Item': 'Delete Item',
      'Schedule Event': 'Schedule Event',
      'Quantity': 'Quantity',
      'repeating': 'repeating',
      'Mon': 'Mon',
      'Tue': 'Tue',
      'Wed': 'Wed',
      'Thu': 'Thu',
      'Fri': 'Fri',
      'Sat': 'Sat',
      'Sun': 'Sun',
      'remove': 'remove',
      'save': 'save',
      'cancel': '',
      'Enter company': 'Enter company',
      // admin/myactivities/index.html
      'add activity': 'add activity'
    });

    $translateProvider.translations('de', {
      // _.footer.html
      'Why reacture': 'Warum reActure',
      'Work with us': 'Arbeiten Sie mit uns',
      'Contact': 'Kontakt & Impressum',
      // index.html
      'Please choose': 'Bitte wählen Sie',
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
      'Your current search location': 'Ihre Suchposition',
      // login.html
      'You want to put': 'Sie wollen',
      'your Activities': 'Ihre Aktivitäten',
      'to reacture': 'auf reActure stellen',
      'Account': 'Account',
      'Login': 'Login',
      'Password': 'Passwort',
      'Not registered': 'Noch nicht registriert?',
      'Not registered as Provider': 'Noch nicht als Aktivitätenanbieter registriert?',
      'Forgot password': 'Passwort vergessen?',
      'Your e-mail address' : 'Ihre E-Mail Adresse',
      'Your password' : 'Ihr Passwort',
      // shoppingcart.html
      'Shopping Cart': 'Warenkorb',
      // why.html
      'Why reacture reasons': 'ReActure ist eine großartige Plattform um Aktivitäten rund um Ihre Location zu finden oder anzubieten.',
      'Register': 'Registrieren',
      // workwithus.html
      'Quality': 'Qualität',
      'online and offline': 'im online und offline',
      'marketing': 'Marketing',
      'International': 'Internationale',
      'Plattform': 'Plattform',
      'One-Stop Philosophy': 'One-Stop Philosophie',
      'Local': 'Lokal',
      'Get': 'Erhalten Sie',
      'instant bookings': 'sofortige Buchungen',
      'from': 'von',
      'potential clients': 'potentiellen KundInnen',
      'in your area': 'in Ihrer Umgebung',
      'No fixed costs': 'Keine Fixkosten',
      'provision based model': 'provisionsbasiertes Modell',
      'No reservation costs': 'Keine Reservierungskosten',
      'Secure': 'Sicheres',
      'booking': 'Buchen',
      'Quality managment': 'Qualitätsmanagement',
      'through administrated rating system': 'durch ein administriertes Bewertungssystem',
      // registration/index.html
      'Registration': 'Registrierung',
      'Please enter your e-mail address.': 'Bitte geben Sie Ihre E-Mail Adresse ein.',
      'Please enter a valid e-mail address.': 'Bitte geben Sie eine gültige E-Mail Adresse ein.',
      'Password must meet the following requirements:': 'Das Passwort muss folgende Kriterien erfüllen:',
      'At least': 'Mindestens',
      'one uppercase letter': 'ein Großbuchstabe',
      'one number': 'eine Zahl',
      '8 characters long': 'eine Länge von 8',
      'Retype Password': 'Passwort wiederholen',
      'Please retype the password.': 'Bitte geben Sie das Passwort nochmals ein.',
      'The passwords have to match.': 'Die Passwörter müssen übereinstimmen.',
      'back to login': 'Zurück zum Login',
      // registration/forgotpassword/setpassword.html
      'Enter your new password': 'Geben Sie Ihr neues Passwort ein',
      'New Password': 'Neues Passwort',
      'Password must meet the following requirements': 'Das Passwort muss folgende Kriterien erfüllen:',
      'Repeat new password': 'Passwort wiederholen',
      "Passwords don't match": 'Die Passwörter stimmen nicht überein.',
      'Please fill out this field' : 'Bitte füllen Sie dieses Feld aus.',
      'Save new password': 'Neues Passwort speichern',
      'The new password was successfully saved': 'Das neue Passwort wurde erfolgreich gespeichert.',
      'An error happened. The new password could not be saved': 'Es gab einen Fehler. Das neue Passwort konnte nicht erfolgreich gespeichert werden.',
      'password requirements' : 'Das Passwort muss zumindest einen Großbuchstaben und eine Zahl enthalten, und aus mindestens 8 Zeichen bestehen.',
      'Your new password': 'Ihr neues Passwort',
      'Retype your new password': 'Wiederholen Sie Ihr neues Passwort',
      // registration/forgotpassword/index.html
      'Retype your password': 'Geben Sie Ihr Passwort nochmals ein',
      'Define your password': 'Geben Sie Ihr Passwort ein',
      'Request a link to reset your password': 'Request a link to reset your password',
      'The link to reset your password was successfully sent to': 'Der Link zum Zurücksetzen des Passworts wurde erfolgreich gesendet an',
      'This user does not exist. Check if the email address is correct': 'Dieser Account existiert nicht. Überprüfen Sie, ob die E-Mail Adresse stimmt.',
      'An error happened. The email to reset your password could not be sent': 'Es gab einen Fehler. Der Link zum Zurücksetzen Ihres Passworts konnte nicht versendet werden',
      //map/mapsearchbar.html
      'Your location': 'Dein Ort ...',
      'Find': 'Suchen!',
      'From': 'Von',
      'until': 'bis',
      'Until': 'Bis',
      // directives/bookableitemlist.html
      'No events to display yet': 'Noch keine Events zum Anzeigen vorhanden',
      'Event': 'Event:',
      'Date': 'Datum',
      'Time': 'Zeit',
      'Duration': 'Dauer',
      'Qty': 'Menge',
      // directives/loginstatus.html
      'Logout': 'Logout',
      // directives/uploadform.html
      'add Image': 'Bild hinzufügen',
      // admin/admin_basetemplate.html
      'My Activities': 'Meine Aktivitäten',
      'Admin All Activities': 'Admin Alle Aktivitäten',
      'Edit your Profile': 'Profil editieren',
      // admin/allactivities.html
      'Publish Activities': 'Aktivitäten veröffentlichen',
      'This is the admin/allActivities view': 'Das ist die Admin / Alle Aktivitäten Ansicht.',
      'Activity': 'Aktivität',
      'Main Category': 'Hauptkategorie',
      'Sub Category': 'Subkategorie',
      'Location': 'Ort',
      'publish': 'veröffentlichen',
      'unpublish': 'auf privat setzen',
      // admin/index.html
      'Administration overview': 'Administrations-Übersicht',
      // admin/myactivities/detail.html
      'delete': 'löschen',
      'Your activity is published': 'Ihre Aktivität wurde veröffentlicht!',
      'Your activity isnt published yet': "Ihre Aktivität wurde noch nicht veröffentlicht!",
      'Company offering this activity': 'Anbietende Firma:',
      'back to my activities': 'Zu "Meine Aktivitäten"',
      'edit': 'bearbeiten',
      // admin/myactivities/edit.html
      'New activity': 'Neue Aktivität',
      'Global Activity Info': 'Daten der Aktivität',
      'Name of Activity or Activities': 'Bezeichnung der Aktivität/en',
      'Meeting spot of this activity': 'Treffpunkt für diese Aktivität',
      'Enter address of meeting spot': 'Geben Sie die Adresse des Treffpunktes ein',
      'Submit address': 'Adresse speichern',
      'Click in map to reposition location of activity': 'Klicken Sie in die Karte, um den Ort der Aktivität anzupassen',
      'Select Main Category': 'Hauptkategorie auswählen',
      'You can choose 2 Subcategories at most': 'Sie können höchstens 2 Subkategorien auswählen!',
      'You must choose at least 1 Subcategory': 'Sie müssen mindestens 1 Subkategorie auswählen!',
      'Description': 'Beschreibung',
      'Images': 'Bilder',
      'What can be booked': 'Was kann man buchen?',
      'create a new event': 'Erstellen Sie ein neues Ereignis',
      'Price in €': 'Preis in €',
      'Delete Item': 'Event löschen',
      'Schedule Event': 'Zeitpunkte an denen das Event stattfindet',
      'Quantity': 'Menge',
      'repeating': 'regelmäßig',
      'Mon': 'Mo',
      'Tue': 'Di',
      'Wed': 'Mi',
      'Thu': 'Do',
      'Fri': 'Fr',
      'Sat': 'Sa',
      'Sun': 'So',
      'remove': 'entfernen',
      'save': 'speichern',
      'cancel': 'abbrechen',
      'Enter company': 'Firma eingeben',
      // admin/myactivities/index.html
      'add activity': 'Aktivität  hinzufügen'

    });

    $translateProvider.translations('it', {
      // _.footer.html
      'Why reacture': 'Perche reActure',
      'Work with us': 'Lavora con noi',
      'Contact': 'Contattaci',
      // index.html
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
      'Your current search location': 'Posizione di ricerca',
      // login.html
      'You want to put': '',
      'your Activities': '',
      'to reacture': '',
      'Account': 'Conto',
      'Login': 'Entra',
      'Password': 'Password',
      'Not registered': 'Non registrata?',
      'Not registered as Provider': '?',
      'Forgot password': 'Dimenticato la password?',
      'Your e-mail address' : 'Vostro indirizzo email',
      'Your password' : 'Vostra password',
      // shoppingcart.html
      'Shopping Cart': '',
      // why.html
      'Why reacture reasons': '',
      'Register': '',
      // workwithus.html
      'Quality': 'Qualità',
      'online and offline': '',
      'marketing': '',
      'International': '',
      'Plattform': '',
      'One-Stop Philosophy': '',
      'Local': '',
      'Get': '',
      'instant bookings': '',
      'from': '',
      'potential clients': '',
      'in your area': '',
      'No fixed costs': '',
      'provision based model': '',
      'No reservation costs': '',
      'Secure': '',
      'booking': '',
      'Quality managment': '',
      'through administrated rating system': '',
      // registration/index.html
      'Registration': '',
      'Please enter your e-mail address.': '',
      'Please enter a valid e-mail address.': '',
      'Password must meet the following requirements:': '',
      'At least': '',
      'one uppercase letter': '',
      'one number': '',
      '8 characters long': '',
      'Retype Password': '',
      'Please retype the password.': '',
      'The passwords have to match.': '',
      'back to login': '',
      // registration/forgotpassword/setpassword.html
      'Enter your new password': '',
      'New Password': '',
      'Password must meet the following requirements': '',
      'Repeat new password': '',
      "Passwords don't match": '',
      'Please fill out this field' : '',
      'Save new password': '',
      'The new password was successfully saved': '',
      'An error happened. The new password could not be saved': '',
      'password requirements' : '',
      'Your new password': '',
      'Retype your new password': '',
      // registration/forgotpassword/index.html
      'Retype your password': 'Geben Sie Ihr Passwort nochmals ein',
      'Define your password': '',
      'Request a link to reset your password': '',
      'The link to reset your password was successfully sent to': '',
      'This user does not exist. Check if the email address is correct': '',
      'An error happened. The email to reset your password could not be sent': 'An error happened. The email to reset your password could not be sent.',
      //map/mapsearchbar.html
      'Your location': '',
      'Find': '',
      'From': '',
      'until': '',
      'Until': '',
      // directives/bookableitemlist.html
      'No events to display yet': '',
      'Event': 'Event',
      'Date': '',
      'Time': '',
      'Duration': '',
      'Qty': '',
      // directives/loginstatus.html
      'Logout': '',
      // directives/uploadform.html
      'add Image': '',
      // admin/admin_basetemplate.html
      'My Activities': '',
      'Admin All Activities': '',
      'Edit your Profile': '',
      // admin/allactivities.html
      'Publish Activities': '',
      'This is the admin/allActivities view': '',
      'Activity': '',
      'Main Category': '',
      'Sub Category': '',
      'Location': '',
      'publish': '',
      'unpublish': '',
      // admin/index.html
      'Administration overview': '',
      // admin/myactivities/detail.html
      'delete': '',
      'Your activity is published': '',
      'Your activity isnt published yet': "Your activity isn't published yet!",
      'Company offering this activity': 'Company offering this activity:',
      'back to my activities': "",
      'edit': '',
      // admin/myactivities/edit.html
      'New activity': '',
      'Global Activity Info': '',
      'Name of Activity or Activities': '',
      'Meeting spot of this activity': '',
      'Enter address of meeting spot': '',
      'Submit address': '',
      'Click in map to reposition location of activity': '',
      'Select Main Category': '',
      'You can choose 2 Subcategories at most': '',
      'You must choose at least 1 Subcategory': '',
      'Description': '',
      'Images': '',
      'What can be booked': '',
      'create a new event': '',
      'Price in €': '',
      'Delete Item': '',
      'Schedule Event': '',
      'Quantity': '',
      'repeating': '',
      'Mon': '',
      'Tue': '',
      'Wed': '',
      'Thu': '',
      'Fri': '',
      'Sat': '',
      'Sun': '',
      'remove': '',
      'save': '',
      'cancel': '',
      'Enter company': '',
      // admin/myactivities/index.html
      'add activity': ''
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

    moment.lang('en');  // setup moment

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
