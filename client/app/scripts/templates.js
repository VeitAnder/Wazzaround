angular.module('templates.app', ['account/account.tpl.html', 'account/account_basepagetemplate.tpl.html', 'account/account_payment.tpl.html', 'account/account_tabnav.tpl.html', 'account/password/password_page.tpl.html', 'directives/downloadlink.tpl.html', 'directives/fileuploadcheck.tpl.html', 'directives/fullname.tpl.html', 'directives/roleselector.tpl.html', 'directives/s3uploadform.tpl.html', 'navbar/navbar.tpl.html', 'registration/forgotpassword/forgotpassword_page.tpl.html', 'registration/registration_page.tpl.html', 'index.html', 'legalnotes.html', 'login/login.html', 'logo.html', 'map/mapsearchbar.html', 'map/templatedinfowindow.html', 'why.html', 'workwithus.html']);

angular.module("account/account.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/account.tpl.html",
    "<div data-ng-controller=\"AccountEditCtrl\">\n" +
    "\n" +
    "<div data-ng-include=\"'account/account_tabnav.tpl.html'\"></div>\n" +
    "\n" +
    "  <div class=\"nav-tab-body accountdata\" ng-hide=\"accountstates.edit\">\n" +
    "\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">E-Mail Adresse:</span>\n" +
    "      <span class=\"input_noedit\">{{user.email}}</span>\n" +
    "    </p>\n" +
    "    <span class=\"divider\"></span>\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">Name:</span>\n" +
    "      <span class=\"input_noedit\">{{user.profile.firstName}} {{user.profile.lastName}}</span>\n" +
    "    </p>\n" +
    "    <span class=\"divider\"></span>\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">Firma:</span>\n" +
    "      <span class=\"input_noedit\">{{user.profile.company}}</span>\n" +
    "    </p>\n" +
    "    <span class=\"divider\"></span>\n" +
    "\n" +
    "    <a class=\"edit\" ng-click=\"edit()\">Benutzerdaten ändern</a>\n" +
    "    <a class=\"editpassword\" href=\"/#/account/password\">Passwort ändern</a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"nav-tab-body accountdata\" ng-show=\"accountstates.edit\">\n" +
    "\n" +
    "    <form name=\"valForm\"\n" +
    "          novalidate\n" +
    "          class=\"registrationform\"\n" +
    "          ui-keyup=\"{27: 'cancel()'}\">\n" +
    "      <p>\n" +
    "        <span class=\"input_label\">E-Mail Adresse:</span>\n" +
    "        <span class=\"input_noedit\">{{user.email}}</span>\n" +
    "        <span class=\"alert\">Die E-Mail Adresse kann nicht geändert werden!</span>\n" +
    "      </p>\n" +
    "      <span class=\"divider\"></span>\n" +
    "      <p>\n" +
    "        <label>Vorname:</label>\n" +
    "        <input type=\"text\" name=\"firstName\" ng-model=\"user.profile.firstName\" required>\n" +
    "        <span ng-show=\"showError('firstName', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "      <p>\n" +
    "        <label>Nachname:</label>\n" +
    "        <input type=\"text\" name=\"lastName\" ng-model=\"user.profile.lastName\" required>\n" +
    "        <span ng-show=\"showError('lastName', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "      <span class=\"divider\"></span>\n" +
    "      <p>\n" +
    "        <label>Firma:</label>\n" +
    "        <input type=\"text\" name=\"company\" ng-model=\"user.profile.company\" required>\n" +
    "        <span ng-show=\"showError('company', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "\n" +
    "      <div class=\"buttonbar\">\n" +
    "        <button ng-click=\"saveaccount.requestInProgress || save()\" ng-disabled=\"saveaccount.requestInProgress || !canSave()\">\n" +
    "          speichern\n" +
    "        </button>\n" +
    "        <a class=\"cancel\" data-ng-click=\"cancel()\">abbrechen</a>\n" +
    "      </div>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"nav-tab-body\" ng-show=\"accountstates.onerror\">\n" +
    "    <p class=\"alert alert-error\">Es ist ein Fehler aufgetreten! Die Daten konnten nicht gespeichert werden.</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"buttonbar\">\n" +
    "    <a href=\"/#/projects/\" class=\"text_icon_close\">schließen\n" +
    "      <span></span>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("account/account_basepagetemplate.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/account_basepagetemplate.tpl.html",
    "<div class=\"authpage\">\n" +
    "  <div class=\"innerwrap\">\n" +
    "\n" +
    "    <h1>Benutzerkonto</h1>\n" +
    "\n" +
    "    <div data-ng-include=\"getPagePartial()\"></div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"communication-element\">\n" +
    "  <!--<a class=\"close\" ng-click=\"close\"><span>schließen</span></a>-->\n" +
    "  <div ng-include=\"'communication.tpl.html'\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("account/account_payment.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/account_payment.tpl.html",
    "<div ng-controller=\"AccountPaymentEditCtrl\">\n" +
    "\n" +
    "  <div data-ng-include=\"'account/account_tabnav.tpl.html'\"></div>\n" +
    "\n" +
    "  <div class=\"nav-tab-body accountdata\" ng-hide=\"states.edit\">\n" +
    "\n" +
    "    <h5>Rechnungsadresse</h5>\n" +
    "\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">Firmenname:</span>\n" +
    "      <span class=\"input_noedit\">Meine Architektur GmbH</span>\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">Adresse:</span>\n" +
    "      <span class=\"input_noedit\">Hauptstraße 1</span>\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">Ort/Stadt:</span>\n" +
    "      <span class=\"input_noedit\">1234 Entenhausen</span>\n" +
    "    </p>\n" +
    "    <span class=\"divider\"></span>\n" +
    "\n" +
    "    <h5>Rechnungszusätze</h5>\n" +
    "\n" +
    "    <p>\n" +
    "      <span class=\"input_label\">UID-Nummer:</span>\n" +
    "      <span class=\"input_noedit\">0815 5528 558</span>\n" +
    "    </p>\n" +
    "    <span class=\"divider\"></span>\n" +
    "\n" +
    "    <h5>Rechnungsintervall</h5>\n" +
    "\n" +
    "    <div class=\"radio-items-noedit\">\n" +
    "      <span class=\"input_noedit item selected\">jährliche Rechnung</span>\n" +
    "      <span class=\"input_noedit item\">monatliche Rechnung</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <span class=\"divider\"></span>\n" +
    "\n" +
    "    <h5>Produktauswahl</h5>\n" +
    "\n" +
    "    <div class=\"radio-items-noedit\">\n" +
    "      <span class=\"input_noedit item\">5 GB Speicherpatz für €19 pro Monat</span>\n" +
    "      <span class=\"input_noedit item selected\">30 GB Speicherpatz für €59 pro Monat</span>\n" +
    "      <span class=\"input_noedit item\">100 GB Speicherpatz für €199 pro Monat</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <span class=\"divider\"></span>\n" +
    "\n" +
    "    <a class=\"edit\" ng-click=\"edit()\">Zahlungsinformationen ändern</a>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"nav-tab-body accountdata\" ng-show=\"states.edit\">\n" +
    "\n" +
    "    <form name=\"valForm\"\n" +
    "          novalidate\n" +
    "          ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "      <h5>Rechnungsadresse</h5>\n" +
    "\n" +
    "      <p>\n" +
    "        <label>Firmenname:</label>\n" +
    "        <input type=\"text\" name=\"companyname\" ng-model=\"user.profile.companyname\" required>\n" +
    "        <span ng-show=\"showError('companyname', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "\n" +
    "      <p>\n" +
    "        <label>Adresse:</label>\n" +
    "        <input type=\"text\" name=\"companyaddress\" ng-model=\"user.profile.companyaddress\" required>\n" +
    "        <span ng-show=\"showError('companyaddress', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "\n" +
    "      <p>\n" +
    "        <label>Ort/Stadt:</label>\n" +
    "        <input type=\"text\" name=\"companycity\" ng-model=\"user.profile.companycity\" required>\n" +
    "        <span ng-show=\"showError('companycity', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "      <span class=\"divider\"></span>\n" +
    "\n" +
    "      <p>\n" +
    "        <label>Land:</label>\n" +
    "        <input type=\"text\" name=\"country\" ng-model=\"user.profile.country\" required>\n" +
    "        <span ng-show=\"showError('country', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "      </p>\n" +
    "      <span class=\"divider\"></span>\n" +
    "\n" +
    "\n" +
    "      <h5>Rechnungszusätze</h5>\n" +
    "\n" +
    "      <p>\n" +
    "        <label>UID-Nummer:</label>\n" +
    "        <input type=\"text\" name=\"companyuid\" ng-model=\"user.profile.companyuid\">\n" +
    "      </p>\n" +
    "      <span class=\"divider\"></span>\n" +
    "\n" +
    "      <h5>Rechnungsintervall</h5>\n" +
    "\n" +
    "      <div class=\"radio-items\">\n" +
    "        <span class=\"item selected\"><span class=\"radio-item\"></span><strong>jährliche Rechnung</strong> <br>(12 Monate nutzen - nur 11 Monate bezahlen)</span>\n" +
    "        <span class=\"item\"><span class=\"radio-item\"></span><strong>monatliche Rechnung</strong></span>\n" +
    "      </div>\n" +
    "\n" +
    "      <span class=\"divider\"></span>\n" +
    "\n" +
    "      <h5>Produktauswahl</h5>\n" +
    "\n" +
    "      <div class=\"radio-items\">\n" +
    "        <span class=\"item\"><span class=\"radio-item\"></span>5 GB Speicherpatz für €19 pro Monat</span>\n" +
    "        <span class=\"item selected\"><span class=\"radio-item\"></span>30 GB Speicherpatz für €59 pro Monat</span>\n" +
    "        <span class=\"item\"><span class=\"radio-item\"></span>100 GB Speicherpatz für €199 pro Monat</span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"buttonbar\">\n" +
    "        <a ng-click=\"save()\" class=\"button\" ng-class=\"{disabled: !isFormValid()}\">\n" +
    "          speichern\n" +
    "        </a>\n" +
    "        <a class=\"cancel\" data-ng-click=\"cancel()\">abbrechen</a>\n" +
    "      </div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("account/account_tabnav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/account_tabnav.tpl.html",
    "<div class=\"nav-tab-header\">\n" +
    "  <ul class=\"nav-tab\">\n" +
    "    <li><a ng-class=\"{active: tabnavlocation == '/account'}\" ng-href=\"#/account\"><span>Benutzerdaten</span></a></li>\n" +
    "    <li><a ng-class=\"{active: tabnavlocation == '/account/payment'}\" ng-href=\"#/account/payment\" ><span>Zahlungsinformation</span></a></li>\n" +
    "  </ul>\n" +
    "</div>");
}]);

