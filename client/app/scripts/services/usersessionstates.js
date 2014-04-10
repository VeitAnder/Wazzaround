'use strict';

angular.module('anorakApp')
  .service('Usersessionstates', function Usersessionstates(localStorageService, currentUser) {

//    var initialStates = {
//      searchlocation: {
//        coords: {
//          latitude: 45.12199086176226,
//          longitude: 8.01177978515625
//        }
//      },
//      zoom: 9
      // category selection
      // map ausschnitt
      // ort suche
      // datum suche
//    };


    var identifySession = currentUser.user ? currentUser.user._id : "loggedout";
    var Session = {
      updateSession: function () {
        // add session to LocalStorage
        localStorageService.add('Usersessionstates_' +  identifySession, Session.states);
      },
      loadSession: function () {
        if (localStorageService.get('Usersessionstates_' + identifySession)) {
          Session.states = localStorageService.get('Usersessionstates_' + identifySession);
        }
//        else {
          //initialize values   TODO architectural discussion: values here or in map? I think better in map
//          Session.states = angular.copy(initialStates);
//        }
      }
    };

    // initial loading of session data
    Session.loadSession();

    // when project changes, Session data for that project has to be loaded
//    $rootScope.$on('$routeChangeSuccess', function (next, current) {
//      Session.loadSession();
//    });

    return Session;
  });
