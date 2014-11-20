var glob = ('undefined' === typeof window) ? global : window,

Handlebars = glob.Handlebars || require('handlebars');

this["JST"] = this["JST"] || {};

Handlebars.registerPartial("accountactivationtoken.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<html style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #b3b3b3; font-family: 'HelveticaNeueLight', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 35px; font-stretch: normal; font-weight: 300; line-height: 42px;\">\n  Nur noch ein Klick und Ihre Registrierung ist erfolgreich abgeschlossen!\n</h2>\n\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  Zum Aktivieren Ihres Accounts klicken Sie bitte auf folgenden Link:\n  <br style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <a href=\"";
  if (helper = helpers.activationurl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.activationurl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n    Meinen Account ("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ") jetzt aktivieren\n  </a>\n</p>\n\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  Ist die Registrierung nicht in Ihrem Namen gemacht worden, können Sie diese Nachricht ignorieren – In diesem Fall\n  verfällt die Registrierung!\n</p>\n</body></html>";
  return buffer;
  }));

Handlebars.registerPartial("bookingconfirmation.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n    <tr class=\"tr-seperator-top\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <td colspan=\"3\" style=\"border-top: 1px dotted #85C900; color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n        <h4 style=\"color: #b3b3b3; font-family: 'HelveticaNeueLight', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 18px; font-stretch: normal; font-weight: 300; line-height: 21px;\">"
    + escapeExpression((helper = helpers.translate || (depth0 && depth0.translate),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.item)),stack1 == null || stack1 === false ? stack1 : stack1.description), options) : helperMissing.call(depth0, "translate", ((stack1 = (depth0 && depth0.item)),stack1 == null || stack1 === false ? stack1 : stack1.description), options)))
    + "</h4>\n      </td>\n    </tr>\n    <tr style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <td style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n        "
    + escapeExpression((helper = helpers.dateFormat || (depth0 && depth0.dateFormat),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.event)),stack1 == null || stack1 === false ? stack1 : stack1.start), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = (depth0 && depth0.event)),stack1 == null || stack1 === false ? stack1 : stack1.start), options)))
    + "\n      </td>\n      <td style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n        "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.bookedEvent)),stack1 == null || stack1 === false ? stack1 : stack1.quantity)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "x\n      </td>\n      <td style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n        "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.item)),stack1 == null || stack1 === false ? stack1 : stack1.price)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " €\n      </td>\n    </tr>\n  ";
  return buffer;
  }

  buffer += "<html style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #b3b3b3; font-family: 'HelveticaNeueLight', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 35px; font-stretch: normal; font-weight: 300; line-height: 42px;\">\n\n  "
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Payment Confirmation", options) : helperMissing.call(depth0, "translations", "Payment Confirmation", options)))
    + "\n</h2>\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">\n    "
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Order ID", options) : helperMissing.call(depth0, "translations", "Order ID", options)))
    + ": "
    + escapeExpression((helper = helpers.readableid || (depth0 && depth0.readableid),options={hash:{},data:data},helper ? helper.call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1._id), options) : helperMissing.call(depth0, "readableid", ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1._id), options)))
    + "\n  </strong>\n</p>\n\n<h3 style=\"color: #85C900; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 18px; font-stretch: normal; font-weight: 600; line-height: 21px;\">\n  "
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Shopping cart", options) : helperMissing.call(depth0, "translations", "Shopping cart", options)))
    + "\n</h3>\n<table class=\"table-shoppingcart\" border=\"0\" cellpadding=\"0\" cellspacing=\"10\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n  ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.bookedEvents), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n  <tr class=\"tr-subtotal\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n    <td colspan=\"2\" style=\"border-bottom: 3px solid #85C900; border-top: 1px solid #85C900; color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">"
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Subtotal", options) : helperMissing.call(depth0, "translations", "Subtotal", options)))
    + "</strong>\n    </td>\n    <td style=\"border-bottom: 3px solid #85C900; border-top: 1px solid #85C900; color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">\n        "
    + escapeExpression((helper = helpers.numeral || (depth0 && depth0.numeral),options={hash:{
    'format': ("0.00")
  },data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.amount), options) : helperMissing.call(depth0, "numeral", ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.amount), options)))
    + "\n        €\n      </strong>\n    </td>\n  </tr>\n</table>\n\n<h3 style=\"color: #85C900; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 18px; font-stretch: normal; font-weight: 600; line-height: 21px;\">"
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Personal data", options) : helperMissing.call(depth0, "translations", "Personal data", options)))
    + "</h3>\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">"
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Name", options) : helperMissing.call(depth0, "translations", "Name", options)))
    + ":</strong>\n  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.firstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.lastName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</p>\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">"
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "E-mail", options) : helperMissing.call(depth0, "translations", "E-mail", options)))
    + ":</strong>\n  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</p>\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <strong style=\"color: #666; font-family: 'HelveticaNeueBold', 'HelveticaNeue-Bold', 'Helvetica Neue Bold', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosBold', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 600; line-height: 17px;\">"
    + escapeExpression((helper = helpers.translations || (depth0 && depth0.translations),options={hash:{},data:data},helper ? helper.call(depth0, "Telephone", options) : helperMissing.call(depth0, "translations", "Telephone", options)))
    + ":</strong>\n  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.bookingData)),stack1 == null || stack1 === false ? stack1 : stack1.booking)),stack1 == null || stack1 === false ? stack1 : stack1.profile)),stack1 == null || stack1 === false ? stack1 : stack1.tel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</p>\n</body></html>";
  return buffer;
  }));