angular.module("account/password/password_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/password/password_page.tpl.html",
    "<div class=\"page\">\n" +
    "<div class=\"authpage\">\n" +
    "  <div class=\"innerwrap\">\n" +
    "\n" +
    "    <div ng-hide=\"onsuccess\">\n" +
    "      <form name=\"valForm\"\n" +
    "            novalidate\n" +
    "            class=\"registrationform\"\n" +
    "            ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "        <h1>Passwort ändern</h1>\n" +
    "\n" +
    "        <p>\n" +
    "          <label>Neues Passwort</label>\n" +
    "          <input type=\"password\" name=\"password\" ng-model=\"user.password\" required>\n" +
    "          <span ng-show=\"showError('password', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "        </p>\n" +
    "\n" +
    "        <p>\n" +
    "          <label>Neues Passwort wiederholen</label>\n" +
    "          <input type=\"password\" name=\"passwordRepeat\" ng-model=\"password\" required\n" +
    "                 validate-equals=\"user.password\">\n" +
    "          <span ng-show=\"showError('passwordRepeat', 'equal')\" class=\"alert alert-error\">Die Passwörter stimmen nicht überein.</span>\n" +
    "          <span ng-show=\"showError('passwordRepeat', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "        </p>\n" +
    "        <div class=\"buttonbar\">\n" +
    "          <button ng-click=\"state.requestInProgress || save()\" ng-disabled=\"state.requestInProgress || !canSave()\">\n" +
    "            Passwort aktualisieren\n" +
    "          </button>\n" +
    "          <a class=\"cancel\" data-ng-click=\"gotoAccountPage()\">abbrechen</a>\n" +
    "        </div>\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"state.onsuccess\">\n" +
    "      <h1>Passwort ändern</h1>\n" +
    "\n" +
    "      <p class=\"alert alert-success\">Ihr Passwort wurde erfolgreich aktualisiert.</p>\n" +
    "\n" +
    "      <div class=\"buttonbar backto\">\n" +
    "        <a data-ng-click=\"gotoAccountPage()\">zurück zu meinen Benutzerdaten</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"state.onfail\">\n" +
    "      <h1>Passwort ändern</h1>\n" +
    "\n" +
    "      <p class=\"alert alert-error\">Es ist ein Fehler aufgetreten. Das Passwort konnte nicht aktualisiert\n" +
    "        werden. Versuchen Sie es bitte noch einmal!</p>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("directives/downloadlink.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/downloadlink.tpl.html",
    "<div class=\"downloadlink\">\n" +
    "\n" +
    "    <a ng-click=\"downloadrevision()\" ng-right-click=\"contextmenu\">\n" +
    "      {{filename}}\n" +
    "    </a>\n" +
    "\n" +
    "    <div class=\"contextmenu\" style=\"position:absolute;\" ng-show=\"showcontextmenu\">\n" +
    "      <div class=\"contextmenu-content\">\n" +
    "        <a class=\"contextmenudownloadlink\" ng-click=\"downloadrevision()\" style=\"display:block;\">\n" +
    "          <span></span>\n" +
    "          Datei herunterladen\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/fileuploadcheck.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/fileuploadcheck.tpl.html",
    "<div ng-class=\"{active : uploaded}\">\n" +
    "\n" +
    "  <div s3uploadform\n" +
    "       filetype=\"pdf\"\n" +
    "  ></div>\n" +
    "\n" +
    "  <div s3uploadform\n" +
    "       filetype=\"dwg\"\n" +
    "  ></div>\n" +
    "\n" +
    "  <span class=\"alert\" ng-show=\"!pristine && !uploaded && !uploadinprogress\">Bitte laden Sie mindestens eine Datei hoch!</span>\n" +
    "</div>");
}]);

