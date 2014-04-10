'use strict';

angular.module('anorakApp')
  .service('Usersessionstates', function Usersessionstates(localStorageService, $routeParams, $rootScope) {

    var initialStates = {
      searchlocation: {
        coords: {
          latitude: 45.12199086176226,
          longitude: 8.01177978515625
        }
      }
      // category selection
      // map ausschnitt
      // ort suche
      // datum suche
    };

    var Session = {
      updateSession: function () {
        // add session to LocalStorage
        localStorageService.add('Usersessionstates', Session.states);  // TODO include userid or something
      },
      loadSession: function () {
        if (localStorageService.get('Usersessionstates')) {
          Session.states = localStorageService.get('Usersessionstates');
        } else {
          //initialize values
          Session.states = angular.copy(initialStates);
        }
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