Handlebars.registerPartial("mailbounce.handlebars", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<html style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #b3b3b3; font-family: 'HelveticaNeueLight', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 35px; font-stretch: normal; font-weight: 300; line-height: 42px;\">\nFehler beim Email senden\n</h2>\n\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\nSie haben mit reacture an ";
  if (helper = helpers.receiver) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.receiver); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ein Email gesendet, das nicht erfolgreich zugestellt werden konnte.\nMöglicherweise ist die Emailadresse falsch, bitte überprüfen Sie sie.\nDer Grund warum dieses Email nicht zugestellt werden konnte, ist:<br style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n";
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


  buffer += "<html style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<h2 style=\"color: #b3b3b3; font-family: 'HelveticaNeueLight', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', 'Helvetica Neue', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 35px; font-stretch: normal; font-weight: 300; line-height: 42px;\">\nYou want to reset your Password?</h2>\n\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\nPlease click the following link: <a href=\"";
  if (helper = helpers.resetpwdurl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.resetpwdurl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">Reset your password.</a>\n</p>\n<p style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  Your reActure Team\n</p>\n</body></html>";
  return buffer;
  }));

this["JST"]["default.handlebars.html"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              ";
  stack1 = self.invokePartial(partials['resetpassword.handlebars'], 'resetpassword.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              ";
  stack1 = self.invokePartial(partials['accountactivationtoken.handlebars'], 'accountactivationtoken.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              ";
  stack1 = self.invokePartial(partials['mailbounce.handlebars'], 'mailbounce.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                ";
  stack1 = self.invokePartial(partials['bookingconfirmation.handlebars'], 'bookingconfirmation.handlebars', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              ";
  return buffer;
  }

  buffer += "<html style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\"><body style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n<center style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n  <!--hint: only content inside of .emailwrap will be included in the email, don't add anything outside of email body-->\n  <!--email body start  -->\n\n  <table class=\"table-layout\" border=\"0\" cellpadding=\"0\" cellspacing=\"15\" width=\"100%\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; margin-bottom: 30px; margin-top: 30px;\">\n    <tr style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <td align=\"center\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n          <tr style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n            <td align=\"right\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n              <h1 style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                <a href=\"http://www.reacture.com\" style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n                  <img src=\"";
  if (helper = helpers.host) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.host); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "img/email/reacture_logo.png\" alt=\"reActure – FIND YOUR ACTIVITY\" border=\"0\" style=\"border: 0px none #FFFFFF; border-color: #FFFFFF; border-style: none; border-width: 0px; color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; height: 96px; line-height: 17px; margin: 0; padding: 0; width: 243px;\" width=\"243\" height=\"96\">\n                </a>\n              </h1>\n            </td>\n          </tr>\n        </table>\n\n      </td>\n    </tr>\n    <tr style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n      <td align=\"center\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n        <table id=\"templateBody\" class=\"shadow-4px\" border=\"0\" cellpadding=\"25\" cellspacing=\"0\" style=\"-moz-border-radius: 12px; -ms-border-radius: 12px; -o-border-radius: 12px; -webkit-border-radius: 12px; background-color: #f0f0f0; border-bottom: 4px solid #CCCCCC; border-radius: 12px; color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px; margin: 0; max-width: 800px;\">\n          <tr style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n            <td align=\"left\" valign=\"top\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 14px; font-stretch: normal; font-weight: 400; line-height: 17px;\">\n\n              <!-- E-Mail content -->\n\n              ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.resetpassword), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n              ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.accountactivationtoken), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n              ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.mailbounce), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n              ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.template)),stack1 == null || stack1 === false ? stack1 : stack1.bookingconfirmation), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n              <!-- E-Mail content end-->\n\n            </td>\n          </tr>\n        </table>\n        <p class=\"small\" style=\"color: #666; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 11px; font-stretch: normal; font-weight: 400; line-height: 14px;\">\n          reActure – FIND YOUR ACTIVITY\n          <a href=\"http://www.reacture.com\" class=\"small\" style=\"color: #85C900; font-family: 'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', 'TeXGyreHerosRegular', 'Helvetica', 'Tahoma', 'Geneva', 'Arial', sans-serif; font-size: 11px; font-stretch: normal; font-weight: 400; line-height: 14px;\">\n            www.reacture.com\n          </a>.\n        </p>\n      </td>\n    </tr>\n  </table>\n</center>\n\n\n\n\n</body></html>";
  return buffer;
  });

if (typeof exports === 'object' && exports) {module.exports = this["JST"];}