angular.module("directives/fullname.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/fullname.tpl.html",
    "<span data-ng-switch on=\"data.permissioninproject\">\n" +
    "\n" +
    "  <span ng-switch-when=\"silent\" class=\"fullname\"><span class=\"email\">{{user.email}}</span></span>\n" +
    "\n" +
    "  <span ng-switch-default class=\"fullname\">\n" +
    "\n" +
    "    <a ng-hide=\"donotlink\" href=\"/#/projects/{{data.projectid}}/participants/{{data.userid}}/\">\n" +
    "      <span class=\"name\" ng-show=\"user.profile.firstName || user.profile.lastName\">{{user.profile.firstName}} {{user.profile.lastName}}</span>\n" +
    "      <span class=\"email\" ng-show=\"(!user.profile.firstName && !user.profile.lastName) || alwaysshowemail\">{{user.email}}</span>\n" +
    "    </a>\n" +
    "\n" +
    "    <span ng-show=\"donotlink\" class=\"name\" ng-show=\"user.profile.firstName || user.profile.lastName\">{{user.profile.firstName}} {{user.profile.lastName}}</span>\n" +
    "    <span ng-show=\"donotlink\" class=\"email\" ng-show=\"(!user.profile.firstName && !user.profile.lastName) || alwaysshowemail\">{{user.email}}</span>\n" +
    "\n" +
    "  </span>\n" +
    "\n" +
    "</span>");
}]);

