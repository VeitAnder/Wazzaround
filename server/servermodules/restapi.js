var config = require('../config.js');
var logger = require('../lib/logger.js');

var projects = require('../routes/projects');
var plans = require('../routes/plans');
var users = require('../routes/users');
var activities = require('../routes/activities');
var userregistrations = require('../routes/userregistrations');
var mail = require('../routes/mail');
var s3fineuploader = require('../routes/s3fineuploader');

var security = require('../lib/security');

var manifest = function (app) {
  app.get("/static/manifest.appcache", function (req, res) {
    logger.info("send /static/manifest.appcache");
    res.header("Content-Type", "text/cache-manifest");
    res.end("CACHE MANIFEST");
  });
};

var publicRestApi = function (app) {
  ////////////////////////////////////////////////////////
  // Postmark Bounce API

  // postmark app bounce hook api
  app.post('/' + config.api.apiversion + 'mail/bounce', security.basic);
  app.get('/' + config.api.apiversion + 'mail/bounce', security.basic);

  // User Registration process
  app.post('/' + config.api.apiversion + 'logging', logger.logRequest);

  app.post('/' + config.api.apiversion + 'userregistrations/', userregistrations.add);
  app.get('/' + config.api.apiversion + 'userregistrations/confirmuserregistration/:token/', userregistrations.confirmuserregistration);
  app.get('/' + config.api.apiversion + 'userregistrations/isemailavailableforloginaccount/', userregistrations.isEmailAdressAvailableForLoginAccount);
  app.post('/' + config.api.apiversion + 'userregistrations/forgotpassword/', userregistrations.forgotpassword);
// user authentication routes
  app.post('/' + config.api.apiversion + 'login', security.login);
// for login via project inviation email
  app.get('/' + config.api.apiversion + 'login', security.login);
  app.post('/' + config.api.apiversion + 'logout', security.logout);
// Retrieve the current user
  app.get('/' + config.api.apiversion + 'current-user', security.sendCurrentUser);



  app.get('/' + config.api.apiversion + 'activities', activities.findAll);
};


var RestApiAuthentication = function (app) {
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
};

////////////////////////////////////////////////////////
// The REST API
var privateRestApi = function (app) {
// users
  app.get('/' + config.api.apiversion + 'users/:id', users.findById);
  app.put('/' + config.api.apiversion + 'users/:id/profile/', users.updateProfile);
  app.post('/' + config.api.apiversion + 'users/:id/password/', users.setpassword);
  app.post('/' + config.api.apiversion + 'users/mail/support/', mail.sendSupportMail);

// projects

  app.get('/' + config.api.apiversion + 'projects/new/', projects.newprojectmodel); // get new project model - not stored yet
  app.get('/' + config.api.apiversion + 'projects/:id', projects.findById);
  app.get('/' + config.api.apiversion + 'projects/:id/plans/', plans.findAll);
  app.get('/' + config.api.apiversion + 'projects/:id/plans/:id/', plans.findById);

  app.put('/' + config.api.apiversion + 'projects/:id/roles/', projects.updateRoles);

  app.post('/' + config.api.apiversion + 'projects', projects.add);
  app.put('/' + config.api.apiversion + 'projects/:id/title/', projects.updateTitle); //put only on title, only atomic updates to project
// participants of project
  app.get('/' + config.api.apiversion + 'projects/:id/participants/', projects.findAllParticipants);
  app.get('/' + config.api.apiversion + 'projects/:id/participants/:participantid/', projects.findParticipantById);
  app.post('/' + config.api.apiversion + 'projects/:id/participants/', projects.addParticipant);  // invite participant
  app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/changeenabledstate/', projects.changeEnabledStateOfParticipant);
  app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/name/', projects.updateNameOfParticipant);
  app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/company/', projects.updateCompanyOfParticipant);
  app.put('/' + config.api.apiversion + 'projects/:id/participants/:participantid/roles/', projects.updateRolesOfParticipant);

// plans
  app.get('/' + config.api.apiversion + 'plans/', plans.findAll);  //projectid must be passed as query parameter
  app.get('/' + config.api.apiversion + 'plans/:id/', plans.findById);
  app.post('/' + config.api.apiversion + 'plans/', plans.add);
  app.put('/' + config.api.apiversion + 'plans/:id/name/', plans.updateName);
  app.post('/' + config.api.apiversion + 'plans/:id/revisions/', plans.addRevision);
  app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/pdf/', plans.getplanrevisionpdf);
  app.get('/' + config.api.apiversion + 'plans/:id/revisions/:revisionid/dwg/', plans.getplanrevisiondwg);
  app.put('/' + config.api.apiversion + 'plans/:id/phase', plans.updatePhase);
  app.post('/' + config.api.apiversion + 'plans/mail/', mail.sendPlan);

// Handle all S3 URL signing for fineuploader
  app.post('/' + config.api.apiversion + 's3/s3handler', s3fineuploader.s3handler);

// responds with bad request if route is not found in API
  app.all('/' + config.api.apiversion + '*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    logger.warn('Invalid API request', req.url);
    res.send(400);
  });
};

module.exports = {
  "manifest": manifest,
  "publicRestApi": publicRestApi,
  "RestApiAuthentication": RestApiAuthentication,
  "privateRestApi": privateRestApi
};