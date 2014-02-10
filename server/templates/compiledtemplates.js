var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["JST"] = this["JST"] || {};

Handlebars.registerPartial("accountactivationtoken", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\nNur noch ein Klick!</h2>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\n<b>Ihre E-Mail Adresse wurde bei Planfred registriert.</b></p>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nZum Bestätigen klicken Sie bitte auf folgenden Link:\n<br>\n<a style=\"color:#259DB5; text-decoration:underline; word-wrap:break-word;\" href=\"";
  if (stack1 = helpers.activationurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.activationurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.activationurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.activationurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></p>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nIst die Registrierung nicht in Ihrem Namen gemacht worden, können Sie diese Nachricht ignorieren – In diesem Fall verfällt die Registrierung!</p>";
  return buffer;
  }));

Handlebars.registerPartial("mailbounce", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\nFehler beim Email senden\n</h2>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nSie haben mit Planfred an ";
  if (stack1 = helpers.receiver) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.receiver); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " ein Email gesendet, das nicht erfolgreich zugestellt werden konnte.\nMöglicherweise ist die Emailadresse falsch, bitte überprüfen Sie sie.\nDer Grund warum dieses Email nicht zugestellt werden konnte, ist:<br>\n";
  if (stack1 = helpers.reason) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.reason); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n\n\n\n\n\n\n\n";
  return buffer;
  }));

