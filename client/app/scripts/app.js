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
  'directives.customvalidation',
  'ui.keypress',
  'pascalprecht.translate',
  'LocalStorageModule'
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

    $locationProvider.html5Mode((function () {
      return !!(window.history && history.pushState);
    }()));

    //if no route specified, go to default route
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'indexCtrl',
        resolve: {
          // @TODO - refactor resolves to improve performance
          categories: ['models', 'currentUser', function (models) {
            return models.CategoryModel.all();
          }],
          resolvedActivities: ['models', 'currentUser', function (models, currentUser) {
            return models.ActivityModel.all();
          }],
          resolveCurrentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
          }],
          resolvedMap: ['frontendmap', function (frontendmap) {
            return frontendmap.initializeMapWithUserSearchLocation();
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
      .when('/admin/allactivities', {
        templateUrl: 'views/admin/admin_basetemplate.html',
        controller: 'AdminAllactivitiesCtrl',
        resolve: {
          activities: ['models', function (models) {
            return models.ActivityModel.all();
          }]
        }
      })
      .when('/admin/allactivities/:id/', {
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
        controller: 'AdminProfileEditCtrl',
        resolve: {
          currentUser: ['currentUser', function (currentUser) {
            return currentUser.load();
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

//    WE WANT THIS RESULT IN CSV
//    { "data" : [
//      {    "id":1,    "name":"Johnson, Smith, and Jones Co."  },
//      {    "id":2,    "name":"Sam \"Mad Dog\" Smith"  },
//      {    "id":3,    "name":"Barney & Company"  },
//      {    "id":4,    "name":"Johnson's Automotive"  }
//    ] }

    $translateProvider.translations('en', {
      "Why reacture": "Why reActure?",
      "Work with us": "Work with us",
      "Contact": "Contact & Impressum",
      "Please choose": "Please choose",
      "sports": "Sports & Activities",
      "culture": "Culture",
      "wellness": "Wellness & Relax",
      "Sports and Activities": "Sports & Activities",
      "of": "of",
      "Select all": "Select all",
      "Deselect all": "Deselect all",
      "Culture": "Culture",
      "Wellness & Relax": "Wellness & Relax",
      "Show all": "Show all",
      "Hide all": "Hide all",
      "Offered by": "Offered by:",
      "Availability": "Availability:",
      "Next available Dates": "Next available Dates",
      "Book": "Book",
      "Prev": "Prev",
      "Show all Dates": "Show all Dates",
      "Next": "Next",
      "trekkingbikinghiking": "Trekking, Biking, Hiking",
      "adventure": "Adventure",
      "yogapilates": "Yoga & Pilates",
      "fulldayactivities": "Full day activities",
      "watersports": "Water Sports",
      "wintersports": "Winter Sports",
      "motorizedsports": "Motorized Sports",
      "extremesports": "Extreme Sports",
      "Trekking, Biking, Hiking": "Trekking, Biking, Hiking",
      "Yoga & Pilates": "Yoga & Pilates",
      "Water Sports": "Water Sports",
      "Motorized Sports": "Motorized Sports",
      "Adventure": "Adventure",
      "Full day activities": "Full day activities",
      "Winter Sports": "Winter Sports",
      "Extreme Sports": "Extreme Sports",
      "degustations": "Degustations: Wine & Food & Cigars",
      "guidedtours": "Guided Tours",
      "exhibitionsandfairs": "Exhibitions & Fairs",
      "operaandtheater": "Opera & Theater",
      "musicandfilm": "Music & Film",
      "Degustations: Wine & Food & Cigars": "Degustations: Wine & Food & Cigars",
      "Exhibitions & Fairs": "Exhibitions & Fairs",
      "Music & Film": "Music & Film",
      "Guided Tours": "Guided Tours",
      "Opera & Theater": "Opera & Theater",
      "massages": "Massages",
      "medicaltreatments": "Medical Treatments",
      "beauty": "Beauty",
      "spaandsauna": "Spa & Sauna",
      "Massages": "Massages",
      "Beauty": "Beauty",
      "Medical Treatments": "Medical Treatments",
      "Spa & Sauna": "Spa & Sauna",
      "Your current search location": "Your current search location",
      "You want to put": "You want to put",
      "your Activities": "your activities",
      "to reacture": "to reActure",
      "Account": "Your account",
      "Login": "Login",
      "Password": "Password",
      "Not registered": "Register as Customer",
      "Not registered as Provider": "Register as activity provider now!",
      "Forgot password": "Forgot password?",
      "Your e-mail address": "Your e-mail address",
      "Your password": "Your password",
      "Invalid Password": "Invalid password",
      "User not found": "This user does not exist",
      "Shopping Cart": "Shopping Cart",
      "Why reacture reasons": "ReActure is a great platform for offering and finding activities around you.",
      "Register": "Register",
      "Quality": "Quality",
      "online and offline": "online and offline",
      "marketing": "marketing",
      "International": "International",
      "Plattform": "Plattform",
      "One-Stop Philosophy": "One-Stop Philosophy",
      "Local": "Local",
      "Get": "Get",
      "instant bookings": "instant bookings",
      "from": "from",
      "potential clients": "potential clients",
      "in your area": "in your area",
      "No fixed costs": "No fixed costs",
      "provision based model": "provision based model",
      "No reservation costs": "No reservation costs",
      "Secure": "Secure",
      "booking": "booking",
      "Quality managment": "Quality managment",
      "through administrated rating system": "through administrated rating system",
      "Registration": "Registration",
      "Please enter your e-mail address.": "Please enter your e-mail address.",
      "Please enter a valid e-mail address.": "Please enter a valid e-mail address.",
      "Password must meet the following requirements:": "Password must meet the following requirements:",
      "At least": "At least",
      "one uppercase letter": "one uppercase letter",
      "one number": "one number",
      "8 characters long": "8 characters long",
      "Retype Password": "Retype Password",
      "Please retype the password.": "Please retype the password.",
      "The passwords have to match.": "The passwords have to match.",
      "back to login": "back to login",
      "User already exists": "User already exists",
      "Enter your new password": "Enter your new password",
      "New Password": "New Password",
      "Password must meet the following requirements": "Password must meet the following requirements:",
      "Repeat new password": "Repeat new password",
      "Passwords dont match": "Passwords don't match.",
      "Please fill out this field": "Please fill out this field.",
      "Save new password": "Save new password",
      "The new password was successfully saved": "The new password was successfully saved.",
      "An error happened. The new password could not be saved": "An error happened. The new password could not be saved.",
      "password requirements": "The password has to contain at least one capital letter, one number and has to have a minimum length of 8.",
      "Your new password": "Your new password",
      "Retype your new password": "Retype your new password",
      "Retype your password": "Retype your password",
      "Define your password": "Enter your password",
      "Request a link to reset your password": "Request a link to reset your password",
      "The link to reset your password was successfully sent to": "The link to reset your password was successfully sent to",
      "This user does not exist. Check if the email address is correct": "This user does not exist. Check if the email address is correct.",
      "An error happened. The email to reset your password could not be sent": "An error happened. The email to reset your password could not be sent.",
      "Registration for Activity Providers": "Registration for Activity Providers",
      "Company": "Company",
      "Your company": "Your company",
      "Please enter your company": "Please enter your company",
      "First name": "First Name",
      "Your first name": "Your first name",
      "Please enter your first name": "Please enter your first name",
      "Last name": "Last name",
      "Name": "Name",
      "Your last name": "Your last name",
      "Please enter your last name": "Please enter your last name",
      "Telephone": "Telephone",
      "Your telephone number": "Your telephone number",
      "Please enter your telephone number": "Please enter your telephone number",
      "Fax": "Fax",
      "Your fax number": "Your fax number",
      "Please enter your fax number": "Please enter your fax number",
      "Address": "Address",
      "Your address": "Your address",
      "Please enter your address": "Please enter your address",
      "Zip": "Zip",
      "Your zip code": "Your zip code",
      "Please enter your zip code": "Please enter your zip code",
      "City": "City",
      "Your city": "Your city",
      "Please enter your city": "Please enter your city",
      "Country": "Country",
      "Your country": "Your country",
      "Please enter your country": "Please enter your country",
      "Name of contact person": "Name of contact person",
      "Please enter the name of the contact person": "Please enter the name of the contact person",
      "UID optional": "UID optional",
      "Your UID number": "Your UID number",
      "Your location": "Your location ...",
      "Find": "Find!",
      "From": "From",
      "until": "until",
      "Until": "Until",
      "No events to display yet": "No events to display yet",
      "Event": "Event",
      "Date": "Date",
      "Time": "Time",
      "Duration": "Duration",
      "Duration in hours": "Duration in hours",
      "Qty": "Qty.",
      "Logout": "Logout",
      "add Image": "add Image",
      "My Activities": "My Activities",
      "Admin All Activities": "Administrate all Activities",
      "Edit your Profile": "Edit your Profile",
      "Publish Activities": "Publish Activities",
      "This is the admin/allActivities view": "This is the admin/allActivities view.",
      "Activity": "Activity",
      "Main Category": "Main Category",
      "Sub Category": "Sub Category",
      "Location": "Location",
      "publish": "publish",
      "unpublish": "unpublish",
      "Administration overview": "Administration overview",
      "delete": "delete",
      "Your activity is published": "Your activity is published!",
      "Your activity isnt published yet": "Your activity isn't published yet!",
      "Company offering this activity": "Company offering this activity:",
      "back to my activities": "Go to 'My Activities'",
      "edit": "edit",
      "Please create bookable events.": "Please create bookable events.",
      "Please enter the name of the activity/activities.": "Please enter the name of the activity/activities.",
      "Please enter the name of your company.": "Please enter the name of your company.",
      "Please upload an image.": "Please upload an image.",
      "save event": "Save event",
      "New activity": "New activity",
      "Global Activity Info": "Global Activity Info",
      "Name of Activity or Activities": "Name of Activity or Activities",
      "Meeting spot of this activity": "Meeting spot of this activity",
      "Enter address of meeting spot": "Enter address of meeting spot",
      "Submit address": "Save address",
      "Click in map to reposition location of activity": "Click in map to reposition location of activity",
      "Select Main Category": "Select Main Category",
      "You can choose 2 Subcategories at most": "You can choose 2 Subcategories at most!",
      "You must choose at least 1 Subcategory": "You must choose at least 1 Subcategory!",
      "Description": "Description",
      "Images": "Images",
      "What can be booked": "What can be booked?",
      "create a new event": "Create a new event",
      "create a bookable item": "Create a bookable Item",
      "Price in €": "Price in €",
      "Price": "Price",
      "Delete Item": "Delete Item",
      "Schedule Event": "Schedule Event",
      "Add Event": "Add Event",
      "Add new Event": "Add new Event",
      "Quantity": "Quantity",
      "repeating Event": "repeating Event",
      "Mon": "Mon",
      "Tue": "Tue",
      "Wed": "Wed",
      "Thu": "Thu",
      "Fri": "Fri",
      "Sat": "Sat",
      "Sun": "Sun",
      "remove": "remove",
      "save": "save",
      "cancel": "cancel",
      "Enter company": "Enter company",
      "Access denied": "Access denied!",
      "add activity": "add activity",
      "Profile": "User profile",
      "Edit Profile": "Edit user profile",
      "Bookable item description placeholder": "i.e. 4 hours tour (500ccm)",
      "Bank account": "Bank account",
      "Bank": "Bank",
      "Name of your Bank": "Name of your Bank",
      "Please enter the name of your Bank": "Please enter the name of your Bank",
      "IBAN": "IBAN",
      "Your IBAN": "Your IBAN",
      "Please enter your IBAN": "Please enter your IBAN",
      "BIC": "BIC",
      "Your BIC": "Your BIC",
      "Please enter your BIC": "Please enter your BIC",
      "Account owner": "Account owner",
      "Name of account owner": "Name of account owner",
      "Please enter the name of the account owner": "Please enter the name of the account owner",
      "yes, delete": "yes, delete",
      "no": "no",
      "Delete bookable item with all events?": "Delete bookable item with all events?",
      "Please select a location.": "Please select a location.",
      "Your unsaved data will be lost if you leave this page": "Your unsaved data will be lost if you leave this page",
      "activities found": "activities found",
      "Personal data": "Personal data",
      "Company data": "Company data",
      "Your changes have been saved": "Your changes have been saved",
      "Your changes could not be saved": "Your changes could not be saved",
      "Please fill out the form correctly": "Please fill out the form correctly",
      "All dates from activity": "All dates from activity",
      "endBeforeStart": "The end date is before the start date",
      "Map view": "Map view",
      "No Activities found.": "No Activities found.",
      "Zoom out the map or reset your filter settings.": "Zoom out the map or reset your filter settings.",
      "The repeating events will have the same starting time and duration as above" : "The repeating events will have the same starting time and duration as above",
      "Please select at least one day for repeating event." : "Please select at least one day for repeating event.",
      "create event until": "Create events until this date",
      "Please select a date until which the repeating events should be created": "Please select a date until which the repeating events should be created"
    });

    $translateProvider.translations('de', {
      "Why reacture": "Warum reActure?",
      "Work with us": "Arbeiten Sie mit uns",
      "Contact": "Kontakt & Impressum",
      "Please choose": "Bitte wählen Sie",
      "sports": "Sport & Aktivitäten",
      "culture": "Kultur",
      "wellness": "Wellness & Entspannung",
      "Sports and Activities": "Sport & Aktivitäten",
      "of": "von",
      "Select all": "Alle auswählen",
      "Deselect all": "Keine auswählen",
      "Culture": "Kultur",
      "Wellness & Relax": "Wellness & Entspannung",
      "Show all": "Alle anzeigen",
      "Hide all": "Keine anzeigen",
      "Offered by": "Angeboten von:",
      "Availability": "Verfügbarkeit:",
      "Next available Dates": "Nächste Verfügbarkeit",
      "Book": "Buchen",
      "Prev": "Früher",
      "Show all Dates": "Alle Termine anzeigen",
      "Next": "Später",
      "trekkingbikinghiking": "Trekking, Biking, Hiking",
      "adventure": "Abenteuer",
      "yogapilates": "Yoga & Pilates",
      "fulldayactivities": "Ganztagsaktivitäten",
      "watersports": "Wassersport",
      "wintersports": "Wintersport",
      "motorizedsports": "Motorsport",
      "extremesports": "Extremsport",
      "Trekking, Biking, Hiking": "Trekking, Biking, Hiking",
      "Yoga & Pilates": "Yoga & Pilates",
      "Water Sports": "Wassersport",
      "Motorized Sports": "Motorsport",
      "Adventure": "Abenteuer",
      "Full day activities": "Ganztagsaktivitäten",
      "Winter Sports": "Wintersport",
      "Extreme Sports": "Extremsport",
      "degustations": "Verkostungen: Wein & Delikatessen & Zigarren",
      "guidedtours": "Führungen",
      "exhibitionsandfairs": "Ausstellungen & Messen",
      "operaandtheater": "Oper & Theater",
      "musicandfilm": "Musik & Film",
      "Degustations: Wine & Food & Cigars": "Verkostungen: Wein & Delikatessen & Zigarren",
      "Exhibitions & Fairs": "Ausstellungen & Messen",
      "Music & Film": "Musik & Film",
      "Guided Tours": "Führungen",
      "Opera & Theater": "Oper & Theater",
      "massages": "Massagen",
      "medicaltreatments": "Medizinische Behanldungen",
      "beauty": "Schönheit",
      "spaandsauna": "Spa & Sauna",
      "Massages": "Massagen",
      "Beauty": "Schönheit",
      "Medical Treatments": "Medizinische Behanldungen",
      "Spa & Sauna": "Spa & Sauna",
      "Your current search location": "Ihre Suchposition",
      "You want to put": "Sie wollen",
      "your Activities": "Ihre Aktivitäten",
      "to reacture": "auf reActure stellen",
      "Account": "Benutzerkonto",
      "Login": "Login",
      "Password": "Passwort",
      "Not registered": "Noch nicht registriert?",
      "Not registered as Provider": "Jetzt als Aktivitäten-Anbieter registrieren!",
      "Forgot password": "Passwort vergessen?",
      "Your e-mail address": "Ihre E-Mail Adresse",
      "Your password": "Ihr Passwort",
      "Invalid Password": "Ungültiges Passwort",
      "User not found": "Dieser User existiert nicht",
      "Shopping Cart": "Warenkorb",
      "Why reacture reasons": "ReActure ist eine großartige Plattform um Aktivitäten rund um Ihre Location zu finden oder anzubieten.",
      "Register": "Registrieren",
      "Quality": "Qualität",
      "online and offline": "im online und offline",
      "marketing": "Marketing",
      "International": "Internationale",
      "Plattform": "Plattform",
      "One-Stop Philosophy": "One-Stop Philosophie",
      "Local": "Lokal",
      "Get": "Erhalten Sie",
      "instant bookings": "sofortige Buchungen",
      "from": "von",
      "potential clients": "potentiellen KundInnen",
      "in your area": "in Ihrer Umgebung",
      "No fixed costs": "Keine Fixkosten",
      "provision based model": "provisionsbasiertes Modell",
      "No reservation costs": "Keine Reservierungskosten",
      "Secure": "Sicheres",
      "booking": "Buchen",
      "Quality managment": "Qualitätsmanagement",
      "through administrated rating system": "durch ein administriertes Bewertungssystem",
      "Registration": "Registrierung",
      "Please enter your e-mail address.": "Bitte geben Sie Ihre E-Mail Adresse ein.",
      "Please enter a valid e-mail address.": "Bitte geben Sie eine gültige E-Mail Adresse ein.",
      "Password must meet the following requirements:": "Das Passwort muss folgende Kriterien erfüllen:",
      "At least": "Mindestens",
      "one uppercase letter": "ein Großbuchstabe",
      "one number": "eine Zahl",
      "8 characters long": "eine Länge von 8",
      "Retype Password": "Passwort wiederholen",
      "Please retype the password.": "Bitte geben Sie das Passwort nochmals ein.",
      "The passwords have to match.": "Die Passwörter müssen übereinstimmen.",
      "back to login": "Zurück zum Login",
      "User already exists": "Dieser User existiert bereits",
      "Enter your new password": "Geben Sie Ihr neues Passwort ein",
      "New Password": "Neues Passwort",
      "Password must meet the following requirements": "Das Passwort muss folgende Kriterien erfüllen:",
      "Repeat new password": "Passwort wiederholen",
      "Passwords dont match": "Die Passwörter stimmen nicht überein.",
      "Please fill out this field": "Bitte füllen Sie dieses Feld aus.",
      "Save new password": "Neues Passwort speichern",
      "The new password was successfully saved": "Das neue Passwort wurde erfolgreich gespeichert.",
      "An error happened. The new password could not be saved": "Es gab einen Fehler. Das neue Passwort konnte nicht erfolgreich gespeichert werden.",
      "password requirements": "Das Passwort muss zumindest einen Großbuchstaben und eine Zahl enthalten, und aus mindestens 8 Zeichen bestehen.",
      "Your new password": "Ihr neues Passwort",
      "Retype your new password": "Wiederholen Sie Ihr neues Passwort",
      "Retype your password": "Geben Sie Ihr Passwort nochmals ein",
      "Define your password": "Geben Sie Ihr Passwort ein",
      "Request a link to reset your password": "Link zum Zurücksetzen des Passworts anfordern",
      "The link to reset your password was successfully sent to": "Der Link zum Zurücksetzen des Passworts wurde erfolgreich gesendet an",
      "This user does not exist. Check if the email address is correct": "Dieser Account existiert nicht. Überprüfen Sie, ob die E-Mail Adresse stimmt.",
      "An error happened. The email to reset your password could not be sent": "Es gab einen Fehler. Der Link zum Zurücksetzen Ihres Passworts konnte nicht versendet werden",
      "Registration for Activity Providers": "Registrierung für AktivitätsanbieterInnen",
      "Company": "Firma",
      "Your company": "Ihre Firma",
      "Please enter your company": "Bitte geben Sie Ihre Firma ein",
      "First name": "Vorname",
      "Your first name": "Ihr Vorname",
      "Please enter your first name": "Bitte geben Sie Ihren Vornamen ein",
      "Last name": "Nachname",
      "Name": "Name",
      "Your last name": "Ihr Nachname",
      "Please enter your last name": "Bitte geben Sie Ihren Nachnamen ein",
      "Telephone": "Telefon",
      "Your telephone number": "Ihre Telefonnummer",
      "Please enter your telephone number": "Bitte geben Sie Ihre Telefonnummer ein",
      "Fax": "Fax",
      "Your fax number": "Ihre Faxnummer",
      "Please enter your fax number": "Bitte geben Sie Ihre Faxnummer ein",
      "Address": "Adresse",
      "Your address": "Ihre Adresse",
      "Please enter your address": "Bitte geben Sie Ihre Adresse ein",
      "Zip": "Postleitzahl",
      "Your zip code": "Ihre Postleitzahl",
      "Please enter your zip code": "Bitte geben Sie Ihre Postleitzahl ein",
      "City": "Stadt",
      "Your city": "Ihre Stadt",
      "Please enter your city": "Bitte geben Sie Ihre Stadt ein",
      "Country": "Land",
      "Your country": "Ihr Land",
      "Please enter your country": "Bitte geben Sie Ihr Land ein",
      "Name of contact person": "Name der Ansprechperson",
      "Please enter the name of the contact person": "Bitte geben Sie den Namen des Ansprechpartners / der Ansprechpartnerin ein",
      "UID optional": "UID optional",
      "Your UID number": "Ihre UID Nummer",
      "Your location": "Dein Ort ...",
      "Find": "Suchen!",
      "From": "Von",
      "until": "bis",
      "Until": "Bis",
      "No events to display yet": "Noch keine Events zum Anzeigen vorhanden",
      "Event": "Event",
      "Date": "Datum",
      "Time": "Zeit",
      "Duration": "Dauer",
      "Duration in hours": "Dauer in Stunden",
      "Qty": "Menge",
      "Logout": "Logout",
      "add Image": "Bild hinzufügen",
      "My Activities": "Meine Aktivitäten",
      "Admin All Activities": "Administration aller Aktivitäten",
      "Edit your Profile": "Profil editieren",
      "Publish Activities": "Aktivitäten veröffentlichen",
      "This is the admin/allActivities view": "Das ist die Admin / Alle Aktivitäten Ansicht.",
      "Activity": "Aktivität",
      "Main Category": "Hauptkategorie",
      "Sub Category": "Subkategorie",
      "Location": "Ort",
      "publish": "veröffentlichen",
      "unpublish": "auf privat setzen",
      "Administration overview": "Administrations-Übersicht",
      "delete": "löschen",
      "Your activity is published": "Ihre Aktivität wurde veröffentlicht!",
      "Your activity isnt published yet": "Ihre Aktivität wurde noch nicht veröffentlicht!",
      "Company offering this activity": "Anbietende Firma:",
      "back to my activities": "Gehe zu \"Meine Aktivitäten\"",
      "edit": "bearbeiten",
      "Please create bookable events.": "Bitte erstellen Sie buchbare Events.",
      "Please upload an image.": "Bitte laden Sie ein Bild hoch.",
      "Please enter the name of the activity/activities.": "Bitte geben Sie den/die Namen der Aktivität/en ein.",
      "Please enter the name of your company.": "Bitte geben Sie den Namen Ihrer Firma ein.",
      "save event": "Event speichern",
      "New activity": "Neue Aktivität",
      "Global Activity Info": "Daten der Aktivität",
      "Name of Activity or Activities": "Bezeichnung der Aktivität/en",
      "Meeting spot of this activity": "Treffpunkt für diese Aktivität",
      "Enter address of meeting spot": "Geben Sie die Adresse des Treffpunktes ein",
      "Submit address": "Adresse speichern",
      "Click in map to reposition location of activity": "Klicken Sie in die Karte, um den Ort der Aktivität anzupassen",
      "Select Main Category": "Hauptkategorie auswählen",
      "You can choose 2 Subcategories at most": "Sie können höchstens 2 Subkategorien auswählen!",
      "You must choose at least 1 Subcategory": "Sie müssen mindestens 1 Subkategorie auswählen!",
      "Description": "Beschreibung",
      "Images": "Bilder",
      "What can be booked": "Was kann man buchen?",
      "create a new event": "Erstellen Sie ein neues Ereignis",
      "create a bookable item": "Erstellen Sie einen buchbaren Artikel",
      "Price in €": "Preis in €",
      "Price": "Preis",
      "Delete Item": "Event löschen",
      "Schedule Event": "Zeitpunkte an denen das Event stattfindet",
      "Add Event": "Termin hinzufügen",
      "Add new Event": "Neuen Termin hinzufügen",
      "Quantity": "Menge",
      "repeating Event": "regelmäßiger Termin",
      "Mon": "Mo",
      "Tue": "Di",
      "Wed": "Mi",
      "Thu": "Do",
      "Fri": "Fr",
      "Sat": "Sa",
      "Sun": "So",
      "remove": "entfernen",
      "save": "speichern",
      "cancel": "abbrechen",
      "Enter company": "Firma eingeben",
      "Access denied": "Kein Zugriff!",
      "add activity": "Aktivität  hinzufügen",
      "Profile": "Benutzerprofil",
      "Edit Profile": "Benutzerprofil editieren",
      "Bookable item description placeholder": "z.B. 4 Stunden Tour (500ccm)",
      "Bank account": "Bank account",
      "Bank": "Bank",
      "Name of your Bank": "Name of your Bank",
      "Please enter the name of your Bank": "Please enter the name of your Bank",
      "IBAN": "IBAN",
      "Your IBAN": "Your IBAN",
      "Please enter your IBAN": "Please enter your IBAN",
      "BIC": "BIC",
      "Your BIC": "Your BIC",
      "Please enter your BIC": "Please enter your BIC",
      "Account owner": "Account owner",
      "Name of account owner": "Name of account owner",
      "Please enter the name of the account owner": "Please enter the name of the account owner",
      "yes, delete": "ja, löschen",
      "no": "nein",
      "Delete bookable item with all events?": "Dieses Event und alle Daten löschen?",
      "Please select a location.": "Bitte wählen Sie einen Ort.",
      "Your unsaved data will be lost if you leave this page": "Ihre ungespeicherten Daten gehen verloren wenn Sie diese Seite jetzt verlassen",
      "activities found": "activities found",
      "Personal data": "Persönliche Daten",
      "Company data": "Firmendaten",
      "Your changes have been saved": "Ihre Änderungen wurden gespeichert",
      "Your changes could not be saved": "Ihre Änderungen konnten nicht gespeichert werden",
      "Please fill out the form correctly": "Bitte füllen Sie das Formular korrekt aus",
      "All dates from activity": "All dates from activity",
      "endBeforeStart": "Das Event-Ende liegt vor dem Event-Start",
      "Map view": "Kartenansicht",
      "No Activities found.": "Keine Aktivitäten gefunden.",
      "Zoom out the map or reset your filter settings.": "Verkleinern Sie die Karte oder setzen Sie Ihre Filter-Einstellungen zurück.",
      "The repeating events will have the same starting time and duration as above" : "Die Wiederholungs-Events haben die gleiche Startzeit und Dauer",
      "Please select at least one day for repeating event." : "Bitte wählen Sie mindestens einen Tag aus",
      "create event until": "Events bis zu diesem Datum erzeugen",
      "Please select a date until which the repeating events should be created": "Bitte wählen Sie ein Datum bis zu welchem die sich wiederholenden Events angelegt werden sollen"
    });

    $translateProvider.translations('it', {
      "Why reacture": "Perché reActure?",
      "Work with us": "Lavora con noi",
      "Contact": "Contattaci",
      "Please choose": "Si prega di scegliere",
      "sports": "Sport & Attività",
      "culture": "Cultura",
      "wellness": "Wellness & Relax",
      "Sports and Activities": "Sport & Attività",
      "of": "di",
      "Select all": "Seleziona tutto",
      "Deselect all": "Deseleziona tutto",
      "Culture": "Cultura",
      "Wellness & Relax": "Wellness & Relax",
      "Show all": "Vedi tutto",
      "Hide all": "Nascondi tutto",
      "Offered by": "Offerto da:",
      "Availability": "Disponibilità:",
      "Next available Dates": "Date prossime",
      "Book": "Prenota",
      "Prev": "Prima",
      "Show all Dates": "Mostra tutte le date",
      "Next": "Più tardi",
      "trekkingbikinghiking": "Trekking, Bike, Scalata",
      "adventure": "Avventura",
      "yogapilates": "Yoga & Pilates",
      "fulldayactivities": "Attività intera giornata",
      "watersports": "Sports acquatici",
      "wintersports": "Sports invernali",
      "motorizedsports": "Sports motoristici",
      "extremesports": "Sports estremi",
      "Trekking, Biking, Hiking": "Trekking, Bike, Scalata",
      "Yoga & Pilates": "Yoga & Pilates",
      "Water Sports": "Sports acquatici",
      "Motorized Sports": "Sports motoristici",
      "Adventure": "Avventura",
      "Full day activities": "Attività intera giornata",
      "Winter Sports": "Sports invernali",
      "Extreme Sports": "Sports estremi",
      "degustations": "Degustazioni: Vino & Cibo & Sigari",
      "guidedtours": "Tour guidati",
      "exhibitionsandfairs": "Esposizioni & Fiere",
      "operaandtheater": "Opera & Teatro",
      "musicandfilm": "Musica & Cinema",
      "Degustations: Wine & Food & Cigars": "Degustazioni: Vino & Cibo & Sigari",
      "Exhibitions & Fairs": "Esposizioni & Fiere",
      "Music & Film": "Musica & Cinema",
      "Guided Tours": "Tour guidati",
      "Opera & Theater": "Opera & Teatro",
      "massages": "Massaggi",
      "medicaltreatments": "Trattamenti medici specifici",
      "beauty": "Beauty",
      "spaandsauna": "Spa & Sauna",
      "Massages": "Massaggi",
      "Beauty": "Bellezza",
      "Medical Treatments": "Trattamenti medici specifici",
      "Spa & Sauna": "Spa & Sauna",
      "Your current search location": "Posizione di ricerca",
      "You want to put": "Vuoi mettere",
      "your Activities": "le vostre attività",
      "to reacture": "al reActure",
      "Account": "Conto",
      "Login": "Entra",
      "Password": "Password",
      "Not registered": "Non registrata?",
      "Not registered as Provider": "Registrati come fornitore di attività ora!",
      "Forgot password": "Dimenticato la password?",
      "Your e-mail address": "Vostro indirizzo email",
      "Your password": "Vostra password",
      "Invalid Password": "Password non valida",
      "User not found": "Non trovato",
      "Shopping Cart": "Carrello della spesa",
      "Why reacture reasons": "ReActure è una grande piattaforma per l'offerta e trovare le attività intorno a te.",
      "Register": "Registrati",
      "Quality": "Qualità",
      "online and offline": "online e offline",
      "marketing": "marketing",
      "International": "internazionale",
      "Plattform": "Piattaforma",
      "One-Stop Philosophy": "La filosofia One-stop",
      "Local": "Regionale",
      "Get": "Ottenere",
      "instant bookings": "prenota subito",
      "from": "dal",
      "potential clients": "potenziali clienti",
      "in your area": "nella tua zona",
      "No fixed costs": "Nessun costo fisso",
      "provision based model": "Prestazione basato su modello",
      "No reservation costs": "Nessun costo di prenotazione",
      "Secure": "Sicura",
      "booking": "prenotazione",
      "Quality managment": "gestione della qualità",
      "through administrated rating system": "",
      "Registration": "Registrazione",
      "Please enter your e-mail address.": "Si prega di inserire il vostro indirizzo e-mail",
      "Please enter a valid e-mail address.": "Si prega di inserire un indirizzo e-mail valido",
      "Password must meet the following requirements:": "La password deve contenere almeno",
      "At least": "Almen/o",
      "one uppercase letter": "una lettera maiuscola",
      "one number": "un numero",
      "8 characters long": "8 caratteri",
      "Retype Password": "Ripetere la password",
      "Please retype the password.": "Si prega di ripetere la password",
      "The passwords have to match.": "Le password devono corrispondere",
      "back to login": "torna alla Login",
      "User already exists": "Esistente già",
      "Enter your new password": "Inserisca il Suo nuova password",
      "New Password": "Nuova password",
      "Repeat new password": "Ripete nuova password",
      "Passwords dont match": "Le password non corrispondono",
      "Please fill out this field": "Si prega di compilare questo campo",
      "Save new password": "Salvare la nuova password",
      "The new password was successfully saved": "La nuova password è stata salvata con successo",
      "An error happened. The new password could not be saved": "È accaduto un errore. Impossibile salvare la nuova password",
      "password requirements": "La password deve contenere almeno una lettera maiuscola, un numero e deve avere una lunghezza minima di 8.",
      "Your new password": "Il suo nuova password",
      "Retype your new password": "Ripetere la nuova password",
      "Retype your password": "Ripetere la password",
      "Define your password": "Inserire una password",
      "Request a link to reset your password": "",
      "The link to reset your password was successfully sent to": "Il link per reimpostare la password è stata inviata con successo al",
      "This user does not exist. Check if the email address is correct": "Non esiste. Controllare se l'indirizzo email è corretto",
      "An error happened. The email to reset your password could not be sent": "È accaduto un errore. L'e-mail per reimpostare la password non ha potuto essere inviato",
      "Registration for Activity Providers": "Registrazione per fornitori di attività",
      "Company": "Attività",
      "Your company": "La vostra attività",
      "Please enter your company": "Si prega d'inserire la vostra attività",
      "First name": "Nome",
      "Your first name": "Il vostro nome",
      "Please enter your first name": "Si prega d'inserire il vostro nome",
      "Last name": "Cognome",
      "Name": "Name",
      "Your last name": "Il vostro cognome",
      "Please enter your last name": "Si prega d'inserire il vostro cognome",
      "Telephone": "Telefono",
      "Your telephone number": "Il vostro numero di telefono",
      "Please enter your telephone number": "Si prega d'inserire il vostro numero di telefono",
      "Fax": "Fax",
      "Your fax number": "Il vostro numero di fax",
      "Please enter your fax number": "Si prega d'inserire il vostro numero di fax",
      "Address": "Indirizzo",
      "Your address": "Il vostro indirizzo",
      "Please enter your address": "Si prega d'inserire il vostro indirizzo",
      "Zip": "Codice postale",
      "Your zip code": "Il vostro codice postale",
      "Please enter your zip code": "Si prega d'inserire il vostro codice postale",
      "City": "Città",
      "Your city": "La vostra città",
      "Please enter your city": "Si prega d'inserire la vostra città",
      "Country": "Paese",
      "Your country": "Il vostro paese",
      "Please enter your country": "Si prega d'inserire il vostro paese",
      "Name of contact person": "Nome di un contatto",
      "Please enter the name of the contact person": "Si prega d'inserire un nome di un contatto",
      "UID optional": "UID opzionale",
      "Your UID number": "Il vostro UID",
      "Your location": "La tua posizione",
      "Find": "Trovare",
      "From": "Di",
      "until": "al",
      "Until": "Al",
      "No events to display yet": "Non ci sono eventi da visualizzare ancora",
      "Event": "Evento",
      "Date": "Data",
      "Time": "Ora",
      "Duration": "Durata",
      "Duration in hours": "Durata in ore",
      "Qty": "Quantità",
      "Logout": "Logout",
      "add Image": "aggiungere immagini",
      "My Activities": "Le mie attività",
      "Admin All Activities": "Administrate all Activities",
      "Edit your Profile": "Modifica il tuo profilo",
      "Publish Activities": "Pubblicare attività",
      "This is the admin/allActivities view": "Questa è la pagina di admin/tutte le attività",
      "Activity": "Attività",
      "Main Category": "Categoria principale",
      "Sub Category": "Sottocategoria",
      "Location": "Posizione",
      "publish": "pubblicare",
      "unpublish": "annullare la pubblicazione",
      "Administration overview": "Panoramica amministrazione",
      "delete": "cancellare",
      "Your activity is published": "La vostra attività è pubblicato",
      "Your activity isnt published yet": "La tua attività non è ancora pubblicato",
      "Company offering this activity": "Compagnia che offre il servizio/attività",
      "back to my activities": "torna alle mie attività",
      "edit": "modifica",
      "Please create bookable events.": "Si prega di creare eventi su prenotazione.",
      "Please upload an image.": "Si prega di caricare un'immagine.",
      "Please enter the name of the activity/activities.": "Si prega di inserire il nome dell'attività",
      "Please enter the name of your company.": "Si prega d'inserire il  nome dell'attività.",
      "save event": "salva evento",
      "New activity": "Nuova attività",
      "Global Activity Info": "Informazioni generali sull attività",
      "Name of Activity or Activities": "Nome dell' attività",
      "Meeting spot of this activity": "Punto d'incontro per questa attività",
      "Enter address of meeting spot": "Si prega di inserire l'indirizzo del punto di riunione",
      "Submit address": "Invia indirizzo",
      "Click in map to reposition location of activity": "Clicca sulla mappa per riposizionare la localizzazione delle attività",
      "Select Main Category": "Seleziona categoria principale",
      "You can choose 2 Subcategories at most": "È possibile scegliere due sottocategorie al massimo",
      "You must choose at least 1 Subcategory": "È necessario scegliere almeno 1 Sottocategoria",
      "Description": "Descrizione",
      "Images": "Immagini",
      "What can be booked": "Cosa può essere prenotato",
      "create a new event": "Creare una nuova attività prenotabile",
      "create a bookable item": "Creare un elemento prenotabile",
      "Price in €": "Prezzo in €",
      "Price": "Prezzo",
      "Delete Item": "Elimina",
      "Schedule Event": "Evento Schedule",
      "Add Event": "Creare appuntamento",
      "Add new Event": "Creare nuovo appuntamento",
      "Quantity": "Quantità",
      "repeating Event": "ripetere",
      "Mon": "Lun",
      "Tue": "Mar",
      "Wed": "Mer",
      "Thu": "Gio",
      "Fri": "Ven",
      "Sat": "Sab",
      "Sun": "Dom",
      "remove": "cancellare",
      "save": "salvare",
      "cancel": "cancellare",
      "Enter company": "Inserire ditta",
      "Access denied": "Accesso negato",
      "add activity": "aggiungere attività",
      "Profile": "Profilo",
      "Edit Profile": "Modifica profilo utente",
      "Bookable item description placeholder": "per esempio 4 ore tour (500ccm)",
      "Bank account": "Conto corrente bancario",
      "Bank": "Banka",
      "Name of your Bank": "Nome del vostro Bank",
      "Please enter the name of your Bank": "Si prega di inserire il nome del vostro Bank",
      "IBAN": "IBAN",
      "Your IBAN": "Il vostro IBAN",
      "Please enter your IBAN": "Si prega di inserire il vostro IBAN",
      "BIC": "BIC",
      "Your BIC": "Il vostro BIC",
      "Please enter your BIC": "Si prega di inserire il vostro BIC",
      "Account owner": "Proprietario del conto",
      "Name of account owner": "Nome del proprietario dell'account",
      "Please enter the name of the account owner": "Si prega di inserire il nome del titolare del conto",
      "yes, delete": "si, cancellare",
      "no": "no",
      "Delete bookable item with all events?": "Elimina voce prenotabile con tutti gli eventi?",
      "Please select a location.": "Si prega di selezionare una posizione.",
      "Your unsaved data will be lost if you leave this page": "I vostri dati non ancora salvati andranno persi se si lascia questa pagina",
      "activities found": "activities found",
      "All dates from activity": "All dates from activity",
      "Personal data": "Dati personali",
      "Company data": "Dati aziendali",
      "Your changes have been saved": "Le modifiche sono state salvate",
      "Your changes could not be saved": "Le modifiche non potevano essere salvate",
      "Please fill out the form correctly": "Si prega di compilare correttamente il modulo",
      "endBeforeStart": "Fine evento è prima dell'inizio dell'evento",
      "Map view": "Map view",
      "No Activities found.": "No Activities found.",
      "Zoom out the map or reset your filter settings.": "Zoom out the map or reset your filter settings.",
      "The repeating events will have the same starting time and duration as above" : "The repeating events will have the same starting time and duration as above",
      "Please select at least one day for repeating event." : "Please select at least one day for repeating event.",
      "create event until": "Create events until this date",
      "Please select a date until which the repeating events should be created": "Please select a date until which the repeating events should be created"
    });
//    double click in map to reposition location of activity46	doppio click sulla mappa per riposizionare la localizzazione della attività		double click  pour relocaliser l'activité su la carte	двойной щелчок на карте штоб изменить позицию деятельности					in inglese secondo me è sbagliata
//    double click on the map to locate the activity

//    $translateProvider.preferredLanguage('en');

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
  .run(function ($rootScope, $log, debug, currentUser, $location, $route, APP_CONFIG, models, $translate) {
    debug("application run called");
    $rootScope.debug = debug;
    $rootScope.models = models;
    var checkRouteForAuthorization;

    var Model = require('modelizer');
//    var connector = Model.AngularConnector(APP_CONFIG.modelizerurl);
    var connector = Model.ClientConnector(APP_CONFIG.modelizerhost, APP_CONFIG.modelizerport);

    _.forEach(models, function (model) {  // setup connection for each model
      model.connection(connector);
    });

    moment.lang($translate.use());  // setup moment language

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

    // service to determine available language in case of ng-model binding in view
    $rootScope.getAvailableTranslationLanguageKey = function (multilanguageobject) {
      var availablelangkey = "";
      if (multilanguageobject[$translate.use()]) {
        availablelangkey = $translate.use();
      } else {
        if (multilanguageobject.en) {
          availablelangkey = "en";
        } else if (multilanguageobject.de) {
          availablelangkey = "de";
        } else if (multilanguageobject.it) {
          availablelangkey = "it";
        }
      }
      return availablelangkey;
    };

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