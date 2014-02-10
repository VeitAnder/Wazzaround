// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication.current-user', [])
  .factory('currentUser', function () {
    "use strict";

    var userObject = null;
    var currentUser = {
      load : function() {
        return UserModel.use.all()
          .then(function(users) {
            if (users.length > 0) {
              userObject = users[0];
              currentUser.authenticated = true;
              return currentUser;
            }
          })
          .fail(function(err) {
            // user has not been logged in
            return currentUser;
          });
      },

      user : function() {
        return userObject;
      },

      login : function(username, password) {
        return UserModel.login({username:username, password:password})
          .then(function(res){
            return currentUser.load();
          })
      },

      register : function(username, password) {
        return UserModel.register({
            username : username,
            password : password
          })
          .then(function(res) {
            return currentUser.login(username, password);
          });
      },

      logout : function() {
        return UserModel.logout()
          .then(function(res) {
            userObject = null;
            currentUser.authenticated = false;
          })
      },

      authenticated: false
    };

    return currentUser;
  });