Handlebars.registerPartial("plansent", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-bottom: 10px; padding-bottom: 10px; border-bottom: dotted 1px #cacdce\">\n                    <tr>\n                      <td align=\"left\" valign=\"top\">\n\n                        <a href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.downloadlinks)),stack1 == null || stack1 === false ? stack1 : stack1.pdf)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"text-decoration: none; border:2px solid #D3206D; padding:0px 5px 0px 0px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#FFFFFF; color:#D3206D;\n                        -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">\n                          <span style=\"text-align:center; padding:0px 5px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#D3206D; color:#FFFFFF; text-transform: uppercase;\">\n                            <b>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.filetypeending || (depth0 && depth0.filetypeending)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.pdf_file), options) : helperMissing.call(depth0, "filetypeending", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.pdf_file), options)))
    + "</b></span>&nbsp;DOWNLOAD</a>\n\n                      </td>\n                    </tr>\n                    <tr>\n                      <td align=\"left\" valign=\"top\" style=\"padding-top: 5px;\">\n                        <a style=\"color:#259DB5; font-weight:bold; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\n                           href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.downloadlinks)),stack1 == null || stack1 === false ? stack1 : stack1.pdf)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.filename || (depth0 && depth0.filename)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.pdf_file), options) : helperMissing.call(depth0, "filename", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.pdf_file), options)))
    + "\n                        </a>\n                      </td>\n                    </tr>\n                  </table>\n                  ";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-bottom: 10px; padding-bottom: 10px; border-bottom: dotted 1px #cacdce\">\n                    <tr>\n                      <td align=\"left\" valign=\"top\">\n\n                        <span style=\"text-decoration: none; border:2px solid #cacdce; padding:0px 5px 0px 0px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#FFFFFF; color:#cacdce;\n                        -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">\n                          <span style=\"text-align:center; padding:0px 5px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#cacdce; color:#FFFFFF;\">\n                            <b>Druck-Datei</b></span>&nbsp;FEHLT</span>\n\n                      </td>\n                    </tr>\n                  </table>\n                  ";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n                    <tr>\n                      <td align=\"left\" valign=\"top\">\n\n                        <a href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.downloadlinks)),stack1 == null || stack1 === false ? stack1 : stack1.dwg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"text-decoration: none; border:2px solid #C29508; padding:0px 5px 0px 0px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#FFFFFF; color:#C29508;\n                        -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">\n                          <span style=\"text-align:center; padding:0px 5px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#C29508; color:#FFFFFF;  text-transform: uppercase;\">\n                            <b>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.filetypeending || (depth0 && depth0.filetypeending)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.dwg_file), options) : helperMissing.call(depth0, "filetypeending", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.dwg_file), options)))
    + "</b></span>&nbsp;DOWNLOAD</a>\n\n                      </td>\n                    </tr>\n                    <tr>\n                      <td align=\"left\" valign=\"top\" style=\"padding-top: 5px;\">\n                        <a style=\"color:#259DB5; font-weight:bold; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\n                           href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.downloadlinks)),stack1 == null || stack1 === false ? stack1 : stack1.dwg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.filename || (depth0 && depth0.filename)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.dwg_file), options) : helperMissing.call(depth0, "filename", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.dwg_file), options)))
    + "\n                        </a>\n                      </td>\n                    </tr>\n                  </table>\n                  ";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n                    <tr>\n                      <td align=\"left\" valign=\"top\">\n\n                        <span style=\"text-decoration: none; border:2px solid #cacdce; padding:0px 5px 0px 0px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#FFFFFF; color:#cacdce;\n                        -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">\n                          <span style=\"text-align:center; padding:0px 5px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#cacdce; color:#FFFFFF;\">\n                            <b>CAD-Datei</b></span>&nbsp;FEHLT</span>\n\n                      </td>\n                    </tr>\n                  </table>\n                  ";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                ("
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\n                ";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName), {hash:{},inverse:self.program(16, program16, data),fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                ";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                ";
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <p style=\"margin-bottom:0; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#28373C;\">\n              <b>Kommentar:</b> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.comment)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n            </p>\n            ";
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\n        <a style=\"color:#259DB5; text-decoration:underline;\"\n           href=\"";
  if (stack1 = helpers.host) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.host); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "projects/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1.projectid)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/plans/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1._id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/\">Gesamte Planhistorie anzeigen\n        </a>\n      </p>\n\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size:14px; line-height:19px; padding:15px; background-color:#E1550F; color:#FFFFFF;\n    -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">\n        <tr>\n          <td>\n            <img src=\"";
  if (stack2 = helpers.host) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.host); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "static/img/email/planfred-exclamation_email.png\"\n                 alt=\"Planfred exclamation mark\" border=\"0\"\n                 style=\"border:0px none #FFFFFF; border-color:#FFFFFF; border-style:none; border-width: 0px; width: 30px; height: 55px; margin: 0; padding: 0 15px 0 0;\"\n                 width=\"30\" height=\"55\">\n          </td>\n          <td style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#FFFFFF;\">\n            Um sicher zu gehen, dass es von diesem Plan keine neuere Revision gibt, klicken Sie auf folgenden Link und\n            überprüfen die aktuelle Revisionsnummer:\n            <b>\n              <a href=\"";
  if (stack2 = helpers.host) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.host); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "projects/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1.projectid)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/plans/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1._id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/\"\n                 style=\"color:#FFFFFF; text-decoration:underline;\">Link zur Planhistorie\n              </a>\n            </b>\n          </td>\n        </tr>\n      </table>\n\n      ";
  return buffer;
  }

  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\n  Plan für Sie – aus dem Projekt „";
  if (stack1 = helpers.projectname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.projectname); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "“!</h2>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\n  <b>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </b>\n  schickt Ihnen aus dem Projekt <b>„";
  if (stack2 = helpers.projectname) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.projectname); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "“</b> den\n  Plan <b>„"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "“</b>!</p>\n\n<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n  <tr>\n    <td align=\"left\" valign=\"top\" style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size:28px; line-height:33px; background-color:#28373C; color:#FFFFFF; padding:25px 25px 10px 25px;\n    -moz-border-radius:12px 12px 0 0;border-radius:12px 12px 0 0;-webkit-border-radius:12px 12px 0 0;-ms-border-radius:12px 12px 0 0;-o-border-radius:12px 12px 0 0;\">\n      "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.plan)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </td>\n  </tr>\n  <tr>\n    <td align=\"left\" valign=\"top\" style=\"background-color:#FFFFFF; padding:25px;\n    -moz-border-radius:0 0 12px 12px;border-radius:0 0 12px 12px;-webkit-border-radius:0 0 12px 12px;-ms-border-radius:0 0 12px 12px;-o-border-radius:0 0 12px 12px;\">\n\n      <table border=\"0\" cellpadding=\"25\" cellspacing=\"0\" width=\"100%\" style=\"border:solid 4px #dfe1e2;\n      -moz-border-radius:8px;border-radius:8px;-webkit-border-radius:8px;-ms-border-radius:8px;-o-border-radius:8px;\">\n        <tr>\n          <td>\n\n            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n              <tr>\n                <td width=\"30\" align=\"left\" valign=\"top\" rowspan=\"2\"\n                    style=\"padding-right: 10px; border-right:1px solid #dfe1e2;\">\n                  <div style=\"text-align:center; padding:3px 8px; background-color:#259DB5; color:#FFFFFF;\n        -moz-border-radius:8px;border-radius:8px;-webkit-border-radius:8px;-ms-border-radius:8px;-o-border-radius:8px;\">\n                    <span\n                        style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 12px; line-height: 14px; color:#FFFFFF;\">INDEX</span>\n                    <br>\n\n                    <span\n                        style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 30px; line-height: 30px; color:#FFFFFF; text-transform: uppercase;\"><b>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</b></span>\n                  </div>\n                </td>\n                <td align=\"left\" valign=\"top\" style=\"padding-left: 10px;\">\n\n                  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.pdf_file)),stack1 == null || stack1 === false ? stack1 : stack1.filename), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </td>\n              </tr>\n              <tr>\n                <td align=\"left\" valign=\"top\" style=\"padding-left: 10px;\">\n\n                  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.dwg_file)),stack1 == null || stack1 === false ? stack1 : stack1.filename), {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                </td>\n              </tr>\n            </table>\n\n            <p>\n              <span style=\"text-align:center; padding:2px 5px; margin-right: 5px; font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 12px; line-height: 14px; background-color:#e87f4b; color:#FFFFFF;\n                  -moz-border-radius:4px;border-radius:4px;-webkit-border-radius:4px;-ms-border-radius:4px;-o-border-radius:4px;\">Revision #"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.revisionindex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n            </p>\n\n            <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 18px; line-height: 19px; color:#28373C;\">\n              am\n              <b>";
  options = {hash:{
    'format': ("Do MMMM YYYY")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || (depth0 && depth0.dateFormat)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.created), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.created), options)))
    + " um ";
  options = {hash:{
    'format': ("H:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || (depth0 && depth0.dateFormat)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.created), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.created), options)))
    + " Uhr </b>\n              <br> von\n              <b>\n                ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.createdby)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName), {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n              </b> hochgeladen.\n            </p>\n\n            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.revision)),stack1 == null || stack1 === false ? stack1 : stack1.comment), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n          </td>\n        </tr>\n      </table>\n\n      ";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.isnotsilent), {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n    </td>\n  </tr>\n</table>\n";
  return buffer;
  }));

