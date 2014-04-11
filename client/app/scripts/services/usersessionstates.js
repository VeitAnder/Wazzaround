'use strict';

angular.module('anorakApp')
  .service('Usersessionstates', function Usersessionstates(localStorageService, currentUser) {

    var Session = {
      updateSession: function () {

        return currentUser.load()
          .then(function (currentUser) {

            var identifySession = currentUser.user !== null ? currentUser.user._id : "loggedout";

            // add session to LocalStorage
            localStorageService.add('Usersessionstates_' + identifySession, Session.states);

            return Q.resolve();
          });

      },
      loadSession: function () {

        return currentUser.load()
          .then(function (currentUser) {

            var identifySession = currentUser.user !== null ? currentUser.user._id : "loggedout";

            if (localStorageService.get('Usersessionstates_' + identifySession)) {
              Session.states = localStorageService.get('Usersessionstates_' + identifySession);
            }

            return Q.resolve(Session);
          });
      }
    };

    return Session;
  });

