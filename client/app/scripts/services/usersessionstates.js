'use strict';

angular.module('anorakApp')
  .service('Usersessionstates', function Usersessionstates($localStorage) {
    var Session = {
      updateSession: function () {
        $storage.Usersessionstates = Session.states;
      },
      loadSession: function () {
        Session.states = $storage.Usersessionstates;
      },
      states: {
      }
    };

    var $storage = $localStorage.$default({
      Usersessionstates: Session.states
    });

    return Session;
  });