Handlebars.registerPartial("projectinvitation", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n\n<br><br>\n<table border=\"0\" cellpadding=\"15\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#f7d9d9\"\n       style=\"-moz-border-radius:8px;border-radius:8px;-webkit-border-radius:8px;-ms-border-radius:8px;-o-border-radius:8px;\">\n  <tr>\n    <td align=\"left\" valign=\"top\">\n      <h3 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:600; font-size: 21px; line-height: 25px; color:#d54040; border-bottom:1px dotted #d54040\">\n        Achtung:</h3>\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#d54040;\">\n        <b>Ihr Benutzerkonto wurde noch nicht aktiviert!</b></p>\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#d54040;\">\n        Klicken Sie dazu auf folgenden Link:\n        <br>\n        <a style=\"color:#259DB5; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\n           href=\"";
  if (stack1 = helpers.activationurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.activationurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Meinen Account jetzt aktivieren</a></p>\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#d54040;\">\n        <b>Ihre Benutzerdaten:</b><br>\n        E-Mail Adresse:\n        <a style=\"color:#d54040; text-decoration:underline; word-wrap:break-word;\" href=\"mailto:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.invitee)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.invitee)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a><br>\n        Passwort: ";
  if (stack2 = helpers.password) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.password); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n      </p>\n\n    </td>\n  </tr>\n</table>\n\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\n  Der folgende Link führt Sie über die Anmeldung direkt zum Projekt:\n  <br>\n  <a style=\"color:#259DB5; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\n     href=\"";
  if (stack1 = helpers.host) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.host); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "projects/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.project)),stack1 == null || stack1 === false ? stack1 : stack1._id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/plans/\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.project)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n</p>\n\n";
  return buffer;
  }

  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\n  Sie sind eingeladen!</h2>\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\n  Sie wurden von\n  <b>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </b>\n  zum\n  <b>Projekt „"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.project)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "“</b> eingeladen.</p>\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.includeactivationlink), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  }));

Handlebars.registerPartial("resetpassword", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n\n<br><br>\n<table border=\"0\" cellspacing=\"25\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#f7d9d9\"\nstyle=\"-moz-border-radius:8px;border-radius:8px;-webkit-border-radius:8px;-ms-border-radius:8px;-o-border-radius:8px;\">\n  <tr>\n    <td align=\"left\" valign=\"top\">\n      <h3 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:600; font-size: 21px; line-height: 25px; color:#d54040; border-bottom:1px dotted #d54040\">\n      Achtung:</h3>\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#d54040;\">\n      <b>Ihr Benutzerkonto wurde noch nicht aktiviert!</b></p>\n\n      <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#d54040;\">\n      Klicken Sie dazu auf folgenden Link:<br>\n      <a style=\"color:#259DB5; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\n      href=\"";
  if (stack1 = helpers.activationurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.activationurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.activationurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.activationurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></p>\n\n    </td>\n  </tr>\n</table>\n\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nDer folgende Link führt Sie direkt zum Login:\n<br>\n<a style=\"color:#259DB5; text-decoration:underline; -ms-word-break: break-all; word-break: break-all; word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto;\"\nhref=\"";
  if (stack1 = helpers.loginurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.loginurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.loginurl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.loginurl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n</p>\n\n\n\n";
  return buffer;
  }

  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\nIhr neues Passwort.</h2>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nDas neue Passwort für das Benutzerkonto <a style=\"color:#259DB5; text-decoration:underline;\" href=\"mailto:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a> lautet: <b>";
  if (stack2 = helpers.password) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.password); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</b>\n</p>\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.includeactivationlink), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  }));

