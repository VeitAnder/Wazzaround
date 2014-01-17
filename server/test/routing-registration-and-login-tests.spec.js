/*jshint node:true, strict: false */
/*globals it, describe, expect, beforeEach */
/**
 * Created with JetBrains WebStorm.
 * User: jonathan
 * Date: 25.06.13
 * Time: 21:18
 * To change this template use File | Settings | File Templates.
 */

// Test Integration:
// https://github.com/jasmine-contrib/grunt-jasmine-node

// Examples:
// http://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
// https://github.com/mhevery/jasmine-node

// Tools
// https://github.com/visionmedia/supertest

// TODO: Alternative zu supertest evaluieren https://github.com/flatiron/nock

var request = require("supertest");
var Q = require('q');

// Deleting node module cache, so everything you require after here will be reloaded
Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key];
});
var helper = require('./test-helper.js');
helper.mode = helper.noLoginMode;
var app = require('../server.js');

var Users = require('../models/model_users.js');
var usermanager = require('../lib/usermanager.js');

describe('Routing', function () {
  // app.get('/' + config.api.apiversion + 'users/:id', users.findById);
  /* THIS WILL CATCH ANY LOGGED OUT REQUEST, see server.js
   if (process.env.NODE_ENV !== "testing" || testHelper.mode === testHelper.noLoginMode) {
   app.all('/' + config.api.apiversion + '*', function (req, res, next) {
   if (req.query.accesstoken) {
   //use token based authentication
   // restrict to GET method and path /api/vx/plans/

   if (req.method === 'GET' && req.url.indexOf('/' + config.api.apiversion + 'plans/') > -1) {
   security.accesstokenAuthenticationRequired(req, res, next);
   } else {
   req.send(403, "Only GET requests allowed via accesstoken and only plans could be queried via accesstoken");
   }
   } else {
   // We require for all routes to be authenticated to receive anything from the api
   security.passwordAuthenticationRequired(req, res, next);         // 403 with custom login
   }
   });
   }
   * */
  it("TEST 0: should not be possible to request a route after security functionality when not logged in", function (done) {
    console.log("TEST 0");

    request(app)
      .get("/api/v1/users/1234567890/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .set('Cookie', cookie)
      .expect(401)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('TEST 1: should work', function (/*done*/) {
    console.log("TEST 1");
    expect(true).not.toBe(false);
    //done();
  });

  it('TEST 2: should have an / to open', function (done) {
    console.log("TEST 2");
    request(app)
      .get('/')
      .expect(200, done);
  });

  describe('User registration', function () {

    it('TEST 3: delete user test1@test.de from DB', function (done) {
      console.log("TEST 3");
      Users.removeQ({"email": "test1@test.de"})
        .then(function () {
          done();
        })
        .done();
    });

    it('TEST 4: should be possible to test whether an Email-address is available', function (done) {
      console.log("TEST 4");

      request(app)
        .get("/api/v1/userregistrations/isemailavailableforloginaccount/?email=test1%40test.de")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          // parse RESPONSE-Message and check isavailable attribute
          if (JSON.parse(res.text).isavailable) {
            return done();
          } else {
            return done(new Error("Email-address already in use"));
          }
        });
    });

    it('TEST 5: should be possible to register a user', function (done) {
      console.log("TEST 5");

      var body = {"profile": {"firstName": "test1", "lastName": "test1"}, "password": "testold1", "email": "test1@test.de"};
      request(app)
        .post('/api/v1/userregistrations/')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            err.message += " Res: " + res.text;
            return done(err);
          }
          return done();
        });

    });

    it('TEST 6: should be possible to register a user again as long as the account has not been confirmed', function (done) {
      console.log("TEST 6");

      var body = {"profile": {"firstName": "test1", "lastName": "test1"}, "password": "test1", "email": "test1@test.de"};
      request(app)
        .post('/api/v1/userregistrations/')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            err.message += " Res: " + res.text;
            return done(err);
          }
          return done();
        });

    });

    it("TEST 7: should be possible to confirm a user registration", function (done) {
      console.log("TEST 7");

      Users.findOneQ({"email": "test1@test.de"})
        .then(function (user) {
          var deferred = Q.defer();  // So gehts mit Q

          request(app)
            .get('/api/v1/userregistrations/confirmuserregistration/' + user.accountconfirmationtoken + '/')
            .expect(302)
            .end(function (err, res) {
              if (err) {  // if the GET-Call itself faild
                err.message += " Res: " + res.text;
                deferred.reject(err);  // Anstatt:  return done(err);
              } else {
                deferred.resolve(res);
              }
              // Entfällt: return done();
            });

          return deferred.promise;
        })
        .then(function (res) {
          done();
        })
        .fail(function (err) {
          done(err);
        })
        .done();

    });

    it("TEST 8: the user should be activated", function (done) {
      console.log("TEST 8");

      Users.findOneQ({"email": "test1@test.de"})
        .then(function (user) {
          expect(user.accountconfirmed).toBe(true);
          done();
        })
        .fail(function (err) {
          done(new Error(err));
        })
        .done();

    });

    it("TEST 9: email-address test1@test.de should not be available for registration", function (done) {
      console.log("TEST 9");
      request(app)
        .get("/api/v1/userregistrations/isemailavailableforloginaccount/?email=test1%40test.de")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          // parse RESPONSE-Message and check isavailable attribute
          if (JSON.parse(res.text).isavailable) {
            return done(new Error("Email-address is available"));
          } else {
            return done();
          }
        });
    });

    it('TEST 10: should not be possible to register as user test1@test.de again after account has already been confirmed', function (done) {
      console.log("TEST 10");

      var body = {"profile": {"firstName": "test1", "lastName": "test1"}, "password": "test1", "email": "test1@test.de"};
      request(app)
        .post('/api/v1/userregistrations/')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(403)
        .end(function (err, res) {
          if (err) {
            err.message += " Res: " + res.text;
            return done(err);
          }
          return done();
        });
    });

    it("TEST 11: testing if test2@test.de can be created as internal user account", function (done) {
      console.log("TEST 11");

      Users.removeQ({"email": "test2@test.de"})
        .then(function () {
          usermanager.createInternalAccount("test2@test.de").then(function (user) {
            expect(user.accountconfirmed).toBe(false);
            expect(user.enabled).toBe(true);
            expect(user.password).toBeUndefined();
            done();
          });
        })
        .fail(function (err) {
          done(new Error(err));
        })
        .done();

    });

    it("TEST 12: the testing email-address test2@test.de should be available for registration", function (done) {
      console.log("TEST 12");

      request(app)
        .get("/api/v1/userregistrations/isemailavailableforloginaccount/?email=test2%40test.de")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          // parse RESPONSE-Message and check isavailable attribute
          if (JSON.parse(res.text).isavailable) {
            return done();
          } else {
            return done(new Error("Email-address is available"));
          }
        });
    });

    it('TEST 13: should be possible to register as user test2@test.de with already existing internal account test2@test.de', function (done) {
      console.log("TEST 13");

      var body = {"profile": {"firstName": "test2", "lastName": "test2"}, "password": "test2", "email": "test2@test.de"};
      request(app)
        .post('/api/v1/userregistrations/')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            err.message += " Res: " + res.text;
            return done(err);
          } else {
            return done();
          }
        });

    });

    it("TEST 14: the user test2@test.de should not be activated and user.password should be defined", function (done) {
      console.log("TEST 14");

      Users.findOneQ({"email": "test2@test.de"})
        .then(function (user) {
          expect(user.accountconfirmed).toBe(false);
          expect(user.password).toBeDefined();
          done();
        })
        .fail(function (err) {
          done(new Error(err));
        })
        .done();
    });

    // user enabled, accountconfirmed, address not available
    it("TEST 15: the testing email-address test3@test.de shouldn't be available for registration", function (done) {
      console.log("TEST 15");

      Users.remove({ email: "test3@test.de"}, function (err, res) {
        var user = new Users({
          email: "test3@test.de",
          password: "bla",
          accountconfirmed: true,
          enabled: true
        });

        user.saveQ().then(function (user) {

          request(app)
            .get("/api/v1/userregistrations/isemailavailableforloginaccount/?email=test3%40test.de")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {

              if (err) {
                return done(err);
              }

              // parse RESPONSE-Message and check isavailable attribute
              if (JSON.parse(res.text).isavailable) {
                return done(new Error("Email-address is available"));
              } else {
                return done();
              }
            });

        }, function (err) {
          done(err);
        });

      });
    });

    // user disabled, accountconfirmed, address not available
    it("TEST 16: the testing email-address test4@test.de shouldn't be available for registration", function (done) {
      console.log("TEST 16");

      Users.remove({ email: "test4@test.de"}, function (err, res) {
        var user = new Users({
          email: "test4@test.de",
          password: "bla",
          accountconfirmed: true,
          enabled: false
        });

        user.saveQ().then(function (user) {

          request(app)
            .get("/api/v1/userregistrations/isemailavailableforloginaccount/?email=test4%40test.de")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }

              // parse RESPONSE-Message and check isavailable attribute
              if (JSON.parse(res.text).isavailable) {
                return done(new Error("Email-address is available"));
              } else {
                return done();
              }
            });

        }, function (err) {
          done(err);
        });

      });
    });

    it("TEST 17: should be possible to reset the password", function (done) {
      console.log("TEST 17");

      request(app)
        .post("/api/v1/userregistrations/forgotpassword/")
        .send({ email: "test1@test.de" })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err || res.body === undefined || res.body.email !== "test1@test.de") {
            return done(err);
          }

          Users.updateQ({ email: "test1@test.de" },
            { $set: { password: helper.encrypt("test1") }

            }).then(function (result) {
              if (result === undefined || result === 0) {
                done(new Error("Could not update password of user test1@test.de"));
              }
              done();

            }, function (err) {
              done(err);
            });
        });
    });

  });

  var cookie = "";  // Storage for cookie after lofing

  describe('Login', function () {
    it("TEST 18: should be possible to login", function (done) {
      console.log("TEST 18");

      request(app)
        .post("/api/v1/login/")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'text/html')
        .send('username=test1%40test.de&password=test1')
        .expect(302)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          cookie = res.header['set-cookie'][0].split(';')[0];
          return done();
        });
    });

    it("TEST 19: should be possible to get the current user", function (done) {
      console.log("TEST 19");

      request(app)
        .get("/api/v1/current-user/")
        .set('Accept', 'application/json')
        .set('Cookie', cookie)
        .end(function (err, res) {
          if (err) {
            err.message += " Res: " + res.text;
            return done(err);
          }

          if (JSON.parse(res.text).user.email === "test1@test.de") {
            return done();
          }
          else {
            return done(new Error("Recived wrong user"));
          }
        });

    });
  });

});
