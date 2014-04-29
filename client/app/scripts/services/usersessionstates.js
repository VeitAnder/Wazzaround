'use strict';

angular.module('anorakApp')
  .service('Usersessionstates', function Usersessionstates(localStorageService) {

    var Session = {
      updateSession: function () {

        // add session to LocalStorage
        localStorageService.add('Usersessionstates', Session.states);
      },
      loadSession: function () {

        if (localStorageService.get('Usersessionstates')) {
          Session.states = localStorageService.get('Usersessionstates');
        }
      },
      states: {
      }
    };

    return Session;
  });

