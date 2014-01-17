var Q = require('q');
var crypto = require('crypto');

var Projects = require('../models/model_projects.js');
var Plans = require('../models/model_plans.js');
var Users = require('../models/model_users.js');
var config = require('../config_testing.js');

var helper = {
  loginMode: "testing-with-login",
  noLoginMode: "testing",
  testUser: {},
  testProjectTitleCounter: 0,
  testPlanTitleCounter: 0,
  silentUser: {},
  createOrFindTestUser: function () {

    var defer = Q.defer();

    var user = new Users({
      email: "hansi@anorak.io",
      password: "bla",
      accountconfirmed: true,
      enabled: true
    });

    user.saveQ()
      .then(function (user) {
      helper.testUser = user;
      return defer.resolve(user);

    }, function (err) {
      Users.findOneQ({
        email: user.email
      })
        .then(function (user) {
          helper.testUser = user;
          return defer.resolve(user);

        }, function (err) {
          console.log("Could not create or find user", err);
          return defer.reject(err);
        });
    });

    return defer.promise;
  },
  createOrFindSecondUser: function () {

    var defer = Q.defer();

    var user = new Users({
      email: "tina@anorak.io",
      password: "bla",
      accountconfirmed: true,
      enabled: true
    });

    user.saveQ().then(function (user) {
      return defer.resolve(user);

    }, function (err) {
      Users.findOneQ({
        email: user.email
      })
        .then(function (user) {
          return defer.resolve(user);

        }, function (err) {
          console.log("Could not create or find user", err);
          return defer.reject(err);
        });
    });

    return defer.promise;
  },
  prepApp: function () {
    var defer = Q.defer();
    Users.remove({}, function (err, res) {
      Projects.remove({}, function (err, res) {
        helper.createOrFindTestUser().then(function (user) {
          helper.testUser = user;
          defer.resolve();

        }, function (err) {
          console.log("Error in creating or finding user", err);
          defer.reject(err);
        });
      });
    });
    return defer.promise;
  },
  createTestProjectObject: function () {
    helper.testProjectTitleCounter++;
    var newproject = {
      title: "Testprojekt-" + helper.testProjectTitleCounter
    };
    return newproject;
  },
  createTestPlanObject: function(projectId) {
    helper.testPlanTitleCounter++;
    var newplan = {
      name : "Testplan-" + helper.testPlanTitleCounter,
      content: "Testplan Inhalt",
      projectid: projectId.toString(),
      phasetag: 1,
      revisions: [
        {
          revisionindex: 0,
          index: 0
        }
      ]
    };
    return newplan;
  },
  createNormalParticipant: function (project) {
    var defer = Q.defer();

    var user = new Users({
      email: "susi@anorak.io",
      password: "bla",
      accountconfirmed: true,
      enabled: true
    });
    user.saveQ()
      .then(function (user) {

        Projects.updateQ({
          _id: project._id
        }, {
          $addToSet: {
            participants: {
              user: user,
              roles: [
                {role: "Architektin"}
              ],
              permission: "participant",
              company: "Susi-Baugruppe"
            }
          }
        }).then(function (result) {
            defer.resolve(result);
          }, function (err) {
            defer.reject(err);
          });
      }, function (err) {
        defer.reject(err);
      });

    return defer.promise;
  },
  createOwner: function (project) {
    var defer = Q.defer();

    var user = new Users({
      email: "owner@anorak.io",
      password: "bla",
      accountconfirmed: true,
      enabled: true
    });
    user.saveQ()
      .then(function (user) {

        Projects.updateQ({
          _id: project._id
        }, {
          $addToSet: {
            participants: {
              user: user,
              roles: [
                {role: "OWNER"}
              ],
              permission: "owner",
              company: "Chief-Baugruppe"
            }
          }
        }).then(function (result) {
            defer.resolve(result);
          }, function (err) {
            defer.reject(err);
          });
      }, function (err) {
        defer.reject(err);
      });

    return defer.promise;
  },
  createSilentParticipant: function (project) {
    var defer = Q.defer();

    var user = new Users({
      email: "silent1@anorak.io",
      password: "bla",
      accountconfirmed: true,
      enabled: true
    });
    user.saveQ()
      .then(function (user) {

        helper.silentUser = user;

        Projects.updateQ({
          _id: project._id
        }, {
          $addToSet: {
            participants: {
              user: user,
              roles: [
                {role: "Stiller Teilhaber"}
              ],
              permission: "silent",
              company: "Undercover-Baugruppe"
            }
          }
        }).then(function (result) {
            defer.resolve(result);
          }, function (err) {
            defer.reject(err);
          });
      }, function (err) {
        defer.reject(err);
      });

    return defer.promise;
  },
  createTestProjectWithoutParticipants: function () {
    var defer = Q.defer();
    var newproject = helper.createTestProjectObject();

    var project = new Projects(newproject);
    project.saveQ()
      .then(function (project) {
        defer.resolve(project);
      }, function (err) {
        defer.reject(err);
      });
    return defer.promise;
  },
  createTestProjectWithSilentParticipant: function () {
    var defer = Q.defer();
    var newproject = helper.createTestProjectObject();
    newproject.participants = [
      {
        user: helper.testUser,
        roles: [
          {role: "Architekt"}
        ],
        permission: "silent"
      }
    ];

    var project = new Projects(newproject);
    project.saveQ().then(function (project) {
      defer.resolve(project);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createTestProjectWithNormalParticipant: function () {
    var defer = Q.defer();
    var newproject = helper.createTestProjectObject();
    newproject.participants = [
      {
        user: helper.testUser,
        roles: [
          {role: "Architekt"}
        ],
        permission: "participant"
      }
    ];

    var project = new Projects(newproject);
    project.saveQ().then(function (project) {
      defer.resolve(project);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createTestProjectWithOwner: function () {
    var defer = Q.defer();
    var newproject = helper.createTestProjectObject();
    newproject.participants = [
      {
        user: helper.testUser,
        roles: [],
        permission: "owner"
      }
    ];
    var project = new Projects(newproject);
    project.saveQ().then(function (project) {
      defer.resolve(project);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createTestProjectWithAdmin: function () {
    var defer = Q.defer();
    var newproject = helper.createTestProjectObject();
    newproject.participants = [
      {
        user: helper.testUser,
        roles: [],
        permission: "admin"
      }
    ];
    var project = new Projects(newproject);
    project.saveQ().then(function (project) {
      defer.resolve(project);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createPlan: function (project) {

    var defer = Q.defer();
    helper.testPlanTitleCounter++;

    // TODO upload a s3 file
    var newplan = {
      "name": "Testplan-" + helper.testPlanTitleCounter,
      "content": "Testplan-" + helper.testPlanTitleCounter,
      "tags": [],
      "phasetag": 1,
      "projectid": project._id,
      "revisions": [
        {
          "revisionindex": 0,
          "index": 0,
          "pdf_file": {
            key: "a-test-plan-pdf",
            filesize: 100,
            filename: "hubs"
          },
          "dwg_file": {
            key: "a-test-plan-dwg",
            filesize: 100,
            filename: "hubs"
          },
          "comment": "",
          "creator_roles": [
            {role: "Architekt"}
          ]
        }
      ]
    };
    var plan = new Plans(newplan);

    plan.saveQ().then(
      function (plan) {
        defer.resolve(project);
      },
      function (err) {
        defer.reject(err);
      });

    return defer.promise;
  },
  createTestProjectWithOwnerAndPlan: function () {
    var defer = Q.defer();

    helper.createTestProjectWithOwner().then(function (project) {
      helper.createPlan(project).then(function (plan) {
        defer.resolve(project);
      }, function (err) {
        defer.reject(err);
      });

    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createTestProjectWithNormalParticipantAndPlan: function () {
    var defer = Q.defer();

    helper.createTestProjectWithNormalParticipant().then(function (project) {
      helper.createPlan(project).then(function (plan) {
        defer.resolve(project);
      }, function (err) {
        defer.reject(err);
      });

    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  createTestProjectWithSilentParticipantAndPlan: function () {
    var defer = Q.defer();

    helper.createTestProjectWithSilentParticipant().then(function (project) {
      helper.createPlan(project).then(function (plan) {
        defer.resolve(project);
      }, function (err) {
        defer.reject(err);
      });

    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },
  //encrypt method - same as in model_users.js !!
  encrypt: function (str) {
    var algorithm = config.security.passwordencryptionalgorithm;
    var key = config.security.passwordencryptionkey;
    var pw = str;
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(pw, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
  },
  getProject: function (projectId) {
    var defer = Q.defer();

    Projects.findOneQ({ _id: projectId })
      .then(function (project) {
        defer.resolve(project);
      }, function (err) {
        defer.reject(err);
      });
    return defer.promise;
  },
  getPlans: function (projectId) {
    var defer = Q.defer();

    Plans.findOneQ({ projectid: projectId })
      .then(function (plans) {
        defer.resolve(plans);
      }, function (err) {
        defer.reject(err);
      });
    return defer.promise;
  }
};

module.exports = helper;