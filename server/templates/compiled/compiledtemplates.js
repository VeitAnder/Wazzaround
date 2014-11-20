var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["JST"] = this["JST"] || {};

Handlebars.registerPartial("accountactivationtoken.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<html style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #949c9e; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 35px; font-stretch: normal; font-weight: 200; line-height: 42px;\">\n  Nur noch ein Klick und Ihre Registrierung ist erfolgreich abgeschlossen!\n</h2>\n\n<p style=\"color: #5f6a6d; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 19px;\">\n  Zum Aktivieren Ihres Accounts klicken Sie bitte auf folgenden Link:\n  <br style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <br style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <a style=\"background-color: #85C900; border-radius: 5px; color: #ffffff; display: inline-block; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; padding: 10px; text-decoration: underline; word-wrap: break-word;\" href=\"";
  if (helper = helpers.activationurl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.activationurl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    Meinen Account ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ") jetzt aktivieren\n  </a>\n  <br style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n</p>\n\n<p style=\"color: #5f6a6d; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 19px;\">\n  Ist die Registrierung nicht in Ihrem Namen gemacht worden, können Sie diese Nachricht ignorieren – In diesem Fall\n  verfällt die Registrierung!\n</p>\n</body></html>";
  return buffer;
  }));

Handlebars.registerPartial("bookingconfirmation.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<html style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n\n\n\n\n</body></html>";
  }));

Handlebars.registerPartial("mailbounce.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<html style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #949c9e; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 35px; font-stretch: normal; font-weight: 200; line-height: 42px;\">\nFehler beim Email senden\n</h2>\n\n<p style=\"color: #5f6a6d; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 19px;\">\nSie haben mit reacture an ";
  if (helper = helpers.receiver) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.receiver); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ein Email gesendet, das nicht erfolgreich zugestellt werden konnte.\nMöglicherweise ist die Emailadresse falsch, bitte überprüfen Sie sie.\nDer Grund warum dieses Email nicht zugestellt werden konnte, ist:<br style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n";
  if (helper = helpers.reason) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.reason); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n</p>\n\n\n\n\n\n\n\n\n</body></html>";
  return buffer;
  }));

Handlebars.registerPartial("resetpassword.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<html style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #85C900; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 35px; font-stretch: normal; font-weight: 200; line-height: 42px;\">\nYou want to reset your Password?</h2>\n\n<p style=\"color: #666666; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 19px;\">\nPlease click the following link: <a style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; text-decoration: underline;\" href=\"";
  if (helper = helpers.resetpwdurl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.resetpwdurl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Reset your password.</a>\n</p>\n<p style=\"color: #666666; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 19px;\">\n  Your reActure Team\n</p>\n</body></html>";
  return buffer;
  }));

this["JST"]["default.handlebars.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials['resetpassword.handlebars'], 'resetpassword.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials['accountactivationtoken.handlebars'], 'accountactivationtoken.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials['mailbounce.handlebars'], 'mailbounce.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                      ";
  stack1 = self.invokePartial(partials['bookingconfirmation.handlebars'], 'bookingconfirmation.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                    ";
  return buffer;
  }

  buffer += "<html style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<center style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <!--hint: only content inside of .emailwrap will be included in the email, don't add anything outside of email body-->\n  <!--email body start  -->\n\n  <table border=\"0\" cellpadding=\"20\" cellspacing=\"0\" height=\"100%\" width=\"100%\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n    <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <td align=\"center\" valign=\"top\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n        <!-- // BEGIN CONTAINER -->\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"550\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n          <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n            <td align=\"center\" valign=\"top\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n              <!-- // BEGIN HEADER -->\n              <table border=\"0\" cellpadding=\"15px\" cellspacing=\"0\" width=\"550\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                  <td align=\"center\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                    <h1 style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; padding-bottom: 20px; text-align: center;\">\n                      <a href=\"http://www.reacture.com\" style=\"color: #666666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                        <img src=\"";
  if (helper = helpers.host) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.host); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "img/email/reacture_logo.png\" alt=\"reActure – FIND YOUR ACTIVITY\" border=\"0\" style=\"border: 0px none #FFFFFF; border-color: #FFFFFF; border-style: none; border-width: 0px; color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; height: 96px; line-height: 17px; margin: 0; padding: 0; width: 243px;\" width=\"243\" height=\"96\">\n                      </a>\n                    </h1>\n                  </td>\n                </tr>\n              </table>\n              <!-- END HEADER \\\\ -->\n            </td>\n          </tr>\n          <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n            <td align=\"center\" valign=\"top\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n              <!-- // BEGIN BODY -->\n              <table border=\"0\" cellpadding=\"25\" cellspacing=\"0\" width=\"550\" id=\"templateBody\" bgcolor=\"#f7f7f7\" ;=\"\" style=\"-moz-border-radius: 12px; -moz-box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0; -ms-border-radius: 12px; -o-border-radius: 12px; -webkit-border-radius: 12px; -webkit-box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0; background-color: #ECEEEE; border-radius: 12px; box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 0; color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; margin: 0; max-width: 800px;\">\n                <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                  <td align=\"left\" valign=\"top\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.resetpassword), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.accountactivationtoken), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.mailbounce), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.bookingconfirmation), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                  </td>\n                </tr>\n              </table>\n              <!-- END BODY \\\\ -->\n\n              <!-- FOOTER \\\\ -->\n              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"550\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                <tr style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                  <td align=\"center\" valign=\"top\" style=\"color: #5f6a6d; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; padding-top: 20px;\">\n                    <p style=\"color: #5f6a6d; font-family: 'Helvetica Neue',Helvetica,sans-serif; font-size: 11px; font-stretch: normal; font-weight: 400; line-height: 15px;\">reActure – FIND YOUR ACTIVITY <a style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; text-decoration: underline;\" href=\"http://www.reacture.com\">www.reacture.com</a>.</p>\n                  </td>\n                </tr>\n              </table>\n              <!-- FOOTER \\\\ -->\n\n            </td>\n          </tr>\n        </table>\n        <!-- END CONTAINER \\\\ -->\n      </td>\n    </tr>\n  </table>\n\n  <!--email body end-->\n</center>\n\n</body></html>";
  return buffer;
  });

if (typeof exports === 'object' && exports) {module.exports = this["JST"];}