angular.module("directives/roleselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/roleselector.tpl.html",
    "<div class=\"roleselector\">\n" +
    "  <div class=\"role_tags edit\">\n" +
    "    <a class=\"role_tag\"\n" +
    "       ng-class=\"{selected : editRoleElement.selected}\"\n" +
    "       ng-click=\"selectRole(editRoleElement)\"\n" +
    "       ng-repeat=\"editRoleElement in roleselectionlist\">{{editRoleElement.role}}\n" +
    "    </a>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-inline role_add\">\n" +
    "    <input type=\"text\" name=\"role\" id=\"role\" placeholder=\"neue Rolle hinzufügen\"\n" +
    "           ng-model=\"newrole\">\n" +
    "\n" +
    "    <a class=\"add\" ng-click=\"addRole()\">\n" +
    "      <span>hinzufügen</span>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <div ng-show=\"states.addroleerror === 'exists'\" class=\"alert alert-error\">Die Rolle \"{{newrole}}\" existiert bereits</div>\n" +
    "    <div ng-show=\"states.addroleerror === 'empty' && !states.pristineform\" class=\"alert alert-error\">Bitte geben Sie eine Rolle ein oder wählen Sie eine aus</div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("directives/s3uploadform.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/s3uploadform.tpl.html",
    "<div class=\"s3fineuploader {{filetype}}\">\n" +
    "\n" +
    "  <div data-ng-switch=\"filename.error\">\n" +
    "    <div ng-switch-when=\"forbidden\" class=\"alert alert-error\">\n" +
    "      Der Dateiname darf keine Sonderzeichen (;,/?:@&=+$) enthalten!\n" +
    "    </div>\n" +
    "    <div ng-switch-when=\"other\" class=\"alert alert-error\">\n" +
    "      Der Dateiname enthält nicht erlaubte Sonderzeichen.\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"upload dropzone\" ng-class=\"{completed: uploadcompleted, uploaderror: uploaderror}\">\n" +
    "\n" +
    "    <div class=\"uploadform\"\n" +
    "         ng-hide=\"uploadinprogress || uploadcompleted || uploaderror\"\n" +
    "        >\n" +
    "\n" +
    "      <span class=\"button_fileinput\">\n" +
    "        <span class=\"button_text\" ng-show=\"filetype === 'pdf'\">Druck-Datei (PDF, …) auswählen</span>\n" +
    "        <span class=\"button_text\" ng-show=\"filetype === 'dwg'\">CAD-Datei (DWG, …) auswählen</span>\n" +
    "      </span>\n" +
    "      <span class=\"dragover_help\">oder einfach hierher ziehen!</span>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"upload_progressbar\"\n" +
    "         ng-show=\"uploadinprogress\"\n" +
    "         ng-class=\"{inprogress: uploadinprogress}\"\n" +
    "        >\n" +
    "      <div class=\"upload_progressbar_animatedbar\" ng-style=\"progresscss\"></div>\n" +
    "\n" +
    "      <div class=\"upload_filename\">\n" +
    "        <span spinner spinnercolor=\"#000000\" spinnertext=\"\"> </span>\n" +
    "        <span>{{s3uploadservice.filename}}</span>\n" +
    "        <span class=\"upload_filename_text\" ng-hide=\"uploadsaving\">wird hochgeladen …</span>\n" +
    "        <span class=\"upload_filename_text\" ng-show=\"uploadsaving\">wird gespeichert …</span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"progressvalue\" ng-hide=\"uploadsaving\">{{uploadprogressmessage}}</div>\n" +
    "      <a ng-click=\"cancel()\" class=\"delete\">\n" +
    "        <span>cancel</span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"upload_completed\"\n" +
    "         ng-show=\"uploadcompleted\"\n" +
    "        >\n" +
    "      <div class=\"upload_filename\">\n" +
    "        {{s3uploadservice.filename}} <span class=\"upload_filename_text\">erfolgreich hochgeladen!</span>\n" +
    "      </div>\n" +
    "\n" +
    "      <a ng-click=\"cancel()\" class=\"delete\">\n" +
    "        <span>cancel</span>\n" +
    "      </a>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"upload_error\"\n" +
    "         ng-show=\"uploaderror\"\n" +
    "        >\n" +
    "      <div class=\"alert alert-error\">\n" +
    "        Der Upload von {{s3uploadservice.filename}} ist fehlgeschlagen!\n" +
    "        <br>\n" +
    "        <a ng-click=\"cancel()\" class=\"delete\">\n" +
    "          <span>Die Datei erneut hochladen</span>\n" +
    "        </a>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("navbar/navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("navbar/navbar.tpl.html",
    "<div class=\"tabnav\" ng-controller=\"NavBarCtrl\">\n" +
    "  <ul>\n" +
    "    <li ng-class=\"{active: navbaractivetab=='plans'}\">\n" +
    "      <a href=\"/#/projects/{{projectid}}/plans/\">Pläne</a>\n" +
    "    </li>\n" +
    "    <li class=\"participants\" ng-class=\"{active: navbaractivetab=='participants'}\">\n" +
    "      <a href=\"/#/projects/{{projectid}}/participants/\">Beteiligte</a>\n" +
    "    </li>\n" +
    "    <li class=\"activities\" ng-class=\"{active: navbaractivetab=='activities'}\">\n" +
    "      <a href=\"/#/projects/{{projectid}}/activities/\">Aktivitäten</a>\n" +
    "    </li>\n" +
    "    <li class=\"planlists\" ng-class=\"{active: navbaractivetab=='planlist'}\">\n" +
    "      <a href=\"/#/projects/{{projectid}}/planlist/\">Planliste</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>");
}]);

