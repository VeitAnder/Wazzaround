/*
 * @author Karoline Maronitsch
 */

// Test Integration:
// https://github.com/jasmine-contrib/grunt-jasmine-node

// Examples:
// http://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
// https://github.com/mhevery/jasmine-node

// Tools
// https://github.com/visionmedia/supertest

var request = require("supertest");
var Q = require('q');
var _ = require('lodash/dist/lodash.underscore');

var Projects = require('../models/model_projects.js');
var Users = require('../models/model_users.js');

// Deleting node module cache, so everything you require after here will be reloaded
Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key];
});
var helper = require('./test-helper.js');
helper.mode = helper.loginMode;


var testapp = require('../server.js');

jasmine.getEnv().defaultTimeoutInterval = 150000;

describe('Testing with simulated login', function () {

  //////////////////// ROUTING ERROR TESTING //////////////////////////
  beforeEach(function (done) {
    helper.prepApp().then(function () {
      done();
    }, function (err) {
      console.log("Error in test preparation", err);
      done(err);
    });
  });

  // TODO attention, this is not unique, error objects have a message, but also e.g. participant invitation has a message!
  // it's not always an error object!
  function isAnErrorObj(obj) {
    return _.contains(Object.keys(obj), "message");
  }

  // app.get('/' + config.api.apiversion + 'users/:id', users.findById)
  it("TEST 1: should not be possible requesting a user with id that is not one's own", function (done) {
    console.log("TEST 1");
    request(testapp)
      .get("/api/v1/users/1234567890")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  // app.get('/' + config.api.apiversion + 'users/:id', users.findById);
  it("TEST 2: should be possible requesting your own userdata", function (done) {
    console.log("TEST 2");
    request(testapp)
      .get("/api/v1/users/" + helper.testUser._id)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        var resObj = JSON.parse(res.text);
        if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false) {
          return done();

        } else {
          return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
        }
      });
  });

  // app.post('/' + config.api.apiversion + 'users/:id/password/', users.setpassword);
  it("TEST 3: should not be possible to set password with userid that is not one's own", function (done) {
    console.log("TEST 3");
    request(testapp)
      .post("/api/v1/users/1234567890-2/password/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send({ password: helper.testUser.password})
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  // app.post('/' + config.api.apiversion + 'users/:id/password/', users.setpassword);
  it("TEST 4: should be possible to set your own password", function (done) {
    console.log("TEST 4");
    request(testapp)
      .post("/api/v1/users/" + helper.testUser._id + "/password/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send({ password: helper.encrypt("bla")})  // this is the testUser's password
      .expect(200)
      .end(function (err, res) {
        //var resObj = JSON.parse(res.text.substring(5));
        var resObj = JSON.parse(res.text);

        if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
          return done();

        } else {
          return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
        }
      });
  });

  // app.put('/' + config.api.apiversion + 'users/:id/profile/', users.updateProfile);
  it("TEST 5: should not be possible to update profile with userid that is not one's own", function (done) {
    console.log("TEST 5");
    request(testapp)
      .put("/api/v1/users/1234567890-3/profile/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send({"profile": {"firstName": "test1", "lastName": "test1", "company": "", "address": ""}, "password": "test1", "email": "test1@test.de"})
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  // app.put('/' + config.api.apiversion + 'users/:id/profile/', users.updateProfile);
  it("TEST 6: should be possible to update your own profile", function (done) {
    console.log("TEST 6");
    request(testapp)
      .put("/api/v1/users/" + helper.testUser._id + "/profile/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send({"profile": {"firstName": "test", "lastName": "test", "company": "", "address": ""}, "password": helper.testUser.password, "email": helper.testUser.email})
      .expect(200)
      .end(function (err, res) {
        //var resObj = JSON.parse(res.text.substring(5));
        var resObj = JSON.parse(res.text);
        if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false) {
          return done();

        } else {
          return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
        }
      });
  });

  // app.post('/' + config.api.apiversion + 'users/mail/support/', mail.sendSupportMail);
  it("TEST 7: should not be possible to send support mail with an email address that is not the one you used for reacture registration", function (done) {
    console.log("TEST 7");

    var body = {
      info: {
        user: {
          email: "reacturetesterin@anorak.io"
        }
      },
      text: "Ich schicke jetzt ein testmail aus den automatisierten Tests",
      topic: "Fehler melden"
    };

    request(testapp)
      .post("/api/v1/users/mail/support/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send(body, "Mailingtest", "Ich schicke jetzt ein testmail")
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  // app.post('/' + config.api.apiversion + 'users/mail/support/', mail.sendSupportMail);
  it("TEST 8: should be possible to send support mail as reacture user", function (done) {
    console.log("TEST 8");

    var body = {
      info: {
        user: {
          email: helper.testUser.email
        }
      },
      text: "Ich schicke jetzt ein testmail aus den automatisierten Tests",
      topic: "Fehler melden"
    };

    request(testapp)
      .post("/api/v1/users/mail/support/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send(body, "Mailingtest", "Ich schicke jetzt ein testmail aus den automatisierten Tests.")
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resarray = JSON.parse(res.text);
        if (resarray[0].mailstatus.Message === "OK" && resarray[1].mailstatus.Message === "OK") {
          return done();
        }
        else {
          return done(new Error("Message sending did not work"));
        }
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/', projects.findAll);
  it("TEST 9: should be possible to get all projects as empty list when there are none", function (done) {
    console.log("TEST 9");
    request(testapp)
      .get("/api/v1/projects/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        //var resarray = JSON.parse(res.text.substring(5));
        var resarray = JSON.parse(res.text);
        if (resarray.length === 0 && err === null) {
          return done();

        } else {
          return done(err ? err : "The number of projects should be 0 but is " + resarray.length);
        }
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/', projects.findAll);
  it("TEST 10: should yield empty list when trying to get all projects when you are participant with permission silent", function (done) {
    console.log("TEST 10");
    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resarray = JSON.parse(res.text.substring(5));
            var resarray = JSON.parse(res.text);
            if (resarray.length === 0 && err === null) {
              return done();

            } else {
              return done(err ? err : "The number of projects should be 0 but is " + resarray.length);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/', projects.findAll);
  it("TEST 11: should be possible to get all projects where you are participant with permission owner", function (done) {
    console.log("TEST 11");
    helper.createTestProjectWithOwner()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resarray = JSON.parse(res.text.substring(5));
            var resarray = JSON.parse(res.text);
            if (resarray.length === 1 && err === null) {
              return done();

            } else {
              return done(err ? err : "The number of projects should be 1 but is " + resarray.length);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  //app.get('/' + config.api.apiversion + 'projects/new/', projects.newprojectmodel); // get new project model - not stored yet
  it("TEST 12: should be possible to get a new project model if you are a logged in reacture user", function (done) {
    console.log("TEST 12");
    request(testapp)
      .get("/api/v1/projects/new/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function (err, res) {
        //var resObj = JSON.parse(res.text.substring(5));
        var resObj = JSON.parse(res.text);
        if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false) {
          return done();

        } else {
          return done(err ? err : "There should be a project object returned, but instead returned is " + resObj);
        }
      });
  });

  //  app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
  it("TEST 13: should not be possible to find project with wrong id", function (done) {
    console.log("TEST 13");
    request(testapp)
      .get("/api/v1/projects/1234567890/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  //  app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
  it("TEST 14: should be possible to find project with right id when you are the owner", function (done) {
    console.log("TEST 14");

    helper.createTestProjectWithOwner().then(function (project) {
      request(testapp)
        .get("/api/v1/projects/" + project._id)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'text/html')
        .expect(200)
        .end(function (err, res) {
          //var resObj = JSON.parse(res.text.substring(5));
          var resObj = JSON.parse(res.text);
          if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
            return done();

          } else {
            return done(err ? err : "There should be a project object returned, but instead returned is " + resObj);
          }
        });
    }, function (err) {
      done(err);
    });
  });

  //  app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
  it("TEST 15: should not be possible to find project with id when you are no participant", function (done) {
    console.log("TEST 15");

    helper.createTestProjectWithoutParticipants().then(function (project) {

      request(testapp)
        .get("/api/v1/projects/" + project._id + "/")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'text/html')
        .expect(403)
        .end(function (err, res) {

          if (err) {
            return done(err);
          }
          done();
        });
    }, function (err) {
      done(err);
    });
  });

  //  app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
  it("TEST 16: should not be possible to find project with id when you are a silent participant", function (done) {
    console.log("TEST 16");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(403)
          .end(function (err, res) {

            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/plans/', plans.findAll);
  it("TEST 17: should be possible to find all plans for project when you are the owner, no plans inside yields empty response", function (done) {
    console.log("TEST 17");

    helper.createTestProjectWithOwner()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resarray = JSON.parse(res.text.substring(5));
            var resarray = JSON.parse(res.text);
            if (resarray.length === 0 && err === null) {
              return done();

            } else {
              return done(err ? err : "The number of plans should be 0 but is " + resarray.length);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/plans/', plans.findAll);
  it("TEST 18: should be possible to find all plans for project when you are the owner", function (done) {
    console.log("TEST 18");
    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resarray = JSON.parse(res.text.substring(5));
            var resarray = JSON.parse(res.text);
            if (resarray.length === 1 && err === null) {
              return done();

            } else {
              return done(err ? err : "The number of plans should be 1 but is " + resarray.length);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/plans/', plans.findAll);
  it("TEST 19: should not possible to find all plans for project when you are a silent participant", function (done) {
    console.log("TEST 19");
    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/roles/', projects.updateRoles);
  it("TEST 20: should not be possible to update roles for project when you are a silent participant", function (done) {
    console.log("TEST 20");
    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        var roles = [
          {role: 'Hausmasta'},
          {role: 'Architekt'}
        ];
        request(testapp)
          .put("/api/v1/projects/" + project._id + "/roles/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({roles: roles})
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/roles/', projects.updateRoles);
  it("TEST 21: should be possible to update roles for project when you are the owner", function (done) {
    console.log("TEST 21");
    helper.createTestProjectWithOwner()
      .then(function (project) {

        var roles = [
          {role: 'Hausmasta'},
          {role: 'Architekt'}
        ];
        request(testapp)
          .put("/api/v1/projects/" + project._id + "/roles/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({roles: roles})
          .expect(200)
          .end(function (err, res) {
            //var resObj = JSON.parse(res.text.substring(5));
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
              return done();

            } else {
              return done(err ? err : "There should be a project object returned, but instead returned is " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'projects', projects.add);
  it("TEST 22: should be possible to add a new project if you are a reacture user", function (done) {
    console.log("TEST 22");
    var project = helper.createTestProjectObject();
    project.participants = [
      { // TODO this is really ugly, because role in project route depends on participant at array index 0.
        // TODO better send roles extra
        roles: ["Architekt"]
      }
    ];

    request(testapp)
      .post("/api/v1/projects")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send(project)
      .expect(200)
      .end(function (err, res) {
        //var resObj = JSON.parse(res.text.substring(5));
        var resObj = JSON.parse(res.text);
        if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
          return done();

        } else {
          return done(err ? err : "There should be a project object returned, but instead returned is " + resObj);
        }
      });
  });

  //  app.post('/' + config.api.apiversion + 'projects', projects.add);
  // server/routes/projects.js / exports.add
  it("TEST 23: should not be possible to add invalid project (without title)", function (done) {
    console.log("TEST 23");
    var projectid;
    var newproject = {
      title: "",
      role: "Architekt",
      participants: [
        {
          user: helper.testUser._id,
          permission: "owner",
          roles: [
            { role: "Architekt" }
          ]
        }
      ]
    };

    request(testapp)
      .post("/api/v1/projects/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send(newproject)
      .expect(400)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        Projects.remove({ id: projectid });
        return done();
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/title/', projects.updateTitle);
  it("TEST 24: should be possible to update title of a new project if you are the owner", function (done) {
    console.log("TEST 24"); //create a heap dump after the memory leak

    helper.createTestProjectWithOwner()
      .then(function (project) {
        project.title = "NEWTITLE";

        var newproject = helper.createTestProjectObject();
        newproject.title = project.title;
        newproject._id = project._id;
        newproject.phasetags = project.phasetags;
        newproject.roles = project.roles;
        newproject.__v = project.__v;
        newproject.modified = project.modified;
        newproject.created = project.created;
        newproject.participants = JSON.parse(JSON.stringify(project.participants));

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/title/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(newproject)
          .expect(200)
          .end(function (err, res) {
            //var resObj = JSON.parse(res.text.substring(5));
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
              return done();

            } else {
              return done(err ? err : "There should be a project object returned, but instead returned is " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/title/', projects.updateTitle);
  it("TEST 25: should not be possible to update title of a new project if you are a silent participant", function (done) {
    console.log("TEST 25");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        project.title = "NEWTITLE";

        var newproject = helper.createTestProjectObject();
        newproject.title = project.title;
        newproject._id = project._id;
        newproject.phasetags = project.phasetags;
        newproject.roles = project.roles;
        newproject.__v = project.__v;
        newproject.modified = project.modified;
        newproject.created = project.created;
        newproject.participants = JSON.parse(JSON.stringify(project.participants));

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/title/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(newproject)
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err ? err : "There was no project returned or title does not match");
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/participants/', projects.findAllParticipants);
  it("TEST 26: should be possible to find all participants of the project if you are the owner", function (done) {
    console.log("TEST 26");
    helper.createTestProjectWithOwner()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/participants/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resarray = JSON.parse(res.text.substring(5));
            var resarray = JSON.parse(res.text);
            if (resarray.length === 1 && err === null) {
              return done();

            } else {
              return done(err ? err : "There should be 1 participant, but instead there are " + resarray.length);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/participants/', projects.findAllParticipants);
  it("TEST 27: should not be possible to find all participants of the project if you are a silent participant", function (done) {
    console.log("TEST 27");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/participants/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(403)
          .end(function (err, res) {

            if (err) {
              return done(err);
            }
            done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/participants/:participantid/', projects.findParticipantById);
  it("TEST 28: should not be possible to find a participant by id if you are a silent participant", function (done) {
    console.log("TEST 28");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'projects/:id/participants/:participantid/', projects.findParticipantById);
  it("TEST 29: should be possible to find a participant by id if you are the owner of the project", function (done) {
    console.log("TEST 29");

    helper.createTestProjectWithOwner()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            //var resObj = JSON.parse(res.text.substring(5));
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && isAnErrorObj(resObj) === false && err === null) {
              return done();

            } else {
              return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  it("TEST 30: should not be possible to add a participant if you are a silent participant", function (done) {
    console.log("TEST 30");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {
        helper.createOrFindSecondUser()
          .then(function (secondUser) {
            request(testapp)
              .post("/api/v1/projects/" + project._id + "/participants/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send({ email: "testAddParticipant1@anorak.io" })
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                done();
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  it("TEST 31: should be possible to add a participant if you are the owner of the project", function (done) {
    console.log("TEST 31");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        helper.createOrFindSecondUser()
          .then(function (secondUser) {
            request(testapp)
              .post("/api/v1/projects/" + project._id + "/participants/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send({ email: "testAddParticipant2@anorak.io" })
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && resObj.message === "testaddparticipant2@anorak.io invited.") {
                  return done();

                } else {
                  return done(err ? err : "There should be a message returned " + resObj);
                }
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // TODO this is unneccessary, check if forbidden in client
  // app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  it("TEST 32: should be possible to add yourself as a participant if you are the owner of the project but it is, permission stays 'owner'", function (done) {
    console.log("TEST 32");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        request(testapp)
          .post("/api/v1/projects/" + project._id + "/participants/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({ email: helper.testUser.email })
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && resObj.message === "hansi@anorak.io invited.") {
              return done();

            } else {
              return done(err ? err : "There should be a message returned " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  it("TEST 33: should be possible to invite a participant which is already a silent participant", function (done) {
    console.log("TEST 33");

    var createdProject;

    helper.createTestProjectWithOwner()
      .then(function (project) {
        createdProject = project;

        helper.createSilentParticipant(createdProject)
          .then(function () {

            helper.getProject(createdProject._id)
              .then(function (project) {
                createdProject = project;

                var newparticipant = JSON.parse(JSON.stringify(helper.silentUser));
                newparticipant.company = createdProject.participants[1].company;
                newparticipant.roles = createdProject.participants[1].roles;

                request(testapp)
                  .post("/api/v1/projects/" + createdProject._id + "/participants/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send(newparticipant)
                  .expect(200)
                  .end(function (err, res) {

                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && resObj.message === helper.silentUser.email + " invited.") {
                      return done();

                    } else {
                      return done(err ? err : "There should be a message returned " + resObj);
                    }

                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  it("TEST 34: should not be possible to add another participant if you are a participant", function (done) {
    console.log("TEST 34");

    helper.createTestProjectWithNormalParticipant()
      .then(function (project) {

        request(testapp)
          .post("/api/v1/projects/" + project._id + "/participants/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({ email: "invitenewparticipant@anorak.io" })
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  it("TEST 35: should not be possible to change enabled state of participant if you are a silent participant", function (done) {
    console.log("TEST 35");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function () {

            helper.getProject(projectId)
              .then(function (project) {

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/changeenabledstate/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ enabled: false })
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      return done(err);
                    }
                    done();
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  it("TEST 36: should be possible to change enabled state of participant if you are a the owner", function (done) {
    console.log("TEST 36");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function () {

            helper.getProject(projectId)
              .then(function (project) {

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/changeenabledstate/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ enabled: false })
                  .expect(200)
                  .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.user !== undefined) {
                      return done();

                    } else {
                      return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
                    }
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  it("TEST 37: should not possible to change enabled state of yourself even if you are the owner", function (done) {
    console.log("TEST 37");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        var projectId = project._id;

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/changeenabledstate/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({ enabled: false })
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  it("TEST 38: should not possible to change enabled state of another participant if you are a participant", function (done) {
    console.log("TEST 38");

    var projectId;
    helper.createTestProjectWithNormalParticipant()
      .then(function (project) {
        projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function (project) {

            helper.getProject(projectId)
              .then(function (project) {

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/changeenabledstate/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ enabled: false })
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      return done(err);
                    }
                    done();
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  it("TEST 38a: admin can not disable owner", function (done) {
    console.log("TEST 38a");

    var projectId;
    helper.createTestProjectWithAdmin()
      .then(function (project) {
        projectId = project._id;

        helper.createOwner(project)
          .then(function () {

            helper.getProject(projectId)
              .then(function (project) {

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/changeenabledstate/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ enabled: false })
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      return done(err);
                    }
                    done();
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/company/', projects.updateCompanyOfParticipant);
  it("TEST 39: should not be possible to update company of participant if you are a silent participant", function (done) {
    console.log("TEST 39");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function () {

            helper.getProject(projectId)
              .then(function (project) {

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/company/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ company: "NewCompany" })
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      return done(err);
                    }
                    done();
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/company/', projects.updateCompanyOfParticipant);
  it("TEST 40: should be possible to update company of another participant if you are a the owner", function (done) {
    console.log("TEST 40");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function () {

            helper.getProject(projectId)
              .then(function (project) {
                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/company/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ company: "KAROINC" })
                  .expect(200)
                  .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.user !== undefined) {
                      return done();

                    } else {
                      return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
                    }
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/company/', projects.updateCompanyOfParticipant);
  it("TEST 41: should be possible to update your own company if you are a the owner", function (done) {
    console.log("TEST 41");

    helper.createTestProjectWithOwner()
      .then(function (project) {

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/company/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send({ company: "Superkaro Inc" })
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.user !== undefined) {
              return done();

            } else {
              return done(err ? err : "There should be a user object returned, but instead returned is " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);
  it("TEST 42: should be possible to update your role if you are a the owner", function (done) {
    console.log("TEST 42");

    helper.createTestProjectWithOwner()
      .then(function (project) {

        var newproject = JSON.parse(JSON.stringify(project));
        newproject.participants[0].roles = [
          {"role": "Architekt"}
        ];

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/roles/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(newproject)
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.participants[0].roles[0].role === "Architekt") {
              return done();

            } else {
              return done(err ? err : "There should be updated roles for participants, but instead we have " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);
  it("TEST 43: should not be possible to update your role if you are a silent participant", function (done) {
    console.log("TEST 43");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {

        var newproject = JSON.parse(JSON.stringify(project));
        newproject.participants[0].roles = [
          {"role": "Architekt"}
        ];

        request(testapp)
          .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/roles/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(newproject)
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);
  it("TEST 44: should be possible to update another participant's role if you are a the owner", function (done) {
    console.log("TEST 44");

    helper.createTestProjectWithOwner()
      .then(function (project) {
        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function (project) {

            helper.getProject(projectId)
              .then(function (project) {

                var newproject = JSON.parse(JSON.stringify(project));
                newproject.participants[1].roles = [
                  {"role": "Architekt"}
                ];

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[1]._id + "/roles/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send(newproject)
                  .expect(200)
                  .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.participants[1].roles[0].role === "Architekt") {
                      return done();

                    } else {
                      return done(err ? err : "There should be updated roles for participants, but instead we have " + resObj);
                    }
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);
  it("TEST 45: should not be possible to update another participant's role if you are a silent participant", function (done) {
    console.log("TEST 45");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {
        var projectId = project._id;

        helper.createNormalParticipant(project)
          .then(function (project) {

            helper.getProject(projectId)
              .then(function (project) {

                var newproject = JSON.parse(JSON.stringify(project));
                newproject.participants[0].roles = [
                  {"role": "Architekt"}
                ];

                request(testapp)
                  .put("/api/v1/projects/" + project._id + "/participants/" + project.participants[0]._id + "/roles/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send(newproject)
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      return done(err);
                    }
                    return done();
                  });
              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  //app.get('/' + config.api.apiversion + 'plans/', plans.findAll);  //projectid must be passed as query parameter
  it("TEST 46: should be possible to get all plans if you are the project owner", function (done) {
    console.log("TEST 46");

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/plans/?projectid=" + project._id)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj[0] !== undefined) {
              return done();

            } else {
              return done(err ? err : "There should be plans, but instead we have " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  //app.get('/' + config.api.apiversion + 'plans/', plans.findAll);  //projectid must be passed as query parameter
  it("TEST 47: should not be possible to get all plans if you are a silent participant", function (done) {
    console.log("TEST 47");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/plans/?projectid=" + project._id)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  //app.get('/' + config.api.apiversion + 'plans/', plans.findAll);  //projectid must be passed as query parameter
  it("TEST 48: should be possible to get all plans if you are a participant", function (done) {
    console.log("TEST 48");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        request(testapp)
          .get("/api/v1/plans/?projectid=" + project._id)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj[0] !== undefined) {
              return done();

            } else {
              return done(err ? err : "There should be plans, but instead we have " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/', plans.findById);
  it("TEST 49: should be possible to get a plan by id if you are the project owner", function (done) {
    console.log("TEST 49");

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plans) {

            request(testapp)
              .get("/api/v1/plans/" + plans._id + "?projectid=" + project._id)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.revisions.length === 1) {
                  return done();

                } else {
                  return done(err ? err : "There should one plan, but instead we have " + resObj);
                }
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/', plans.findById);
  it("TEST 50: should not be possible to get a plan by id if you are a silent participant", function (done) {
    console.log("TEST 50");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plans) {

            request(testapp)
              .get("/api/v1/plans/" + plans._id + "?projectid=" + project._id)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                return done();
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/', plans.add);
  it("TEST 51: should be possible add a new plan if you are the project owner", function (done) {
    console.log("TEST 51");

    helper.createTestProjectWithOwner()
      .then(function (project) {

        var plan = helper.createTestPlanObject(project._id);

        request(testapp)
          .post("/api/v1/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(plan)
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.revisions.length === 1) {
              return done();

            } else {
              return done(err ? err : "There should be one plan, but instead we have " + resObj);
            }
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/', plans.add);
  it("TEST 52: should not be possible to add an invalid plan (no projectid) if you are the project owner", function (done) {
    console.log("TEST 52");

    var plan = { title: "Some invalid plan"};

    request(testapp)
      .post("/api/v1/plans/")
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'text/html')
      .send(plan)
      .expect(403)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/', plans.add);
  it("TEST 53: should be possible to add a plan if you are a normal participant", function (done) {
    console.log("TEST 53");

    helper.createTestProjectWithNormalParticipant()
      .then(function (project) {
        var plan = helper.createTestPlanObject(project._id);

        request(testapp)
          .post("/api/v1/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(plan)
          .expect(200)
          .end(function (err, res) {
            var resObj = JSON.parse(res.text);
            if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.revisions.length === 1) {
              return done();

            } else {
              return done(err ? err : "There should be one plan, but instead we have " + resObj);
            }
          });

      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/', plans.add);
  it("TEST 54: should not be possible to add a plan if you are a silent participant", function (done) {
    console.log("TEST 54");

    helper.createTestProjectWithSilentParticipant()
      .then(function (project) {
        var plan = helper.createTestPlanObject(project._id);

        request(testapp)
          .post("/api/v1/plans/")
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'text/html')
          .send(plan)
          .expect(403)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/name/', plans.updateName);
  it("TEST 55: should be possible to update the name of the plan if you are the owner", function (done) {
    console.log("TEST 55");

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.name = "CHANGED IT";

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/name/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.name === "CHANGED IT") {
                  return done();

                } else {
                  return done(err ? err : "There should be one plan, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/name/', plans.updateName);
  it("TEST 56: should be possible to update the name of the plan if you are a participant", function (done) {
    console.log("TEST 56");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.name = "CHANGED IT";

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/name/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.name === "CHANGED IT") {
                  return done();

                } else {
                  return done(err ? err : "There should be one plan, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/name/', plans.updateName);
  it("TEST 57: should not be possible to update the name of the plan if you are a silent participant", function (done) {
    console.log("TEST 57");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.name = "CHANGED IT";

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/name/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                return done();
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/:id/revisions/', plans.addRevision);
  it("TEST 58: should be possible to add a revision if you are the owner", function (done) {
    console.log("TEST 58");

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .post("/api/v1/plans/" + plan._id + "/revisions/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.revisions.length === 2) {
                  return done();

                } else {
                  return done(err ? err : "There should be one plan, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/:id/revisions/', plans.addRevision);
  it("TEST 59: should be possible to add a revision if you are a participant", function (done) {
    console.log("TEST 59");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .post("/api/v1/plans/" + plan._id + "/revisions/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.revisions.length === 2) {
                  return done();

                } else {
                  return done(err ? err : "There should be one plan, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/:id/revisions/', plans.addRevision);
  it("TEST 60: should not be possible to add a revision if you are a silent participant", function (done) {
    console.log("TEST 60");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .post("/api/v1/plans/" + plan._id + "/revisions/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                return done();
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/pdf/', plans.getplanrevisionpdf);
  it("TEST 61: should be possible to get a pdf if you are a participant", function (done) {
    console.log("TEST 61");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .get("/api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/pdf/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.url.length > 0) {
                  return done();

                } else {
                  return done(err ? err : "There should be a url, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/pdf/', plans.getplanrevisionpdf);
  it("TEST 62: should be possible to get a pdf if you are a silent participant", function (done) {
    console.log("TEST 62");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .get("/api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/pdf/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.url.length > 0) {
                  return done();

                } else {
                  return done(err ? err : "There should be a url, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/dwg/', plans.getplanrevision);
  it("TEST 63: should be possible to get a dwg if you are a participant", function (done) {
    console.log("TEST 63");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .get("/api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/dwg/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.url.length > 0) {
                  return done();

                } else {
                  return done(err ? err : "There should be a url, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/dwg/', plans.getplanrevision);
  it("TEST 64: should be possible to get a dwg if you are a silent participant", function (done) {
    console.log("TEST 64");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            var newRevision = {
              "revisionindex": 1,
              "index": 1
            };
            newplan.revisions.unshift(newRevision);

            request(testapp)
              .get("/api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/dwg/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.url.length > 0) {
                  return done();

                } else {
                  return done(err ? err : "There should be a url, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/phase', plans.updatePhase);
  it("TEST 65: should be possible to update a plan phase if you are a participant", function (done) {
    console.log("TEST 65");

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.phasetag = 1;

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/phase")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.phasetag === 1) {
                  return done();

                } else {
                  return done(err ? err : "There should be a phasetag, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/phase', plans.updatePhase);
  it("TEST 66: should be possible to update a plan phase if you are the owner", function (done) {
    console.log("TEST 66");

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.phasetag = 1;

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/phase")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && isAnErrorObj(resObj) === false && resObj.phasetag === 1) {
                  return done();

                } else {
                  return done(err ? err : "There should be a phasetag, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.put('/' + config.api.apiversion + 'plans/:id/phase', plans.updatePhase);
  it("TEST 67: should not be possible to update a plan phase if you are a silent participant", function (done) {
    console.log("TEST 67");

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));
            newplan.phasetag = 1;

            request(testapp)
              .put("/api/v1/plans/" + plan._id + "/phase")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send(newplan)
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                return done();
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);
  it("TEST 68: should be possible to send a plan to yourself and another participant if you are the owner", function (done) {
    console.log("TEST 68");
    var projectTitle;

    helper.createTestProjectWithOwnerAndPlan()
      .then(function (project) {
        projectTitle = project.title;

        helper.getPlans(project._id)
          .then(function (plan) {

            helper.createOrFindSecondUser()
              .then(function (user) {

                var newplan = JSON.parse(JSON.stringify(plan));

                request(testapp)
                  .post("/api/v1/plans/mail/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ plan: newplan, recipients: [user.email, helper.testUser.email], projectTitle: projectTitle })
                  .expect(200)
                  .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && !isAnErrorObj(resObj) && resObj[0].action === "sendrevision") {
                      return done();

                    } else {
                      return done(err ? err : "There should be an action sendrevision returned, but instead we have " + resObj);
                    }
                  });

              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);
  it("TEST 69: should be possible to send a plan to yourself and another participant if you are a participant", function (done) {
    console.log("TEST 69");
    var projectTitle;

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {
        projectTitle = project.title;

        helper.getPlans(project._id)
          .then(function (plan) {

            helper.createOrFindSecondUser()
              .then(function (user) {

                var newplan = JSON.parse(JSON.stringify(plan));

                request(testapp)
                  .post("/api/v1/plans/mail/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ plan: newplan, recipients: [user.email, helper.testUser.email], projectTitle: projectTitle })
                  .expect(200)
                  .end(function (err, res) {
                    var resObj = JSON.parse(res.text);
                    if (Object.keys(resObj).length > 0 && err === null && !isAnErrorObj(resObj) && resObj[0].action === "sendrevision") {
                      return done();

                    } else {
                      return done(err ? err : "There should be an action sendrevision returned, but instead we have " + resObj);
                    }
                  });

              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);
  it("TEST 70: should not be possible to send a plan if you are a silent participant", function (done) {
    console.log("TEST 70");
    var projectTitle;

    helper.createTestProjectWithSilentParticipantAndPlan()
      .then(function (project) {
        projectTitle = project.title;

        helper.getPlans(project._id)
          .then(function (plan) {

            helper.createOrFindSecondUser()
              .then(function (user) {

                var newplan = JSON.parse(JSON.stringify(plan));

                request(testapp)
                  .post("/api/v1/plans/mail/")
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Accept', 'text/html')
                  .send({ plan: newplan, recipients: [user.email, helper.testUser.email], projectTitle: projectTitle})
                  .expect(403)
                  .end(function (err, res) {
                    if (err) {
                      done(err);
                    }
                    done();
                  });

              }, function (err) {
                done(err);
              });
          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

  // app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);
  it("TEST 71: should be possible to send a plan to a new silent participant if you are a participant", function (done) {
    console.log("TEST 71");
    var projectTitle;

    helper.createTestProjectWithNormalParticipantAndPlan()
      .then(function (project) {
        projectTitle = project.title;

        helper.getPlans(project._id)
          .then(function (plan) {

            var newplan = JSON.parse(JSON.stringify(plan));

            request(testapp)
              .post("/api/v1/plans/mail/")
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Accept', 'text/html')
              .send({ plan: newplan, recipients: ["neuersilentparticipant@anorak.io"], projectTitle: projectTitle})
              .expect(200)
              .end(function (err, res) {
                var resObj = JSON.parse(res.text);
                if (Object.keys(resObj).length > 0 && err === null && !isAnErrorObj(resObj) && resObj[0].action === "sendrevision") {
                  return done();

                } else {
                  return done(err ? err : "There should be an action sendrevision returned, but instead we have " + resObj);
                }
              });

          }, function (err) {
            done(err);
          });
      }, function (err) {
        done(err);
      });
  });

});
/*
 app.post('/' + config.api.apiversion + 'logging', logger.logRequest);
 app.post('/' + config.api.apiversion + 'userregistrations/', userregistrations.add);
 app.get('/' + config.api.apiversion + 'userregistrations/confirmuserregistration/:token/', userregistrations.confirmuserregistration);
 app.get('/' + config.api.apiversion + 'userregistrations/isemailavailableforloginaccount/', userregistrations.isEmailAdressAvailableForLoginAccount);
 app.post('/' + config.api.apiversion + 'userregistrations/forgotpassword/', userregistrations.forgotpassword);
 app.post('/' + config.api.apiversion + 'login', security.login);
 app.get('/' + config.api.apiversion + 'login', security.login);
 app.post('/' + config.api.apiversion + 'logout', security.logout);
 app.get('/' + config.api.apiversion + 'current-user', security.sendCurrentUser);

 app.get('/' + config.api.apiversion + 'users/:id', users.findById);
 DONE should not be possible requesting a user with id that is not one's own
 DONE should be possible requesting your own userdata

 app.put('/' + config.api.apiversion + 'users/:id/profile/', users.updateProfile);
 DONE should not be possible to update profile with userid that is not one's own
 DONE should be possible to update your own profile
 TODO what about empty entries, e.g. no name? profile should be valid

 app.post('/' + config.api.apiversion + 'users/:id/password/', users.setpassword);
 DONE should not be possible to set password with userid that is not one's own
 DONE should be possible to set your own password
 TODO should not be possible to set password to empty string

 app.post('/' + config.api.apiversion + 'users/mail/support/', mail.sendSupportMail);
 DONE should not be possible to send support mail with an email address that is not the one you used for reacture registration
 DONE should be possible to send support mail as reacture user
 TODO should not be possible to send if you are no reacture user, maybe duplicate of first DONE

 // projects
 app.get('/' + config.api.apiversion + 'projects/', projects.findAll);
 DONE should be possible to get all projects as empty list when there are none
 DONE should yield empty list when trying to get all projects when you are participant with permission silent
 DONE should be possible to get all projects where you are participant with permission owner

 app.get('/' + config.api.apiversion + 'projects/new/', projects.newprojectmodel);
 DONE should be possible to get a new project model if you are a logged in reacture user

 app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
 DONE should not be possible to find project with wrong id
 DONE should be possible to find project with right id when you are the owner
 DONE should not be possible to find project with id when you are no participant
 DONE should not be possible to find project with id when you are a silent participant

 app.get('/' + config.api.apiversion + 'projects/:id/plans/', plans.findAll);
 DONE should be possible to find all plans for project when you are the owner, no plans inside yields empty response
 DONE should be possible to find all plans for project when you are the owner
 DONE should not possible to find all plans for project when you are a silent participant

 app.put('/' + config.api.apiversion + 'projects/:id/roles/', projects.updateRoles);
 DONE should not be possible to update roles for project when you are a silent participant
 DONE should be possible to update roles for project when you are the owner
 TODO validate roles, e.g. no empty roles

 app.post('/' + config.api.apiversion + 'projects', projects.add);
 DONE should be possible to add a new project if you are a reacture user
 DONE should not be possible to add invalid project (without title)
 TODO should not be possible to add a project if you are not paying, not implemented yet

 app.put('/' + config.api.apiversion + 'projects/:id/title/', projects.updateTitle);
 DONE should be possible to update title of a new project if you are the owner
 DONE should not be possible to update title of a new project if you are a silent participant

 // participants of project
 app.get('/' + config.api.apiversion + 'projects/:id/participants/', projects.findAllParticipants);
 DONE should be possible to find all participants of the project if you are the owner
 DONE should not be possible to find all participants of the project if you are a silent participant

 app.get('/' + config.api.apiversion + 'projects/:id/participants/:participantid/', projects.findParticipantById);
 DONE should not be possible to find a participant by id if you are a silent participant
 DONE should be possible to find a participant by id if you are the owner of the project

 app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
 DONE should not be possible to add a participant if you are a silent participant
 DONE should be possible to add a participant if you are the owner of the project
 DONE should not be possible to add yourself as a participant if you are the owner of the project TODO but it is, check in client
 DONE should be possible to invite a participant which is already a silent participant
 DONE should not be possible to add another participant if you are a participant

 app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
 DONE should not be possible to change enabled state of participant if you are a silent participant
 DONE should be possible to change enabled state of participant if you are a the owner
 DONE should not possible to change enabled state of yourself even if you are the owner (i.e. disable yourself is impossible)
 DONE should not possible to change enabled state of another participant if you are a participant
 DONE admin can not disable owner

 app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/company/', projects.updateCompanyOfParticipant);
 DONE should not be possible to update company of participant if you are a silent participant
 DONE should be possible to update company of another participant if you are a the owner
 DONE should be possible to update your own company if you are a the owner
 TODO validation of company? could be empty string by now

 app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);
 DONE should be possible to update your role if you are a the owner
 DONE should not be possible to update your role if you are a silent participant
 DONE should be possible to update another participant's role if you are a the owner
 DONE should not be possible to update another participant's role if you are a silent participant
 TODO should not be possible to update another participants role if you are a participant

 // plans
 app.get('/' + config.api.apiversion + 'plans/', plans.findAll);  //projectid must be passed as query parameter
 DONE should be possible to get all plans if you are the project owner
 DONE should not be possible to get all plans if you are a silent participant
 DONE should be possible to get all plans if you are a participant

 app.get('/' + config.api.apiversion + 'plans/:id/', plans.findById);
 DONE should be possible to get a plan by id if you are the project owner
 DONE should not be possible to get a plan by id if you are a silent participant

 app.post('/' + config.api.apiversion + 'plans/', plans.add);
 DONE should be possible add a new plan if you are the project owner
 DONE should not be possible to add an invalid plan (no projectid) if you are the project owner
 TODO test extra things that may be missing from plan

 app.put('/' + config.api.apiversion + 'plans/:id/name/', plans.updateName);
 DONE should be possible to update the name of the plan if you are the owner
 DONE should be possible to update the name of the plan if you are a participant
 DONE should not be possible to update the name of the plan if you are a silent participant

 app.post('/' + config.api.apiversion + 'plans/:id/revisions/', plans.addRevision);
 DONE should be possible to add a revision if you are the owner
 DONE should not be possible to add a revision if you are a silent participant

 app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/pdf/', plans.getplanrevisionpdf);
 DONE should be possible to get a pdf if you are a participant
 DONE should be possible to get a pdf if you are a silent participant
 TODO Amazon S3 testing?

 app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/dwg/', plans.getplanrevisiondwg);
 DONE should be possible to get a dwg if you are a participant
 DONE should be possible to get a dwg if you are a silent participant
 TODO Amazon S3 testing?

 app.put('/' + config.api.apiversion + 'plans/:id/phase', plans.updatePhase);
 DONE should be possible to update a plan phase if you are a participant
 DONE should be possible to update a plan phase if you are the owner
 DONE should not be possible to update a plan phase if you are a silent participant
 TODO send empty phase? validation?

 app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);
 DONE should be possible to send a plan if you are the owner
 DONE should be possible to send a plan if you are a participant
 DONE should not be possible to send a plan if you are a silent participant
 TODO check if silent users are created at end of tests

 // activities
 app.get('/' + config.api.apiversion + 'activities/', activities.findAll);  //projectid, action and participantid can be passed as query parameter
 app.get('/' + config.api.apiversion + 'activities/revisiondownloads/', activities.getDownloadsOfPlanRevisions);  // query-params: planid=
 app.get('/' + config.api.apiversion + 'activities/revisionsent/', activities.getSentOfPlanRevisions);  // query-params: planid=

 // Retrieve the S3 upload credentials
 app.get('/' + config.api.apiversion + 's3/signput', s3.signput);


 TODO Dateistruktur: Tests für owner, admin, participant, silent und disabled user, Testen auch was man selber an sich editieren kann
 TODO paying feature testing
 TODO alle Testergebnisse in der Datenbank nachprüfen
 TODO check testcases for examples
 */