Handlebars.registerPartial("supportmail", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p>Name: "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n";
  return buffer;
  }

  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\nSupportanfrage von User "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\n\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.user)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\"><b>";
  if (stack2 = helpers.text) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.text); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</b></p>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">Technische Daten</p>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">Url: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">Browserdaten "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.browser)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n\n\n";
  return buffer;
  }));

Handlebars.registerPartial("usercopysupportmail", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2 style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-weight:200; font-size: 35px; line-height: 42px; color:#949c9e;\">\nWir haben folgende ";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.topic); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " von Ihnen erhalten:</h2>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\"><b>";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.text); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b></p>\n\n<p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; line-height: 19px; color:#5f6a6d;\">\nWir werden uns rasch um Ihr Anliegen kümmern.</br>\nIhr Planfred-Team</p>";
  return buffer;
  }));

this["JST"]["templates/default.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.resetpassword, 'resetpassword', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.projectinvitation, 'projectinvitation', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.accountactivationtoken, 'accountactivationtoken', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.plansent, 'plansent', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.supportmail, 'supportmail', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.usercopysupportmail, 'usercopysupportmail', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials.mailbounce, 'mailbounce', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

  buffer += "<center>\n  <!--hint: only content inside of .emailwrap will be included in the email, don't add anything outside of email body-->\n  <!--email body start  -->\n\n  <table border=\"0\" cellpadding=\"20\" cellspacing=\"0\" height=\"100%\" width=\"100%\">\n    <tr>\n      <td align=\"center\" valign=\"top\">\n        <!-- // BEGIN CONTAINER -->\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\n          <tr>\n            <td align=\"center\" valign=\"top\">\n              <!-- // BEGIN HEADER -->\n              <table border=\"0\" cellpadding=\"15px\" cellspacing=\"0\" width=\"600\">\n                <tr>\n                  <td align=\"right\">\n                    <h1 style=\"text-align:right; padding-bottom:20px;\">\n                      <a href=\"http://www.planfred.com\" style=\"color: #259DB5;\">\n                        <img src=\"";
  if (stack1 = helpers.host) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.host); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "static/img/email/planfred-logo_email.png\"\n                             alt=\"Planfred Logo – Pläne immer aktuell!\" border=\"0\"\n                             style=\"border:0px none #FFFFFF; border-color:#FFFFFF; border-style:none; border-width: 0px; width: 300px; height: 66px; margin: 0; padding: 0;\"\n                             width=\"300\" height=\"66\">\n                      </a>\n                    </h1>\n                  </td>\n                </tr>\n              </table>\n              <!-- END HEADER \\\\ -->\n            </td>\n          </tr>\n          <tr>\n            <td align=\"center\" valign=\"top\">\n              <!-- // BEGIN BODY -->\n              <table border=\"0\" cellpadding=\"25\" cellspacing=\"0\" width=\"600\" id=\"templateBody\" bgcolor=\"#ECEEEE\";\n              style=\"-moz-border-radius:12px;border-radius:12px;-webkit-border-radius:12px;-ms-border-radius:12px;-o-border-radius:12px;\n              -webkit-box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0; -moz-box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0; box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0;\">\n                <tr>\n                  <td align=\"left\" valign=\"top\">\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.resetpassword), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.projectinvitation), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.accountactivationtoken), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.plansent), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.supportmail), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.usercopysupportmail), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.mailbounce), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n                  </td>\n                </tr>\n              </table>\n              <!-- END BODY \\\\ -->\n\n              <!-- FOOTER \\\\ -->\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\n                <tr>\n                  <td align=\"center\" valign=\"top\" style=\"padding-top: 20px;\">\n                    <p style=\"font-family:'Helvetica Neue',Helvetica,sans-serif; font-size: 11px; line-height: 15px; color:#5f6a6d;\">Planfred – Das einfache Online-Tool für den organisierten Planaustausch. <a style=\"color:#259DB5; text-decoration:underline;\" href=\"http://www.planfred.com\">www.planfred.com</a>.</p>\n                  </td>\n                </tr>\n              </table>\n              <!-- FOOTER \\\\ -->\n\n            </td>\n          </tr>\n        </table>\n        <!-- END CONTAINER \\\\ -->\n      </td>\n    </tr>\n  </table>\n\n  <!--email body end-->\n</center>\n\n";
  return buffer;
  });

if (typeof exports === 'object' && exports) {module.exports = this["JST"];}