angular.module("registration/forgotpassword/forgotpassword_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("registration/forgotpassword/forgotpassword_page.tpl.html",
    "<div class=\"page\" ng-show=\"!isAuthenticated\">\n" +
    "  <div class=\"authpage\">\n" +
    "    <div class=\"innerwrap\">\n" +
    "      <h1>Passwort vergessen?</h1>\n" +
    "\n" +
    "      <div ng-hide=\"passwordrequestsuccess\">\n" +
    "        <form name=\"valForm\"\n" +
    "              novalidate\n" +
    "              class=\"registrationform\"\n" +
    "              ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "          <label>E-Mail</label>\n" +
    "\n" +
    "          <p>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"user.email\" required>\n" +
    "            <span ng-show=\"showError('email', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "            <span ng-show=\"showError('email', 'email')\" class=\"alert alert-error\">Bitte geben Sie eine gültige E-Mail Adresse ein.</span>\n" +
    "          </p>\n" +
    "          <div class=\"buttonbar\">\n" +
    "            <button ng-click=\"send()\" ng-disabled=\"!canSave()\">Neues Passwort zusenden</button>\n" +
    "            <a class=\"cancel\" ng-click=\"cancel()\">zurück zum Login</a>\n" +
    "          </div>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"passwordrequestsuccess\">\n" +
    "        <p class=\"alert alert-success\">Das neue Passwort wurde an {{user.email}} versendet.</p>\n" +
    "\n" +
    "        <div class=\"buttonbar backto\">\n" +
    "          <a ng-click=\"gotoLogin()\">zurück zum Login</a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"passwordrequestsuccess === false\">\n" +
    "        <p class=\"alert alert-error\">Es ist ein Fehler aufgetretet. Das Passwort konnte nicht zugesendet werden.</p>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("registration/registration_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("registration/registration_page.tpl.html",
    "<div class=\"page\" ng-show=\"!isAuthenticated\">\n" +
    "  <div class=\"authpage\">\n" +
    "    <div class=\"innerwrap\">\n" +
    "\n" +
    "      <div ng-hide=\"onsuccessfullregistration\">\n" +
    "        <form name=\"valForm\"\n" +
    "              novalidate\n" +
    "              class=\"registrationform\"\n" +
    "              ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "          <h1>Kostenlose Registrierung</h1>\n" +
    "\n" +
    "          <p>\n" +
    "            <label>E-Mail:</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"user.email\" required unique-email-for-login-account>\n" +
    "            <span ng-show=\"showError('email', 'email')\" class=\"alert alert-error\">Bitte geben Sie eine gültige E-Mail Adresse ein.</span>\n" +
    "            <span ng-show=\"showError('email', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "            <span ng-show=\"showError('email', 'uniqueEmail')\" class=\"alert alert-error\">Diese E-Mail Adresse ist bereits vergeben.</span>\n" +
    "          </p>\n" +
    "          <span class=\"divider\"></span>\n" +
    "\n" +
    "          <p>\n" +
    "            <label>Firma:</label>\n" +
    "            <input type=\"text\" name=\"company\" ng-model=\"user.profile.company\" required>\n" +
    "            <span ng-show=\"showError('company', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "          </p>\n" +
    "          <span class=\"divider\"></span>\n" +
    "\n" +
    "          <p>\n" +
    "            <label>Vorname:</label>\n" +
    "            <input type=\"text\" name=\"firstName\" ng-model=\"user.profile.firstName\" required>\n" +
    "            <span ng-show=\"showError('firstName', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <label>Nachname:</label>\n" +
    "            <input type=\"text\" name=\"lastName\" ng-model=\"user.profile.lastName\" required>\n" +
    "            <span ng-show=\"showError('lastName', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "\n" +
    "          </p>\n" +
    "          <span class=\"divider\"></span>\n" +
    "\n" +
    "          <p>\n" +
    "            <label>Passwort:</label>\n" +
    "            <input type=\"password\" name=\"password\" ng-model=\"user.password\" required>\n" +
    "            <span ng-show=\"showError('password', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "\n" +
    "          </p>\n" +
    "          <p>\n" +
    "            <label>Passwort wiederholen:</label>\n" +
    "            <input type=\"password\" name=\"passwordRepeat\" ng-model=\"password\" required\n" +
    "                   validate-equals=\"user.password\">\n" +
    "            <span ng-show=\"showError('passwordRepeat', 'equal')\" class=\"alert alert-error\">Die Passwörter stimmen nicht überein.</span>\n" +
    "            <span ng-show=\"showError('passwordRepeat', 'required')\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "          </p>\n" +
    "          <div class=\"buttonbar\">\n" +
    "            <button ng-click=\"send()\"\n" +
    "                    ng-class=\"{disabled: valForm.$invalid}\"\n" +
    "                >kostenlos registrieren\n" +
    "            </button>\n" +
    "            <a class=\"cancel\" ng-click=\"cancel()\">abbrechen</a>\n" +
    "          </div>\n" +
    "\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"onsuccessfullregistration\">\n" +
    "        <h1>Registrierung</h1>\n" +
    "\n" +
    "        <p class=\"alert\">In Kürze erhalten Sie eine Nachricht auf {{user.email}} um die Registrierung zu bestätigen.</p>\n" +
    "\n" +
    "        <div class=\"buttonbar\">\n" +
    "          <a ng-click=\"gotoLogin()\">zurück zum Login</a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"onfailedregistration\">\n" +
    "        <h1>Registrierung</h1>\n" +
    "\n" +
    "        <p class=\"alert alert-error\">Es ist ein Fehler aufgetreten. Bitte versuchen Sie es ewtas später noch einmal oder\n" +
    "          kontaktieren Sie unseren Support (<a href=\"mailto:'support@planfred.com'\">support@planfred.com</a>).</p>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.html",
    "<div class=\"loginform\">\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"map-selection-block\">\n" +
    "\n" +
    "<div class=\"section section-map\">\n" +
    "\n" +
    "<div class=\"controlpanel\">\n" +
    "<div data-ng-include=\"'views/logo.html'\"></div>\n" +
    "<h2>What's around me?</h2>\n" +
    "\n" +
    "<div class=\"filter\">\n" +
    "  <span class=\"input_label\">Please choose:</span>\n" +
    "\n" +
    "  <div class=\"filter-category filter-category-sports\"\n" +
    "       data-ng-class=\"{active: areItemsInThisCategorySelected('sports'), open: states.sports.open }\"\n" +
    "      >\n" +
    "    <div class=\"filter-category-header\"\n" +
    "         data-ng-click=\"toggleFilter('sports')\"\n" +
    "        >\n" +
    "      <h4>Sports & Activities</h4>\n" +
    "\n" +
    "      <p>{{numberOfSelectedFromCategory('sports')}} of {{totalNumberOfCategory('sports')}}</p>\n" +
    "\n" +
    "      <div class=\"filter-category-arrow\">\n" +
    "        <span></span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"filter-category-body\"\n" +
    "         data-ng-show=\"states.sports.open\"\n" +
    "        >\n" +
    "\n" +
    "      <div class=\"filter-toggle\">\n" +
    "        <div class=\"filter-toggle-show\"\n" +
    "             data-ng-class=\"{active: allSelected()}\"\n" +
    "             data-ng-click=\"selectAllFromCategory('sports')\"\n" +
    "            >\n" +
    "          Select all\n" +
    "        </div>\n" +
    "        <div class=\"filter-toggle-hide\"\n" +
    "             data-ng-class=\"{active: noneSelected()}\"\n" +
    "             data-ng-click=\"deSelectAllFromCategory('sports')\"\n" +
    "            >\n" +
    "          Deselect all\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div\n" +
    "          class=\"innerwrap\"\n" +
    "          >\n" +
    "\n" +
    "        <div\n" +
    "            class=\"div-row\"\n" +
    "            ng-repeat=\"category in sportsCategories\"\n" +
    "            >\n" +
    "\n" +
    "          <div data-ng-if=\"$index % 2 === 0\">\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"sportsCategories[$index+0]\"\n" +
    "              ng-class=\"{selected: sportsCategories[$index+0].selected === true}\"\n" +
    "              ng-click=\"toggleItemSelection(sportsCategories[$index+0])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{sportsCategories[$index+0].name}}\n" +
    "          </div>\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"sportsCategories[$index+1]\"\n" +
    "              ng-class=\"{selected: sportsCategories[$index+1].selected === true}\"\n" +
    "              ng-click=\"toggleItemSelection(sportsCategories[$index+1])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{sportsCategories[$index+1].name}}\n" +
    "          </div>\n" +
    "         </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"filter-category filter-category-culture\"\n" +
    "     data-ng-class=\"{active: areItemsInThisCategorySelected('culture'), open: states.culture.open}\"\n" +
    "    >\n" +
    "  <div class=\"filter-category-header\"\n" +
    "       data-ng-click=\"toggleFilter('culture')\"\n" +
    "      >\n" +
    "    <h4>Culture</h4>\n" +
    "\n" +
    "    <p>{{numberOfSelectedFromCategory('culture')}} of {{totalNumberOfCategory('culture')}}</p>\n" +
    "\n" +
    "    <div class=\"filter-category-arrow\"\n" +
    "         ng-click=\"toggleItemSelection(activity)\">\n" +
    "      <span></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"filter-category-body\"\n" +
    "       data-ng-show=\"states.culture.open\"\n" +
    "      >\n" +
    "\n" +
    "    <div class=\"filter-toggle\">\n" +
    "      <div class=\"filter-toggle-show\"\n" +
    "           data-ng-class=\"{active: allSelected()}\"\n" +
    "           data-ng-click=\"selectAllFromCategory('culture')\"\n" +
    "          >\n" +
    "        Select all\n" +
    "      </div>\n" +
    "      <div class=\"filter-toggle-hide\"\n" +
    "           data-ng-class=\"{active: noneSelected()}\"\n" +
    "           data-ng-click=\"deSelectAllFromCategory('culture')\"\n" +
    "          >\n" +
    "        Deselect all\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"innerwrap\">\n" +
    "      <div\n" +
    "          class=\"div-row\"\n" +
    "          ng-repeat=\"category in cultureCategories\"\n" +
    "          >\n" +
    "\n" +
    "        <div data-ng-if=\"$index % 2 === 0\">\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"cultureCategories[$index+0]\"\n" +
    "              ng-class=\"{selected: cultureCategories[$index+0].selected}\"\n" +
    "              ng-click=\"toggleItemSelection(cultureCategories[$index+0])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{cultureCategories[$index+0].name}}\n" +
    "          </div>\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"cultureCategories[$index+1]\"\n" +
    "              ng-class=\"{selected: cultureCategories[$index+1].selected}\"\n" +
    "              ng-click=\"toggleItemSelection(cultureCategories[$index+1])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{cultureCategories[$index+1].name}}\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"filter-category filter-category-wellness\"\n" +
    "     data-ng-class=\"{active: areItemsInThisCategorySelected('wellness'), open: states.wellness.open}\"\n" +
    "    >\n" +
    "  <div class=\"filter-category-header\"\n" +
    "       data-ng-click=\"toggleFilter('wellness')\"\n" +
    "      >\n" +
    "    <h4>Wellness & Relax</h4>\n" +
    "\n" +
    "    <p>{{numberOfSelectedFromCategory('wellness')}} of {{totalNumberOfCategory('wellness')}}</p>\n" +
    "\n" +
    "    <div class=\"filter-category-arrow\">\n" +
    "      <span></span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"filter-category-body\"\n" +
    "       data-ng-show=\"states.wellness.open\"\n" +
    "      >\n" +
    "\n" +
    "    <div class=\"filter-toggle\">\n" +
    "      <div class=\"filter-toggle-show\"\n" +
    "           data-ng-class=\"{active: allSelected()}\"\n" +
    "           data-ng-click=\"selectAllFromCategory('wellness')\"\n" +
    "          >\n" +
    "        Select all\n" +
    "      </div>\n" +
    "      <div class=\"filter-toggle-hide\"\n" +
    "           data-ng-class=\"{active: noneSelected()}\"\n" +
    "           data-ng-click=\"deSelectAllFromCategory('wellness')\"\n" +
    "          >\n" +
    "        Deselect all\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"innerwrap\">\n" +
    "      <div\n" +
    "          class=\"div-row\"\n" +
    "          ng-repeat=\"category in wellnessCategories\"\n" +
    "          >\n" +
    "\n" +
    "        <div data-ng-if=\"$index % 2 === 0\">\n" +
    "          <div\n" +
    "              data-ng-if=\"wellnessCategories[$index+0]\"\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              ng-class=\"{selected: wellnessCategories[$index+0].selected}\"\n" +
    "              ng-click=\"toggleItemSelection(wellnessCategories[$index+0])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{wellnessCategories[$index+0].name}}\n" +
    "          </div>\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"wellnessCategories[$index+1]\"\n" +
    "              ng-class=\"{selected: wellnessCategories[$index+1].selected}\"\n" +
    "              ng-click=\"toggleItemSelection(wellnessCategories[$index+1])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{wellnessCategories[$index+1].name}}\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"filter-toggle\">\n" +
    "  <div class=\"filter-toggle-show\"\n" +
    "       data-ng-class=\"{active: allSelected()}\"\n" +
    "       data-ng-click=\"selectAllCategories()\"\n" +
    "      >Show all\n" +
    "  </div>\n" +
    "  <div class=\"filter-toggle-hide\"\n" +
    "       data-ng-class=\"{active: noneSelected()}\"\n" +
    "       data-ng-click=\"deSelectAllCategories()\"\n" +
    "      >Hide all\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"map-debug\">\n" +
    "  <strong>Map-Debug:</strong>\n" +
    "  <br/>\n" +
    "  <u>Map ZOOM:</u>\n" +
    "  {{ map.zoom }}\n" +
    "  <br/>\n" +
    "  <u>You clicked here:</u>\n" +
    "  <br/>\n" +
    "  \"longitude\": {{ map.clickedMarker.longitude }}\n" +
    "  <br/>\n" +
    "  \"latitude\": {{ map.clickedMarker.latitude }}\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div data-ng-include=\"'login/login_page.tpl.html'\"></div>\n" +
    "\n" +
    "<div\n" +
    "    class=\"map-wrap\"\n" +
    "    windowheight\n" +
    "    >\n" +
    "\n" +
    "  <div class=\"map-searchbar\"\n" +
    "       data-ng-include=\"'views/map/mapsearchbar.html'\">\n" +
    "  </div>\n" +
    "\n" +
    "  <google-map\n" +
    "      center='map.center'\n" +
    "      zoom='map.zoom'\n" +
    "      draggable='true'\n" +
    "      events='map.events'\n" +
    "      >\n" +
    "\n" +
    "    <marker\n" +
    "        ng-repeat=\"m in activities | filter:onlySelected\"\n" +
    "        coords='m'\n" +
    "        click='onMarkerClicked(m)'\n" +
    "        options='markerOptions'\n" +
    "        icon='getMarkerIcon(m)'\n" +
    "        >\n" +
    "      <window\n" +
    "          show=\"m.showWindow\"\n" +
    "          closeClick=\"m.closeClick()\"\n" +
    "          >\n" +
    "        <div\n" +
    "            class=\"window-category-{{m.category}}\"\n" +
    "            >\n" +
    "          <h4>\n" +
    "            <span class=\"icon\"></span>\n" +
    "            {{m.name}}\n" +
    "          </h4>\n" +
    "\n" +
    "          <img src=\"/img/mapicons/piemont.jpg\"\n" +
    "               width=\"100\"\n" +
    "               alt=\"\"/>\n" +
    "\n" +
    "          <h6>Offered by: Piemont Travel Office</h6>\n" +
    "\n" +
    "          <p>The season lasts from march to september.\n" +
    "            <br/>\n" +
    "             You can book this venue right here!\n" +
    "          </p>\n" +
    "\n" +
    "          <p class=\"align-right\">\n" +
    "            <a href=\"http://www.paypal.com\"\n" +
    "               target=\"_blank\"\n" +
    "               class=\"btn\">Book now\n" +
    "            </a>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </window>\n" +
    "      <marker-label content=\"m.name\"\n" +
    "                    anchor=\"22 0\"\n" +
    "                    class=\"marker-labels marker-label-category-{{m.category}}\"\n" +
    "          />\n" +
    "    </marker>\n" +
    "\n" +
    "  </google-map>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"admininterface\">\n" +
    "  Admininterface block\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"footer footer-startpage\">\n" +
    "  <div class=\"nav-footer\">\n" +
    "    <a href=\"#/legalnotes/\">Contact & Impressum</a>\n" +
    "  </div>\n" +
    "  <div class=\"teaser-section teaser-section-2\">\n" +
    "    <div class=\"teaser-block align-right\">\n" +
    "      <h4>\n" +
    "        <a href=\"#/why/\">Why reActure?</a>\n" +
    "      </h4>\n" +
    "    </div>\n" +
    "    <div class=\"teaser-block align-right\">\n" +
    "      <h4>\n" +
    "        <a href=\"#/workwithus/\">Work with us!</a>\n" +
    "      </h4>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("legalnotes.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("legalnotes.html",
    "<div data-ng-include=\"'views/logo.html'\"></div>\n" +
    "\n" +
    "<p>This is the legalnotes view.</p>\n" +
    "");
}]);

angular.module("login/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/login.html",
    "<!--<div class=\"page\" ng-show=\"!isAuthenticated\">-->\n" +
    "<div class=\"page\" ng-controller=\"LoginPageCtrl\"  ng-show=\"!currentUser.authenticated\">\n" +
    "  <div class=\"authpage\">\n" +
    "    <div class=\"innerwrap\">\n" +
    "\n" +
    "      <form class=\"loginform\" name=\"loginform\" novalidate autocomplete=\"on\"\n" +
    "            action=\"\" method=\"post\" target=\"_self\">\n" +
    "\n" +
    "        <h1>Login</h1>\n" +
    "\n" +
    "        <!--<div ng-show=\"state.confirmed\">\n" +
    "          <p class=\"alert alert-success\">Ihr Benutzerkonto wurde erfolgreich aktiviert.</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"state.alreadyconfirmed\">\n" +
    "          <p class=\"alert\">Ihr Benutzerkonto ist bereits aktiviert worden.</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div data-ng-switch=\"state.autherrortype\">\n" +
    "          <div ng-switch-when=\"invalidcredentials\" class=\"alert alert-error\">\n" +
    "            Bitte überprüfen Sie E-Mail und Passwort.\n" +
    "          </div>\n" +
    "          <div ng-switch-when=\"userupdateerror\" class=\"alert alert-error\">\n" +
    "            Es gab einen Fehler beim Login.\n" +
    "          </div>\n" +
    "          <div ng-switch-when=\"loginerror\" class=\"alert alert-error\">\n" +
    "            Es gab einen Fehler beim Login.\n" +
    "          </div>\n" +
    "          <div ng-switch-when=\"usernotloggedin\" class=\"alert alert-error\">\n" +
    "            Sie sind nicht eingeloggt.\n" +
    "          </div>\n" +
    "          <div ng-switch-when=\"sessionExpired\" class=\"alert alert-error\">\n" +
    "            Bitte loggen Sie sich ein.<br>\n" +
    "            ( Entweder ist Ihre Session abgelaufen, oder Sie waren noch nicht angemeldet. )\n" +
    "          </div>\n" +
    "        </div>  -->\n" +
    "\n" +
    "        <p>\n" +
    "          <label>E-Mail</label>\n" +
    "          <input name=\"username\" ng-model=\"form.username\" class=\"input-block-level\" required autofocus>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <label>Passwort</label>\n" +
    "          <input name=\"password\" id=\"password\" type=\"password\" ng-model=\"form.password\" required class=\"input-block-level\">\n" +
    "        </p>\n" +
    "\n" +
    "        <div ng-show=\"state.error\">\n" +
    "          <div class=\"alert alert-error\">{{state.message}}</div>\n" +
    "        </div>\n" +
    "\n" +
    "        <button type=\"submit\" ng-click=\"login()\">Anmelden</button>\n" +
    "\n" +
    "      </form>\n" +
    "\n" +
    "    <!--  <div class=\"buttonbar\">\n" +
    "        <a ng-click=\"register()\">Jetzt kostenlos registrieren</a>\n" +
    "      </div>      -->\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    " <!-- <div class=\"communication-element\" ng-include=\"'communication.tpl.html'\"></div> -->\n" +
    "\n" +
    "</div>");
}]);

angular.module("logo.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("logo.html",
    "<a href=\"/#/\"\n" +
    "   id=\"logo\"\n" +
    "   data-ng-controller=\"LogoCtrl\"\n" +
    "   data-ng-click=\"goToHome()\"\n" +
    "    >\n" +
    "  <span>reActure – Find your activity</span>\n" +
    "</a>");
}]);

angular.module("map/mapsearchbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("map/mapsearchbar.html",
    "<div data-ng-controller=\"MapsearchbarCtrl\">\n" +
    "\n" +
    "  <div class=\"input-group input-group-lg\">\n" +
    "    <input type=\"text\"\n" +
    "           class=\"form-control\">\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <button class=\"btn\"\n" +
    "              type=\"button\">Go!\n" +
    "      </button>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "\n" +
    "  <label>from</label>\n" +
    "  <input type=\"text\"\n" +
    "         class=\"form-control\"\n" +
    "         ng-model=\"search.fromDate\"\n" +
    "         data-min-date=\"{{search.minDate}}\"\n" +
    "         placeholder=\"From\"\n" +
    "         bs-datepicker\n" +
    "         autoclose=\"false\"\n" +
    "      >\n" +
    "  <label>until</label>\n" +
    "  <input type=\"text\"\n" +
    "         class=\"form-control\"\n" +
    "         ng-model=\"search.untilDate\"\n" +
    "         data-min-date=\"{{search.fromDate}}\"\n" +
    "         placeholder=\"Until\"\n" +
    "         bs-datepicker\n" +
    "         autoclose=\"false\"\n" +
    "      >\n" +
    "\n" +
    "</div>");
}]);

angular.module("map/templatedinfowindow.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("map/templatedinfowindow.html",
    "<p>This is the map/templatedinfowindow view.</p>\n" +
    "");
}]);

angular.module("why.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("why.html",
    "<div data-ng-include=\"'views/logo.html'\"></div>\n" +
    "\n" +
    "<p>This is the why view.</p>\n" +
    "");
}]);

angular.module("workwithus.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("workwithus.html",
    "<div data-ng-include=\"'views/logo.html'\"></div>\n" +
    "<p>This is the workwithus view.</p>\n" +
    "");
}]);
