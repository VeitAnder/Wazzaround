angular.module('templates.app', ['account/account.tpl.html', 'account/account_basepagetemplate.tpl.html', 'account/account_payment.tpl.html', 'account/account_tabnav.tpl.html', 'account/password/password_page.tpl.html', 'directives/downloadlink.tpl.html', 'directives/fileuploadcheck.tpl.html', 'directives/fullname.tpl.html', 'directives/roleselector.tpl.html', 'directives/s3uploadform.tpl.html', 'header.tpl.html', 'navbar/navbar.tpl.html', 'projects/activities/_activities_list.tpl.html', 'projects/activities/activities.tpl.html', 'projects/participants/_participants_detail_detail_lock.tpl.html', 'projects/participants/participants_detail_detail.tpl.html', 'projects/participants/participants_detail_page.tpl.html', 'projects/participants/participants_list_page.tpl.html', 'projects/participants/participants_new_detail.tpl.html', 'projects/participants/participants_new_page.tpl.html', 'projects/planlist/planlist.tpl.html', 'projects/plans/_plans_detail_detail_revisioncontent.tpl.html', 'projects/plans/plan_uploadpartial.tpl.html', 'projects/plans/plans_detail_detail.tpl.html', 'projects/plans/plans_detail_page.tpl.html', 'projects/plans/plans_list_page.tpl.html', 'projects/plans/plans_new_detail.tpl.html', 'projects/plans/plans_new_page.tpl.html', 'projects/projects_basepagetemplate.tpl.html', 'projects/projects_list.tpl.html', 'projects/projects_new.tpl.html', 'projecttitle/projecttitle.tpl.html', 'registration/forgotpassword/forgotpassword_page.tpl.html', 'registration/registration_page.tpl.html', 'index.html', 'legalnotes.html', 'login/login.html', 'logo.html', 'map/mapsearchbar.html', 'map/templatedinfowindow.html', 'why.html', 'workwithus.html']);

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

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<div ng-controller=\"HeaderCtrl\">\n" +
    "  <div class=\"navbar-inner\">\n" +
    "\n" +
    "    <div class=\"logo\">\n" +
    "      <a href=\"/#/projects\" ng-show=\"currentUser.isAuthenticated()\"></a>\n" +
    "      <a href=\"/#/login\" ng-hide=\"currentUser.isAuthenticated()\"></a>\n" +
    "    </div>\n" +
    "    <div class=\"loadingicon\">\n" +
    "      <div spinner></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div login-toolbar ng-show=\"currentUser.isAuthenticated()\"></div>\n" +
    "\n" +
    "    <ul class=\"nav pull-right\" ng-show=\"currentUser.isAuthenticated()\">\n" +
    "\n" +
    "      <li>\n" +
    "        <a class=\"supportbar-toggle\" ng-click=\"toggleSupportBar()\">Hilfe</a>\n" +
    "      </li>\n" +
    "\n" +
    "      <li class=\"divider-vertical\"></li>\n" +
    "      <li class=\"dropdown\"\n" +
    "          ng-class=\"{open:isProjectsOpen, inactive: projects.getResolvedProjectsList().length < 1}\"\n" +
    "          ng-mouseleave=\"closeProjectsList()\"\n" +
    "          ng-mouseenter=\"openProjectsList()\">\n" +
    "\n" +
    "        <a class=\"dropdown-toggle\" href=\"/#/projects/\">\n" +
    "          Projekte\n" +
    "          <b ng-class=\"{caret: !isTouch()}\"></b>\n" +
    "        </a>\n" +
    "\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"projectmenu\">\n" +
    "\n" +
    "          <li class=\"dropdown-header\" ng-show=\"myfilteredprojects.length > 0\">\n" +
    "            Meine Projekte\n" +
    "          </li>\n" +
    "          <li ng-repeat=\"project in myfilteredprojects = (projects.getResolvedProjectsList() | isprojectowner) | orderBy:'title' \">\n" +
    "            <a href=\"/#/projects/{{project.$id()}}/plans/\" ng-class=\"{active: project.isCurrentProject()}\">\n" +
    "              <span class=\"projecttitle_list\">{{project.title}}</span>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "          <li class=\"divider\" ng-show=\"myfilteredprojects.length > 0\"></li>\n" +
    "\n" +
    "          <li class=\"dropdown-header\" ng-show=\"filteredprojects.length > 0\">\n" +
    "            Projektbeteiligungen\n" +
    "          </li>\n" +
    "\n" +
    "          <li ng-repeat=\"project in filteredprojects = (projects.getResolvedProjectsList() | isnotprojectowner) | orderBy:'title' \">\n" +
    "            <a href=\"/#/projects/{{project.$id()}}/plans/\" ng-class=\"{active: project.isCurrentProject()}\">\n" +
    "              <span class=\"projecttitle_list\">{{project.title}}</span>\n" +
    "            </a>\n" +
    "          </li>\n" +
    "\n" +
    "          <li class=\"divider\" ng-show=\"filteredprojects.length > 0\"></li>\n" +
    "          <li class=\"dropdown-button\">\n" +
    "            <a class=\"linkbutton\" href=\"/#/projects/new/\">Neues Projekt</a>\n" +
    "          </li>\n" +
    "\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "      <li class=\"divider-vertical\"></li>\n" +
    "\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"supportbar\" ng-show=\"isSupportBarOpen()\">\n" +
    "    <div class=\"table\">\n" +
    "      <div class=\"table_cell left\">\n" +
    "        <form class=\"supportform\">\n" +
    "          <h4>Hilfe-Formular:</h4>\n" +
    "\n" +
    "          <div class=\"form_selection\">\n" +
    "            <span class=\"selection\" ng-class=\"{selected:support.select === 'Fehler melden'}\"\n" +
    "                  ng-click=\"support.select = 'Fehler melden'\">\n" +
    "              <span class=\"checkbox_selection\"></span>Fehler melden</span>\n" +
    "            <span class=\"selection\" ng-class=\"{selected:support.select === 'Wunschfunktion'}\"\n" +
    "                  ng-click=\"support.select = 'Wunschfunktion'\">\n" +
    "              <span class=\"checkbox_selection\"></span>Wunschfunktion</span>\n" +
    "            <span class=\"selection\" ng-class=\"{selected:support.select === 'Frage'}\"\n" +
    "                  ng-click=\"support.select = 'Frage'\">\n" +
    "              <span class=\"checkbox_selection\"></span>Frage</span>\n" +
    "          </div>\n" +
    "\n" +
    "          <span ng-switch on=\"support.select\">\n" +
    "            <label for=\"messagetext\" ng-switch-default>Beschreiben Sie den aufgetretenen Fehler:</label>\n" +
    "            <label for=\"messagetext\" ng-switch-when=\"Wunschfunktion\">Beschreiben Sie Ihre Wunschfunktion:</label>\n" +
    "            <label for=\"messagetext\" ng-switch-when=\"Frage\">Ihre Frage zu Planfred:</label>\n" +
    "          </span>\n" +
    "          <textarea class=\"form_message\" rows=\"5\" id=\"messagetext\" ng-model=\"support.text\"></textarea>\n" +
    "          <span ng-model=\"sendsupport.msg\">\n" +
    "            <div data-ng-switch=\"sendsupport.msg\">\n" +
    "              <div ng-switch-when=\"success\" class=\"alert alert-success\">\n" +
    "                Ihre Supportanfrage wurde erfolgreich versendet.\n" +
    "              </div>\n" +
    "              <div ng-switch-when=\"error\" class=\"alert alert-error\">\n" +
    "                Es gab einen Fehler beim Versenden Ihrer Supportanfrage.\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </span>\n" +
    "\n" +
    "          <button class=\"form_button\" ng-click=\"sendsupport.requestInProgress || sendSupportForm()\">absenden</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "      <div class=\"table_cell right\">\n" +
    "        <h4>Schnelle Hilfe:</h4>\n" +
    "\n" +
    "        <p>Telefon: <a href=\"tel:+43 676 9181996\">+43 676 9181996</a></p>\n" +
    "        <p>E-Mail: <a href=\"mailto:support@planfred.com\">support@planfred.com</a></p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"buttonbar\">\n" +
    "      <a class=\"text_icon_close\" ng-click=\"closeSupportBar()\">schließen\n" +
    "        <span></span>\n" +
    "      </a>\n" +
    "    </div>\n" +
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

angular.module("projects/activities/_activities_list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/activities/_activities_list.tpl.html",
    "<div class=\"activitylistheader\">\n" +
    "  <div class=\"description cell first\">Beschreibung</div>\n" +
    "  <div class=\"time cell last\">Zeitpunkt</div>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "<li class=\"activity\" ng-repeat=\"activity in activities | filter:query.searchText | orderBy:'-date' track by $id(activity)\"\n" +
    "    ng-animate=\"{enter: 'repeat-enter', leave: 'repeat-leave', move: 'repeat-move'}\">\n" +
    "\n" +
    "<div data-ng-switch=\"activity.action\">\n" +
    "\n" +
    "<div ng-switch-when=\"postplan\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    hat einen neuen Plan\n" +
    "    <a href=\"/#/projects/{{activity.projectid}}/plans/{{activity.doc._id}}\"><strong>{{activity.doc.name}}, {{activity.doc.content}}</strong></a>\n" +
    "    erstellt.\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putplanphase\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat die Planungsphase von Plan\n" +
    "      <a href=\"/#/projects/{{activity.projectid}}/plans/{{activity.doc.plan_id}}\"><strong>„{{activity.doc.plan.name}}, {{activity.doc.plan.content}}“</strong></a>\n" +
    "      von „{{currentproject.getPhaseTagLabelById(activity.doc.originalplan.phasetag)}}“ auf\n" +
    "      <strong>„{{currentproject.getPhaseTagLabelById(activity.doc.plan.phasetag)}}“</strong>\n" +
    "      geändert.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putplanname\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat den Plan „{{activity.doc.originalplan.name}}, {{activity.doc.originalplan.content}}“ auf\n" +
    "      <a href=\"/#/projects/{{activity.projectid}}/plans/{{activity.doc.plan._id}}\">{{activity.doc.plan.name}}, {{activity.doc.plan.content}}</a>\n" +
    "      umbenannt.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putparticipantcompany\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat die Firma des Beteiligten\n" +
    "      <span class=\"actor\">\n" +
    "        <div fullname user=\"activity.doc.user\"></div>\n" +
    "      </span>\n" +
    "    </span>\n" +
    "    auf <strong>„{{activity.doc.company}}“</strong> geändert.</span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putparticipantname\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat den Namen des Beteiligten\n" +
    "      <span class=\"actor\">\n" +
    "        <div fullname user=\"activity.doc.user\"></div>\n" +
    "      </span>\n" +
    "    </span>\n" +
    "    auf <strong>„{{activity.doc.firstname}} {{activity.doc.lastname}}“</strong> geändert.</span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putparticipantrole\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat die Rolle des Beteiligten\n" +
    "      <span class=\"actor\">\n" +
    "        <span class=\"actor\">\n" +
    "          <div fullname user=\"activity.doc.user\"></div>\n" +
    "        </span>\n" +
    "      </span>\n" +
    "      auf <strong><span ng-repeat=\"roleElement in activity.doc.roles\">„{{roleElement.role}}“ </span></strong> geändert.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"postplanrevision\" class=\"{{activity.action}}\" ng-init=\"getRevision(activity)\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat zum Plan\n" +
    "      <strong>„{{activity.doc.plan.name}}, {{activity.doc.plan.content}}“</strong>\n" +
    "      eine neue\n" +
    "      <a href=\"/#/projects/{{activity.projectid}}/plans/{{activity.doc.plan._id}}\"><strong> Revision (#{{activity.getPlanRevisionIndex()}})</strong></a>\n" +
    "      hochgeladen.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"postproject\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat dieses Projekt\n" +
    "      erstellt und ist der Projektinhaber.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putprojecttitle\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat den Projekttitel auf\n" +
    "      <strong>„{{activity.doc.title}}“</strong>\n" +
    "      geändert.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"postprojectinvitation\" class=\"{{activity.action}}\" ng-init=\"getProject(activity.projectid)\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat\n" +
    "      <div fullname user=\"activity.doc\"></div>\n" +
    "      zum Projekt\n" +
    "      <a href=\"/#/projects/{{activity.projectid}}/plans/\">{{title}}</a>\n" +
    "      eingeladen.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"getplanrevisionpdf\" class=\"filedownload\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat die Druck-Datei <strong>„{{activity.doc.revision.pdf_file.filename}}“</strong> von Plan\n" +
    "      <a href=\"/#/projects/{{activity.doc.plan.projectid}}/plans/{{activity.doc.plan._id}}/\"><strong>{{activity.doc.plan.name}}, {{activity.doc.plan.content}} (Revision #{{activity.doc.revision.revisionindex}})</strong></a>\n" +
    "      heruntergeladen.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"getplanrevisiondwg\" class=\"filedownload\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat die CAD-Datei <strong>„{{activity.doc.revision.dwg_file.filename}}“</strong> von Plan\n" +
    "      <a href=\"/#/projects/{{activity.doc.plan.projectid}}/plans/{{activity.doc.plan._id}}/\"><strong>{{activity.doc.plan.name}}, {{activity.doc.plan.content}} (Revision #{{activity.doc.revision.revisionindex}})</strong></a>\n" +
    "      heruntergeladen.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"putprojectparticipantenabled\" class=\"putprojectparticipantenabled\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"text\">hat den Beteiligten\n" +
    "      <span class=\"actor\">\n" +
    "        <div fullname user=\"activity.doc.user\"></div>\n" +
    "      </span>\n" +
    "\n" +
    "      <span ng-if=\"activity.doc.enabled == true\">\n" +
    "        aktiviert.\n" +
    "      </span>\n" +
    "\n" +
    "      <span ng-if=\"activity.doc.enabled == false\">\n" +
    "        deaktiviert.\n" +
    "      </span>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"sendrevision\" class=\"{{activity.action}}\" ng-show=\"activity.doc.plan && activity.doc.revision\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\"> hat den Plan\n" +
    "      <a href=\"/#/projects/{{activity.doc.plan.projectid}}/plans/{{activity.doc.plan._id}}/\"><strong>{{activity.doc.plan.name}}, {{activity.doc.plan.content}} (Revision #{{activity.doc.revision.revisionindex}})</strong></a>\n" +
    "      an folgende Personen versendet:\n" +
    "      <span ng-repeat=\"recipient in activity.doc.recipients\">\n" +
    "        <div fullname user=\"recipient\"></div>\n" +
    "        <span ng-show=\"activity.doc.recipients.length > 1 && !$last\">,</span>\n" +
    "      </span>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-when=\"postrole\" class=\"{{activity.action}}\">\n" +
    "  <div class=\"cell first icon_cell\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "  </div>\n" +
    "  <div class=\"cell_wrap cell description\">\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\"> hat zum Projekt\n" +
    "      <span ng-if=\"activity.doc.newroles.length === 1\">die Rolle <strong>\"{{activity.doc.newroles[0].role}}\"</strong> hinzugefügt.</span>\n" +
    "      <span ng-if=\"activity.doc.newroles.length > 1\">die Rollen <strong><span ng-repeat=\"roleElement in activity.doc.newroles\">\"{{roleElement.role}}\" </span></strong>hinzugefügt.</span>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-switch-default class=\"defaultaction\">\n" +
    "  unstyled action key: {{activity.action}}\n" +
    "  <br><br>\n" +
    "  activity log object: {{activity}}\n" +
    "  <div class=\"cell_wrap cell first\">\n" +
    "    <span class=\"icon\"></span>\n" +
    "    <span class=\"actor\">\n" +
    "      <div fullname user=\"activity.user\"></div>\n" +
    "    </span>\n" +
    "    <span class=\"text\">hat das Dokument {{activity}} -x- {{activity.doc}} aktualisiert.</span>\n" +
    "  </div>\n" +
    "  <div class=\"time cell last\">{{activity.date | fromNow}}</div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("projects/activities/activities.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/activities/activities.tpl.html",
    "<div class=\"headerbar\">\n" +
    "  <div class=\"textsearch\">\n" +
    "    <form method=\"get\">\n" +
    "      <label for=\"id_q\">Suche:</label>\n" +
    "      <input type=\"text\" name=\"q\" id=\"id_q\" ng-model=\"query.searchText\" required />\n" +
    "      <a class=\"delete\" ng-click=\"query.searchText = '' \"><span>Suchfeld löschen</span></a>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "  <div class=\"searchhits\">\n" +
    "    {{ (activities | filter: query.searchText).length }} Treffer\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"activities\">\n" +
    "  <div class=\"result\">\n" +
    "    <div data-ng-include=\"'projects/activities/_activities_list.tpl.html'\"></div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projects/participants/_participants_detail_detail_lock.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/_participants_detail_detail_lock.tpl.html",
    "\n" +
    "<div class=\"participant_state_block\" ng-hide=\"participant.enabled\">\n" +
    "  <a class=\"participant_lock locked\" ng-click=\"enable()\" ng-class=\"{unauthorized : !isUserAllowedToEditParticipant || !isUserAllowedToDisableUser}\">\n" +
    "    <span class=\"button\">Beteiligten aktivieren</span>\n" +
    "    <span class=\"icon_lock\"></span>\n" +
    "    gesperrt\n" +
    "  </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"participant_state_block\" ng-show=\"participant.enabled\">\n" +
    "  <a class=\"participant_lock\" ng-click=\"disable()\" ng-class=\"{unauthorized : !isUserAllowedToEditParticipant || !isUserAllowedToDisableUser}\">\n" +
    "    <span class=\"button\">Beteiligten sperren</span>\n" +
    "    <span class=\"icon_lock\"></span>\n" +
    "  </a>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("projects/participants/participants_detail_detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/participants_detail_detail.tpl.html",
    "<div class=\"participant_detail\">\n" +
    "\n" +
    "<!--Participantname-->\n" +
    "<div class=\"detail_header\">\n" +
    "  <span class=\"name\" ng-show=\"participant.user.profile.firstName || participant.user.profile.lastName\">{{participant.user.email}} ({{participant.user.profile.firstName}} {{participant.user.profile.lastName}})</span>\n" +
    "  <span class=\"name\" ng-hide=\"participant.user.profile.firstName || participant.user.profile.lastName\">{{participant.user.email}}</span>\n" +
    "</div>\n" +
    "\n" +
    "<!--Participantname Ende-->\n" +
    "\n" +
    "<div class=\"participant_info detail_body\">\n" +
    "\n" +
    "  <div ng-hide=\"isUserAllowedToEditParticipant\">\n" +
    "    <p class=\"alert alert-large\">\n" +
    "      Sie sind nicht berechtigt Beteiligte zu bearbeiten.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"detail_body_innerwrap\">\n" +
    "    <div class=\"table detail_body_content\">\n" +
    "      <div class=\"table_cell left\">\n" +
    "\n" +
    "        <div ng-controller=\"ParticipantsDetailEditNameCtrl\">\n" +
    "\n" +
    "          <div ng-hide=\"state.showeditform\">\n" +
    "\n" +
    "            <div class=\"input_toggle\">\n" +
    "              <span class=\"input_label\">Name:</span>\n" +
    "              <span class=\"input_noedit\" ng-click=\"edit()\">{{participant.firstname}} {{participant.lastname}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"buttonbar\">\n" +
    "              <a class=\"edit\" ng-click=\"edit()\" ng-class=\"{unauthorized : !isUserAllowedToEditParticipant}\">Name\n" +
    "                ändern\n" +
    "              </a>\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "          <form name=\"valForm\"\n" +
    "                ng-show=\"state.showeditform\"\n" +
    "                novalidate\n" +
    "                ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "            <div class=\"input_toggle\">\n" +
    "              <p>\n" +
    "                <label for=\"firstname\">Vorname:</label>\n" +
    "                <input type=\"text\" ng-model=\"participant.firstname\" name=\"firstname\" id=\"firstname\" placeholder=\"Vorname eingeben\">\n" +
    "              </p>\n" +
    "              <p>\n" +
    "                <label for=\"lastname\">Nachname:</label>\n" +
    "                <input type=\"text\" ng-model=\"participant.lastname\" name=\"lastname\" id=\"lastname\" placeholder=\"Nachname eingeben\">\n" +
    "              </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"buttonbar\">\n" +
    "              <button class=\"confirm\"\n" +
    "                      ui-keypress=\"{13:'updateName()'}\"\n" +
    "                      ng-click=\"updateName()\"\n" +
    "                      ng-disabled=\"valForm.$invalid\">\n" +
    "                speichern\n" +
    "              </button>\n" +
    "              <a class=\"cancel\" ng-click=\"cancel()\">abbrechen</a>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "          </form>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-controller=\"ParticipantsDetailEditCompanyCtrl\">\n" +
    "\n" +
    "          <div ng-hide=\"state.showeditform\">\n" +
    "\n" +
    "            <div class=\"input_toggle\">\n" +
    "              <span class=\"input_label\">Firma:</span>\n" +
    "              <span class=\"input_noedit\" ng-click=\"edit()\">{{participant.company}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"buttonbar\">\n" +
    "              <a class=\"edit\" ng-click=\"edit()\" ng-class=\"{unauthorized : !isUserAllowedToEditParticipant}\">Firma\n" +
    "                ändern\n" +
    "              </a>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <form name=\"valForm\"\n" +
    "                ng-show=\"state.showeditform\"\n" +
    "                novalidate\n" +
    "                ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "            <div class=\"input_toggle\">\n" +
    "              <label for=\"company\">Firma:</label>\n" +
    "              <input type=\"text\" name=\"company\" id=\"company\" ng-model=\"participant.company\" placeholder=\"Firma eingeben\" required/>\n" +
    "            </div>\n" +
    "            <div class=\"buttonbar\">\n" +
    "              <button class=\"confirm\"\n" +
    "                      ui-keypress=\"{13:'updateCompany()'}\"\n" +
    "                      ng-click=\"updateCompany()\"\n" +
    "                      ng-disabled=\"valForm.$invalid\">\n" +
    "                speichern\n" +
    "              </button>\n" +
    "              <a class=\"cancel\" ng-click=\"cancel()\">abbrechen</a>\n" +
    "            </div>\n" +
    "\n" +
    "          </form>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-controller=\"ParticipantsDetailEditRoleCtrl\">\n" +
    "\n" +
    "          <!--@TODO replace ng-switch with ng-show and ng-hide-->\n" +
    "\n" +
    "          <div ng-switch=\"state.showeditform\">\n" +
    "\n" +
    "            <div class=\"role show\" ng-switch-when=\"false\">\n" +
    "              <span class=\"input_label\">Rolle:</span>\n" +
    "\n" +
    "              <div class=\"role_tags\">\n" +
    "                <span class=\"role_tag\"\n" +
    "                      ng-repeat=\"role in participant.roles\">{{role.role}}</span>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"buttonbar\">\n" +
    "                <a class=\"edit\" ng-click=\"edit()\" ng-class=\"{unauthorized : !isUserAllowedToEditParticipant}\">Rolle ändern\n" +
    "                </a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"role\" ng-switch-when=\"true\">\n" +
    "              <span class=\"input_label\">Rolle:</span>\n" +
    "\n" +
    "              <!--<div roleselector roleselectionlist=\"roleselectionlist\" onselect=\"updateRoleList()\" multiselect=\"false\"></div>-->\n" +
    "              <div roleselector rolesinproject=\"rolesinproject\" participantroles=\"participantroles\" onselect=\"onRoleSelect(selectionresults)\" multiselect=\"false\"></div>\n" +
    "\n" +
    "              <div class=\"buttonbar\">\n" +
    "                <button class=\"confirm\"\n" +
    "                        ng-click=\"updateRole()\">\n" +
    "                  speichern\n" +
    "                </button>\n" +
    "                <a class=\"cancel\" ng-click=\"cancel()\">abbrechen</a>\n" +
    "              </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"table_cell right\">\n" +
    "        <div class=\"participant_loggedin\" ng-show=\"participant.user.alreadyloggedin\">\n" +
    "          <span class=\"time\">{{participant.user.lastlogindate | fromNow}}</span>\n" +
    "          mit der E-Mail Adresse\n" +
    "          <a href=\"mailto:{{participant.user.email}}\">{{participant.user.email}}</a>\n" +
    "          zuletzt eingeloggt.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"participant_loggedin\" ng-hide=\"participant.user.alreadyloggedin\">\n" +
    "          <a href=\"mailto:{{participant.user.email}}\">{{participant.user.email}}</a>\n" +
    "          hat sich noch nie in Planfred eingeloggt.\n" +
    "        </div>\n" +
    "\n" +
    "        <div data-ng-controller=\"ParticipantsDetailEditEnabledStatusCtrl\">\n" +
    "\n" +
    "          <div ng-switch=\"participant.permission\">\n" +
    "\n" +
    "            <div class=\"participant_state_block owner\" ng-switch-when=\"owner\">\n" +
    "              <h4><span class=\"icon_state\"></span>Projekteigentümer</h4>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-when=\"admin\">\n" +
    "              <div ng-include=\"'projects/participants/_participants_detail_detail_lock.tpl.html'\"></div>\n" +
    "              <div class=\"alert\" ng-show=\"!isUserAllowedToDisableUser && isUserAllowedToEditParticipant\">\n" +
    "                Sie können sich nicht selbst aus dem Projekt entfernen.\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-switch-default>\n" +
    "              <div ng-include=\"'projects/participants/_participants_detail_detail_lock.tpl.html'\"></div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"user_activity\">\n" +
    "\n" +
    "  <div ng-if=\"show.activities\">\n" +
    "    <h4>Aktivitäten von\n" +
    "      <span class=\"name\" ng-show=\"participant.user.profile.firstName || participant.user.profile.lastName\">{{participant.user.email}} ({{participant.user.profile.firstName}} {{participant.user.profile.lastName}})</span>\n" +
    "      <span class=\"name\" ng-hide=\"participant.user.profile.firstName || participant.user.profile.lastName\">{{participant.user.email}}</span>\n" +
    "    </h4>\n" +
    "\n" +
    "    <div data-ng-include=\"'projects/activities/_activities_list.tpl.html'\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-if=\"!show.activities\"><h4>Derzeit gibt es noch keine Aktivitäten dieses Benutzers.</h4></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"buttonbar align-left\">\n" +
    "  <a ng-click=\"navigateToParticipantsList()\">\n" +
    "    zurück zur Beteiligtenliste\n" +
    "  </a>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("projects/participants/participants_detail_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/participants_detail_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "  <a class=\"backtolist\" data-ng-click=\"navigateToParticipantsList()\">\n" +
    "    <span></span>\n" +
    "    zurück zur Beteiligtenliste\n" +
    "  </a>\n" +
    "</div>\n" +
    "<div class=\"result\">\n" +
    "  <div ng-include=\"'projects/participants/participants_detail_detail.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("projects/participants/participants_list_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/participants_list_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "  <div class=\"textsearch\">\n" +
    "    <form method=\"get\">\n" +
    "      <label for=\"id_q\">Suche:</label>\n" +
    "      <input type=\"text\" name=\"q\" id=\"id_q\" ng-model=\"query.searchText\" required/>\n" +
    "      <a class=\"delete\" ng-click=\"query.searchText = '' \"><span>Suchfeld löschen</span></a>\n" +
    "    </form>\n" +
    "\n" +
    "  </div>\n" +
    "  <div class=\"searchhits\">\n" +
    "    {{ (participantslist | filter:silentParticipant | filter: query.searchText).length }} Treffer\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"result\">\n" +
    "\n" +
    "  <div ng-show=\"isUserAllowedToAddParticipants\">\n" +
    "    <button ng-click=\"gotoNewParticipantsPage()\" class=\"btn_add_participant\">Neuen\n" +
    "      Beteiligten einladen\n" +
    "    </button>\n" +
    "  </div>\n" +
    "  <div ng-hide=\"isUserAllowedToAddParticipants\">\n" +
    "    <p class=\"alert alert-large block\">Sie sind nicht berechtigt neue Beteiligte einzuladen!</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"participantlistheader sortable\">\n" +
    "    <div class=\"participantlist_email cell first\" ng-class=\"{active: orderField == 'email', desc: orderField == 'email' && orderReverse}\" ng-click=\"setOrderField('email')\">E-Mail</div>\n" +
    "    <div class=\"participantlist_name cell\" ng-class=\"{active: orderField == 'lastName', desc: orderField == 'lastName' && orderReverse}\" ng-click=\"setOrderField('lastName')\">Name</div>\n" +
    "    <div class=\"participantlist_company cell\" ng-class=\"{active: orderField == 'company', desc: orderField == 'company' && orderReverse}\" ng-click=\"setOrderField('company')\">Firma</div>\n" +
    "    <div class=\"participantlist_role cell last\" ng-class=\"{active: orderField == 'role', desc: orderField == 'role' && orderReverse}\" ng-click=\"setOrderField('role')\">Rolle (z.B. Architekt, Statiker, …)</div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"participantslisting enable_hover\"\n" +
    "       ng-repeat=\"participant in participantslist | filter:silentParticipant | filter:query.searchText | orderBy:orderByField:orderReverse\"\n" +
    "       ng-animate=\"{enter: 'repeat-enter', leave: 'repeat-leave', move: 'repeat-move'}\">\n" +
    "\n" +
    "    <div class=\"participant\" ng-class=\"{disabled: !participant.enabled, owner: participant.permission === 'owner'}\" data-ng-click=\"navigateToParticipantDetailPage(participant._id)\">\n" +
    "      <div class=\"email cell first\"><span class=\"icon_state\"></span>{{participant.user.email}}</div>\n" +
    "      <div class=\"name cell even\">{{participant.firstname}} {{participant.lastname}}</div>\n" +
    "      <div class=\"company cell\">{{participant.company}}</div>\n" +
    "      <div class=\"role cell even last\">\n" +
    "        <span class=\"role_tag\" ng-repeat=\"role in participant.roles\"> {{role.role}} </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("projects/participants/participants_new_detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/participants_new_detail.tpl.html",
    "<div class=\"newparticipant\" data-ng-controller=\"ParticipantsNewCtrl\">\n" +
    "\n" +
    "  <div class=\"new_participant_detail\">\n" +
    "\n" +
    "    <div class=\"new_participant_form_wrap\">\n" +
    "      <form name=\"valFormInvite\"\n" +
    "            novalidate\n" +
    "            ui-keyup=\"{27: 'cancelInvitation()'}\">\n" +
    "\n" +
    "        <!--Participantname-->\n" +
    "\n" +
    "        <div class=\"detail_header edit_detail_header\">\n" +
    "          <label for=\"email\">E-Mail:</label>\n" +
    "          <input type=\"email\" name=\"email\" id=\"email\" ng-model=\"newparticipant.email\" placeholder=\"E-Mail Adresse\" required email-not-in-project-already>\n" +
    "          <span ng-show=\"showError('email', 'email')\" class=\"alert alert-error\">Bitte geben Sie eine gültige E-Mail Adresse ein.</span>\n" +
    "          <span ng-show=\"showError('email', 'notInProject')\" class=\"alert alert-error\">Es wurde bereits ein Beteiligter mit dieser E-Mail Adresse zu diesem Projekt eingeladen.</span>\n" +
    "          <span ng-show=\"showError('email', 'required') || (invitestates.submitted && valFormInvite['email'].$pristine)\" class=\"alert\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "        </div>\n" +
    "        <!--Participantname Ende-->\n" +
    "\n" +
    "        <div class=\"participant_info detail_body\">\n" +
    "\n" +
    "          <div class=\"detail_body_innerwrap\">\n" +
    "            <div class=\"table detail_body_content\">\n" +
    "              <div class=\"table_cell left\">\n" +
    "\n" +
    "                <div class=\"input_toggle\">\n" +
    "                  <p>\n" +
    "                    <label>Vorname:</label>\n" +
    "                    <input type=\"text\" ng-model=\"newparticipant.firstname\" name=\"firstname\" placeholder=\"Vorname\">\n" +
    "                    <!--<span ng-show=\"showError('firstName') || (invitestates.submitted && valFormInvite['firstName'].$pristine)\" class=\"alert\">Bitte geben Sie den Vornamen des Beteiligten an.</span>-->\n" +
    "                  </p>\n" +
    "                  <p>\n" +
    "                    <label>Nachname:</label>\n" +
    "                    <input type=\"text\" ng-model=\"newparticipant.lastname\" name=\"lastname\" placeholder=\"Nachname\">\n" +
    "                    <!--<span ng-show=\"showError('lastName') || (invitestates.submitted && valFormInvite['lastName'].$pristine)\" class=\"alert\">Bitte geben Sie den Nachnamen des Beteiligten an.</span>-->\n" +
    "                  </p>\n" +
    "                </div>\n" +
    "                <span class=\"divider\"></span>\n" +
    "                <div class=\"input_toggle\">\n" +
    "                  <p>\n" +
    "                    <label>Firma:</label>\n" +
    "                    <input type=\"text\" ng-model=\"newparticipant.company\" name=\"company\" placeholder=\"Firma\">\n" +
    "                    <!--<span ng-show=\"showError('company') || (invitestates.submitted && valFormInvite['company'].$pristine)\" class=\"alert\">Bitte geben Sie die Firma des Beteiligten an.</span>-->\n" +
    "                  </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"role\">\n" +
    "                  <div class=\"input_label\">Rolle:</div>\n" +
    "                  <div roleselector rolesinproject=\"rolesinproject\" participantroles=\"participantroles\" onselect=\"onRoleSelect(selectionresults)\" multiselect=\"false\"></div>\n" +
    "                  <span class=\"alert\" ng-show=\"invitestates.submitted && invitestates.noroleselected\">Bitte wählen Sie eine Rolle aus oder fügen Sie eine neue passende Rolle hinzu</span>\n" +
    "                </div>\n" +
    "\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"table_cell right\">\n" +
    "                <div class=\"alert alert-info\">Der neue Beteiligte bekommt per E-Mail seine Zugangsdaten und hat somit\n" +
    "                  Zugriff auf das Projekt „{{currentProject.title}}“.\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"buttonbar\">\n" +
    "\n" +
    "          <a class=\"button button-spinner\"\n" +
    "             ng-class=\"{disabled: valFormInvite.$invalid || invitestates.noroleselected || invitestates.requestInProgress}\"\n" +
    "             ng-click=\"inviteParticipant(valFormInvite.$valid)\"\n" +
    "              >\n" +
    "\n" +
    "            <div ng-hide=\"invitestates.requestInProgress\">zum Projekt einladen</div>\n" +
    "            <div class=\"spinner-wrap\" ng-show=\"invitestates.requestInProgress\">\n" +
    "              <div spinner spinnertext=\"Beteiligter wird zum Projekt eingeladen …\" spinnercolor=\"#ffffff\"></div>\n" +
    "            </div>\n" +
    "          </a>\n" +
    "\n" +
    "          <a class=\"cancel\"\n" +
    "             data-ng-click=\"navigateToParticipantsList()\"\n" +
    "             ng-hide=\"invitestates.requestInProgress\"\n" +
    "              >\n" +
    "            abbrechen\n" +
    "          </a>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "      </form>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div data-ng-show=\"invitestates.onsuccess\">\n" +
    "    <p class=\"alert alert-success alert-large\">\n" +
    "      Die Projekteinladung wurde erfolgreich an {{lastinvitedparticipant.email}} versendet.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"alert alert-error alert-large\" data-ng-show=\"invitestates.onerror\" data-ng-switch=\"invite.error\">\n" +
    "    <div ng-switch-when=\"userExists\">Dieser Beteiligte existiert bereits.</div>\n" +
    "    <div ng-switch-default>Es ist ein Fehler aufgetreten. Der Beteiligte konnte nicht eingeladen werden.</div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("projects/participants/participants_new_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/participants/participants_new_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "  <a class=\"backtolist\" data-ng-click=\"navigateToParticipantsList()\">\n" +
    "    <span></span>\n" +
    "    zurück zur Beteiligtenliste\n" +
    "  </a>\n" +
    "</div>\n" +
    "<div class=\"result\">\n" +
    "  <div ng-include=\"'projects/participants/participants_new_detail.tpl.html'\">\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projects/planlist/planlist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/planlist/planlist.tpl.html",
    "<div class=\"headerbar\">\n" +
    "\n" +
    "  <!--<div class=\"planlist_showactivity\" ng-hide=\"bkshowactivitytoggle\">-->\n" +
    "  <!--<a class=\"showinfo\" ng-click=\"bkshowactivitytoggle = !bkshowactivitytoggle;\">-->\n" +
    "  <!--<span></span>-->\n" +
    "  <!--Aktivitäten einblenden-->\n" +
    "  <!--</a>-->\n" +
    "  <!--</div>-->\n" +
    "  <!--<div class=\"planlist_showactivity\" ng-show=\"bkshowactivitytoggle\">-->\n" +
    "  <!--<a class=\"showinfo\" ng-click=\"bkshowactivitytoggle = !bkshowactivitytoggle;\">-->\n" +
    "  <!--<span></span>-->\n" +
    "  <!--Aktivitäten ausblenden-->\n" +
    "  <!--</a>-->\n" +
    "  <!--</div>-->\n" +
    "\n" +
    "  <!--<div class=\"textsearch\">-->\n" +
    "  <!--<form method=\"get\">-->\n" +
    "  <!--<label for=\"id_q\">Suche:</label>-->\n" +
    "  <!--<input type=\"text\" name=\"q\" id=\"id_q\" ng-model=\"query.searchText\" required/>-->\n" +
    "  <!--<a class=\"delete\" ng-click=\"query.searchText = '' \">-->\n" +
    "  <!--<span>Suchfeld löschen</span>-->\n" +
    "  <!--</a>-->\n" +
    "  <!--</form>-->\n" +
    "  <!--</div>-->\n" +
    "  <!--<div class=\"searchhits\">-->\n" +
    "  <!--{{ (activities | filter: query.searchText).length }} Treffer-->\n" +
    "  <!--</div>-->\n" +
    "\n" +
    "  <div class=\"filter_area planlisting role\">\n" +
    "    <div class=\"role_tags edit\">\n" +
    "      <a class=\"role_tag\" ng-class=\"{selected : filter.roles[0] === ''}\" ng-click=\"filter.roles[0] = ''\">Alle anzeigen\n" +
    "      </a>\n" +
    "      <a class=\"role_tag\" ng-class=\"{selected : filter.roles[0] === roleElement.role}\"\n" +
    "         ng-click=\"filter.roles[0] = roleElement.role\"\n" +
    "         ng-repeat=\"roleElement in currentproject.roles\">{{roleElement.role}}\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"result\">\n" +
    "  <button class=\"button_planlist_print\" onClick=\"window.print()\">Planliste drucken</button>\n" +
    "  <h3 class=\"planlist_date\">\n" +
    "    <span ng-hide=\"!filter.roles[0] || filter.roles[0].length === 0\"><strong>{{filter.roles[0]}}</strong>-</span>Planliste\n" +
    "  </h3>\n" +
    "\n" +
    "  <p>vom {{planlistdata.datenow | momentjs:{format: 'DD. MMMM YYYY, H:mm'} }} Uhr</p>\n" +
    "\n" +
    "  <div ng-show=\"filtered.length === 0\" class=\"planlistingmessagebox\">\n" +
    "    <p>Es sind keine Pläne vorhanden.</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-hide=\"filtered.length === 0\">\n" +
    "    <div class=\"planlistingheader\">\n" +
    "      <div class=\"planname cell first\">Plannummer</div>\n" +
    "      <div class=\"index_cell cell\">Index</div>\n" +
    "      <div class=\"plancontent cell\">Planinhalt</div>\n" +
    "      <div class=\"phase cell\">Planphase</div>\n" +
    "      <div class=\"files cell\">Dateien</div>\n" +
    "      <div class=\"uploader cell\">von</div>\n" +
    "      <div class=\"modified cell last\">aktualisiert</div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"planlist\">\n" +
    "\n" +
    "      <div ng-repeat=\"plan in filtered = (sortedPlans | filter: byRole)\">\n" +
    "\n" +
    "        <!-- grouping how to: http://stackoverflow.com/questions/15889246/how-to-separate-groups-in-ng-repeat-->\n" +
    "        <div ng-switch on=\"$first || plan.phasetag != sortedPlans[$index-1].phasetag\">\n" +
    "          <h4 ng-switch-when=\"true\" class=\"group\">{{currentproject.phasetags.at[plan.phasetag].plural}}</h4>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"planlistitem plan\">\n" +
    "          <div class=\"planname cell first\">{{plan.name}}</div>\n" +
    "          <div class=\"index_cell cell even\">\n" +
    "            <span class=\"index\">{{plan.getGetLatestRevision().index}}</span>\n" +
    "          </div>\n" +
    "          <div class=\"plancontent cell\">{{plan.content}}</div>\n" +
    "          <div class=\"phase cell even\">{{currentproject.phasetags.at[plan.phasetag].label}}</div>\n" +
    "          <div class=\"files cell\">\n" +
    "\n" +
    "            <span class=\"file\">\n" +
    "              <span ng-show=\"plan.getGetLatestRevision().pdf_file.filename\" class=\"filepdf label\" >{{plan.getGetLatestRevision().pdf_file.filename | filetypeending}}</span>\n" +
    "              <span ng-show=\"plan.getGetLatestRevision().pdf_file.filename\">{{plan.getGetLatestRevision().pdf_file.filename}}</span>\n" +
    "\n" +
    "              <span ng-show=\"!plan.getGetLatestRevision().pdf_file.filename\" class=\"filepdf label_link disabled\">\n" +
    "                <span class=\"label\">Druck-Datei</span> fehlt\n" +
    "              </span>\n" +
    "\n" +
    "            </span>\n" +
    "\n" +
    "            <span class=\"file\">\n" +
    "              <span ng-show=\"plan.getGetLatestRevision().dwg_file.filename\" class=\"filedwg label\">{{plan.getGetLatestRevision().dwg_file.filename | filetypeending}}</span>\n" +
    "              <span ng-show=\"plan.getGetLatestRevision().dwg_file.filename\">{{plan.getGetLatestRevision().dwg_file.filename}}</span>\n" +
    "\n" +
    "              <span ng-show=\"!plan.getGetLatestRevision().dwg_file.filename\" class=\"filedwg label_link disabled\">\n" +
    "                <span class=\"label\">CAD-Datei</span> fehlt\n" +
    "              </span>\n" +
    "\n" +
    "            </span>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"uploader cell even\">\n" +
    "            <div class=\"uploader_name\">\n" +
    "              <span ng-show=\"plan.getGetLatestRevision().createdby.profile.company\">\n" +
    "                {{plan.getGetLatestRevision().createdby.profile.company}}\n" +
    "              </span>\n" +
    "              <span ng-hide=\"plan.getGetLatestRevision().createdby.profile.company\">\n" +
    "                {{plan.getGetLatestRevision().createdby.email}}\n" +
    "              </span>\n" +
    "            </div>\n" +
    "            <div class=\"role_tag\" ng-repeat=\"roleElement in plan.getGetLatestRevision().creator_roles\">{{roleElement.role}}</div>\n" +
    "          </div>\n" +
    "\n" +
    "          <!--<div class=\"uploader cell even\">-->\n" +
    "          <!--<span ng-show=\"plan.getGetLatestRevision().createdby.profile.company\">-->\n" +
    "          <!--{{plan.getGetLatestRevision().createdby.profile.company}}-->\n" +
    "          <!--</span>-->\n" +
    "          <!--<span ng-hide=\"plan.getGetLatestRevision().createdby.profile.company\">-->\n" +
    "          <!--{{plan.getGetLatestRevision().createdby.email}}-->\n" +
    "          <!--</span>-->\n" +
    "          <!--</div>-->\n" +
    "          <div class=\"modified cell last\">{{plan.modified | momentjs:{format: 'DD.MM.YYYY'} }}<br/>{{plan.modified | momentjs:{format: 'H:mm'} }} Uhr\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <!--<div class=\"planlistitem_activity\" ng-show=\"bkshowactivitytoggle\">-->\n" +
    "      <!--<div class=\"participants_revision_sent cell first\">-->\n" +
    "      <!--<span class=\"inline_hl h6\">Versendet an:</span>-->\n" +
    "      <!--bk@anorak.io, ms@anorak.io, dd@medienagentur.com, klausi@damn.it-->\n" +
    "      <!--</div>-->\n" +
    "      <!--<div class=\"participants_revision_downloaded cell last\">-->\n" +
    "      <!--<span class=\"inline_hl h6\">Heruntergeladen von:</span>-->\n" +
    "      <!--bk@anorak.io, ms@anorak.io, dd@medienagentur.com, klausi@damn.it-->\n" +
    "      <!--</div>-->\n" +
    "      <!--</div>-->\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("projects/plans/_plans_detail_detail_revisioncontent.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/_plans_detail_detail_revisioncontent.tpl.html",
    "<div class=\"table_cell left\">\n" +
    "\n" +
    "  <div class=\"table indexfiles\">\n" +
    "    <div class=\"table_cell first\">\n" +
    "      <div class=\"index\">\n" +
    "        <span class=\"index_txt\">Index</span>\n" +
    "        <span class=\"index_nr\">{{revision.index}}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"table_cell last files\">\n" +
    "\n" +
    "      <div ng-show=\"isFileInRevision(revision, 'pdf')\" class=\"file pdf\">\n" +
    "        <a class=\"filepdf label_link\" ng-click=\"downloadRevision(revision, 'pdf', true)\">\n" +
    "          <span class=\"label\">{{revision.pdf_file.filename | filetypeending}}</span> Download\n" +
    "        </a>\n" +
    "\n" +
    "        <div downloadlink downloadrevision=\"downloadRevision(revision, 'pdf', true)\" type=\"pdf\" update=\"true\" filename=\"{{revision.pdf_file.filename}}\" planid=\"{{plan._id}}\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-hide=\"isFileInRevision(revision, 'pdf')\" class=\"file pdf\">\n" +
    "        <a class=\"filepdf label_link disabled\">\n" +
    "          <span class=\"label\">Druck-Datei</span> fehlt\n" +
    "        </a>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"isFileInRevision(revision, 'dwg')\" class=\"file dwg\">\n" +
    "        <a class=\"filedwg label_link\" ng-click=\"downloadRevision(revision, 'dwg', true)\">\n" +
    "          <span class=\"label\">{{revision.dwg_file.filename | filetypeending}}</span> Download\n" +
    "        </a>\n" +
    "\n" +
    "        <div downloadlink downloadrevision=\"downloadRevision(revision, 'dwg', true)\" type=\"dwg\" update=\"true\" filename=\"{{revision.dwg_file.filename}}\" planid=\"{{plan._id}}\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-hide=\"isFileInRevision(revision, 'dwg')\" class=\"file dwg\">\n" +
    "        <a class=\"filedwg label_link disabled\">\n" +
    "          <span class=\"label\">CAD-Datei</span> fehlt\n" +
    "        </a>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <!--<div class=\"table_cell last files\"> end-->\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <span class=\"comment\">Kommentar: {{revision.comment}}</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"table_cell right\">\n" +
    "\n" +
    "  <div class=\"revision_index\">\n" +
    "    <span class=\"index\">Revision #{{revision.revisionindex}} | </span>\n" +
    "    <span class=\"date\">{{revision.created | momentjs:{format: 'DD. MMMM YYYY, H:mm'} }}</span>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"revision_created\">\n" +
    "    <span class=\"created\"> {{revision.created | fromNow }} </span>\n" +
    "    <span class=\"creater\">von\n" +
    "      <div fullname user=\"revision.createdby\"></div>\n" +
    "      hochgeladen.\n" +
    "    </span>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"participants_revision_sent\">\n" +
    "\n" +
    "    <!--SENT PLURAL-->\n" +
    "    <span ng-show=\"allRecipients[revision._id].num > 1\">an\n" +
    "      <a ng-click=\"participant_revisions_sentlist_show = !participant_revisions_sentlist_show\">{{allRecipients[revision._id].num}} Personen</a>\n" +
    "      versendet.\n" +
    "    </span>\n" +
    "\n" +
    "    <!--SENT SINGULAR-->\n" +
    "    <span ng-show=\"allRecipients[revision._id].num == 1\">an\n" +
    "      <a ng-click=\"participant_revisions_sentlist_show = !participant_revisions_sentlist_show\">{{allRecipients[revision._id].num}} Person</a>\n" +
    "      versendet.\n" +
    "    </span>\n" +
    "\n" +
    "    <!--KEIN VERSENDEN ERFOLGT -->\n" +
    "    <span ng-show=\"allRecipients[revision._id].num < 1\">\n" +
    "      wurde noch an keine Person versendet.\n" +
    "    </span>\n" +
    "\n" +
    "    <!-- AKTUELLE REVISION VERSENDET AN -->\n" +
    "    <div class=\"participants_revision_content\" ng-show=\"participant_revisions_sentlist_show\">\n" +
    "      <div class=\"participant_revision\" ng-repeat=\"recipient in revision.activitylog.sendRevision.users\">\n" +
    "        <div class=\"infotext first\">\n" +
    "          an\n" +
    "          <div fullname user=\"recipient\" project=\"currentproject\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"date last\">{{recipient.date | fromNow}}</div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"buttonbar\">\n" +
    "        <a class=\"text_icon_close\" ng-click=\"participant_revisions_sentlist_show = false\">schließen\n" +
    "          <span></span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"participants_revision_downloaded\">\n" +
    "\n" +
    "      <!--DOWNLOAD PLURAL-->\n" +
    "      <span ng-show=\"allDownloads[revision._id].num > 1\">von\n" +
    "        <a ng-click=\"participant_revisions_dowloadlist_show = !participant_revisions_dowloadlist_show\">{{allDownloads[revision._id].num}} Personen</a>\n" +
    "        heruntergeladen.\n" +
    "      </span>\n" +
    "\n" +
    "      <!--DOWNLOAD SINGULAR-->\n" +
    "      <span ng-show=\"allDownloads[revision._id].num == 1\">von\n" +
    "        <a ng-click=\"participant_revisions_dowloadlist_show = !participant_revisions_dowloadlist_show\">{{allDownloads[revision._id].num}} Person</a>\n" +
    "        heruntergeladen.\n" +
    "      </span>\n" +
    "\n" +
    "      <!--KEIN DOWNLOAD-->\n" +
    "      <span ng-show=\"allDownloads[revision._id].num < 1\">\n" +
    "        wurde noch von keiner Person heruntergeladen.\n" +
    "      </span>\n" +
    "\n" +
    "      <!-- DOWNLOADS DER AKTUELLEN REVISION -->\n" +
    "      <div class=\"participants_revision_content\" ng-show=\"participant_revisions_dowloadlist_show\">\n" +
    "        <div class=\"participant_revision\"\n" +
    "             ng-repeat=\"downloader in revision.activitylog.downloadRevision.users\">\n" +
    "\n" +
    "          <div class=\"infotext first\">\n" +
    "            <span class=\"filepdf\" ng-show=\"downloader.action === 'getplanrevisionpdf' \">{{revision.pdf_file.filename | filetypeending}}</span>\n" +
    "            <span class=\"filedwg\" ng-show=\"downloader.action === 'getplanrevisiondwg' \">{{revision.dwg_file.filename | filetypeending}}</span>\n" +
    "            <span class=\"user\">\n" +
    "              von\n" +
    "              <div fullname user=\"downloader.user\"></div>\n" +
    "\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <div class=\"date last\">{{downloader.date | fromNow}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"buttonbar\">\n" +
    "          <a class=\"text_icon_close\" ng-click=\"participant_revisions_dowloadlist_show = false\">schließen\n" +
    "            <span></span>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projects/plans/plan_uploadpartial.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plan_uploadpartial.tpl.html",
    "<div class=\"table uploadnewrevision_content\">\n" +
    "  <div class=\"table_cell left\">\n" +
    "\n" +
    "    <div class=\"index_input\">\n" +
    "      <label>\n" +
    "        <span class=\"index\">\n" +
    "          <span class=\"index_txt\">Index</span>\n" +
    "          <input type=\"text\" name=\"index\" ng-model=\"revision.index\" maxlength=\"2\" required/>\n" +
    "        </span>\n" +
    "        <span ng-if=\"submitted.it === true && valFormNewRevision.index.$error.required\" class=\"alert\">\n" +
    "          Bitte tragen Sie einen Planindex ein\n" +
    "        </span>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"comment_input\">\n" +
    "      <label>Kommentar zur Revision:</label>\n" +
    "      <textarea name=\"comment\" ng-model=\"revision.comment\" rows=\"3\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"table_cell right\">\n" +
    "    <div fileuploadcheck>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("projects/plans/plans_detail_detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plans_detail_detail.tpl.html",
    "<div class=\"plan_detail\" ng-class=\"{uploadcompleted: plan.uploadcompleted}\">\n" +
    "\n" +
    "<!--Planname-->\n" +
    "<div class=\"detail_header \" ng-class=\"{edit_detail_header: editplannameflag}\" ng-controller=\"EditPlanNameCtrl\">\n" +
    "  <div ng-hide=\"editplannameflag\">\n" +
    "    <span class=\"name\">{{plan.name}}, </span>\n" +
    "    <span class=\"plancontent\">{{plan.content}}</span>\n" +
    "    <a class=\"edit\" ng-click=\"editPlanName()\">ändern</a>\n" +
    "  </div>\n" +
    "\n" +
    "  <form ng-show=\"editplannameflag\" name=\"editPlanNameValForm\"\n" +
    "        novalidate\n" +
    "        ui-keypress=\"{27: 'editPlanNameCancel()'}\"\n" +
    "        ui-keypress=\"{13:'updatePlanName()'}\">\n" +
    "\n" +
    "    <div class=\"input_wrap\">\n" +
    "      <label for=\"plannummer\">Plannummer:</label>\n" +
    "      <input type=\"text\" ng-model=\"plan.name\" name=\"name\" placeholder=\"Plannummer\" id=\"plannummer\" required/>\n" +
    "      <span ng-if=\"planform.nameerror && !plan.name\" class=\"alert\">\n" +
    "        Bitte tragen Sie eine Plannummer ein\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"input_wrap last\">\n" +
    "      <label for=\"planinhalt\">Planinhalt:</label>\n" +
    "      <input type=\"text\" ng-model=\"plan.content\" name=\"content\" placeholder=\"Planinhalt\" id=\"planinhalt\" required/>\n" +
    "      <span ng-if=\"planform.contenterror && !plan.content\" class=\"alert\">\n" +
    "        Bitte tragen Sie einen Plantitel ein\n" +
    "      </span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"buttonbar\">\n" +
    "      <button class=\"confirm\" ng-click=\"updatePlanName()\"\n" +
    "              ng-disabled=\"editPlanNameValForm.$invalid\">speichern\n" +
    "      </button>\n" +
    "      <a class=\"cancel\" ng-click=\"editPlanNameCancel()\">abbrechen</a>\n" +
    "    </div>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "<!--Planname-->\n" +
    "\n" +
    "<!--phases-->\n" +
    "<div class=\"phases_wrap\">\n" +
    "\n" +
    "  <!-- PlanPhaseEdit -->\n" +
    "  <div ng-show=\"phase.edit\">\n" +
    "    <div class=\"phases\">\n" +
    "      <span class=\"phase\" ng-repeat=\"phasetag in currentproject.phasetags.at\"\n" +
    "            ng-class=\"{selected: phase.tag === {{$index}}}\" ng-click=\"setPhaseTagIndex($index)\">\n" +
    "        <span class=\"checkbox_phase\"></span> {{phasetag.label}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"buttonbar\">\n" +
    "      <button ng-click=\"updateplanphase.requestInProgress || updatePlanPhase()\">speichern</button>\n" +
    "      <a class=\"cancel\" ng-click=\"cancelUpdatePlanPhase()\">abbrechen</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!-- /PlanPhaseEdit -->\n" +
    "\n" +
    "  <!-- PlanPhaseSelected -->\n" +
    "  <div class=\"phase_selected\" ng-hide=\"phase.edit\">\n" +
    "    <h4>{{getPhaseTagLabel(plan.phasetag)}}</h4>\n" +
    "\n" +
    "    <a class=\"edit\" ng-click=\"phase.edit = true\">ändern</a>\n" +
    "  </div>\n" +
    "  <!-- / PlanPhaseSelected -->\n" +
    "\n" +
    "</div>\n" +
    "<!--phases-->\n" +
    "\n" +
    "<!--upload new revision-->\n" +
    "<div class=\"uploadnewrevision_wrap\" ng-controller=\"NewRevisionCtrl\">\n" +
    "\n" +
    "  <button ng-click=\"openUploadRevisionDialog();\" ng-hide=\"showuploadrevisiondialog\">Neue Revision\n" +
    "    erstellen\n" +
    "  </button>\n" +
    "\n" +
    "  <div ng-switch=\"showuploadrevisiondialog\">\n" +
    "\n" +
    "    <!--ng-switch is a hack to force reset of all child elements and scopes-->\n" +
    "    <div ng-switch-when=\"true\">\n" +
    "\n" +
    "      <div class=\"uploadnewrevision\">\n" +
    "        <form name=\"valFormNewRevision\"\n" +
    "              class=\"newrevisionform\"\n" +
    "              novalidate\n" +
    "              ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "          <div data-ng-include=\"'projects/plans/plan_uploadpartial.tpl.html'\"></div>\n" +
    "          <div class=\"buttonbar\">\n" +
    "\n" +
    "            <a class=\"submit button button-spinner\"\n" +
    "               ui-keypress=\"{13:'addrevision.requestInProgress || addRevision(valFormNewRevision.$valid)'}\"\n" +
    "               ng-click=\"addrevision.requestInProgress || addRevision(valFormNewRevision.$valid)\"\n" +
    "               ng-class=\"{disabled: !valFormNewRevision.$valid || !fileuploadcheck.uploaded || addrevision.requestInProgress}\"\n" +
    "                >\n" +
    "\n" +
    "              <div ng-hide=\"addrevision.requestInProgress\">Revision speichern</div>\n" +
    "              <div class=\"spinner-wrap\" ng-show=\"addrevision.requestInProgress\">\n" +
    "                <div spinner spinnertext=\"Revision wird gespeichert …\" spinnercolor=\"#ffffff\"></div>\n" +
    "              </div>\n" +
    "            </a>\n" +
    "\n" +
    "            <a class=\"text_link\"\n" +
    "               data-ng-click=\"closeUploadRevisionDialog()\"\n" +
    "               ng-hide=\"addrevision.requestInProgress\"\n" +
    "                >\n" +
    "              abbrechen\n" +
    "            </a>\n" +
    "\n" +
    "          </div>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <!--ng-switch-when-->\n" +
    "  </div>\n" +
    "  <!--ng-switch-->\n" +
    "\n" +
    "</div>\n" +
    "<!--upload new revision-->\n" +
    "\n" +
    "<!-- object .planrevision -->\n" +
    "<div class=\"planrevision detail_body\">\n" +
    "  <div class=\"detail_body_innerwrap\">\n" +
    "\n" +
    "    <div\n" +
    "        ng-repeat=\"revision in plan.revisions | orderBy:'created':!reverse \"\n" +
    "        ng-show=\"$first\">\n" +
    "      <div class=\"table detail_body_content\" data-ng-include=\"'projects/plans/_plans_detail_detail_revisioncontent.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "    <!--object .planmailer-->\n" +
    "    <div class=\"planmailer\" ng-class=\"{open: bksendplan.toggle === true}\">\n" +
    "\n" +
    "      <div class=\"planmailer_button_wrap\">\n" +
    "        <a ng-click=\"bksendplan.toggle = !bksendplan.toggle;\"> Plan versenden</a>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"planmailer_content\"\n" +
    "           ng-show=\"bksendplan.toggle && (!emailWasSent.message || emailWasSent.message.length == 0)\">\n" +
    "        <form name=\"mailForm\" id=\"mailForm\"\n" +
    "              ui-keypress=\"{13:'sendrevision.requestInProgress || sendRevision(plan.getGetLatestRevision())'}\">\n" +
    "          <div class=\"table\">\n" +
    "\n" +
    "            <div class=\"table_cell left planmailer_participants\">\n" +
    "              <h5>An Projekt-Beteiligte:</h5>\n" +
    "\n" +
    "              <label class=\"checkbox\" ng-repeat=\"participant in currentproject.participants | filter: isNotSilentUser\" ng-class=\"{disabled : participant.enabled === false}\">\n" +
    "                <input type=\"checkbox\" ng-click=\"toggleReceiver(participant.user.email)\" ng-disabled=\"participant.enabled === false\"/>\n" +
    "                <span class=\"icon_state\" ng-show=\"participant.enabled === false\"></span>\n" +
    "                <span class=\"planmailer_participant\">\n" +
    "                  <div fullname user=\"participant.user\" donotlink=\"true\" alwaysshowemail=\"true\"></div>\n" +
    "\n" +
    "                  <div class=\"role_tag\" ng-repeat=\"role in participant.roles\">{{role.role}}</div>\n" +
    "\n" +
    "                </span>\n" +
    "              </label>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"table_cell right planmailer_emails_add\">\n" +
    "              <h5>An externe E-Mail Adressen:</h5>\n" +
    "\n" +
    "              <label class=\"checkbox\" ng-repeat=\"participant in currentproject.participants | filter: isSilentUser\"\n" +
    "                     ng-hide=\"hide[participant.user.email]\">\n" +
    "                <input type=\"checkbox\" ng-click=\"toggleReceiver(participant.user.email)\"/>\n" +
    "                <span class=\"planmailer_participant\">\n" +
    "                  {{participant.user.email}}\n" +
    "                </span>\n" +
    "                <!--<a class=\"delete\" ng-click=\"removeFromView(participant.user.email)\"><span>entfernen</span></a>-->\n" +
    "              </label>\n" +
    "\n" +
    "              <label class=\"checkbox\" ng-repeat=\"emailAddress in emailAddresses.list\">\n" +
    "                <input type=\"checkbox\" ng-click=\"toggleReceiver(emailAddress)\"\n" +
    "                       ng-checked=\"checkCheckboxOf.list.indexOf(emailAddress) !== -1\"/>\n" +
    "                <span class=\"planmailer_participant\">\n" +
    "                  {{emailAddress}}\n" +
    "                </span>\n" +
    "                <a class=\"delete\" ng-click=\"toggleReceiver(emailAddress);removeFromView(emailAddress);\">\n" +
    "                  <span>entfernen</span>\n" +
    "                </a>\n" +
    "              </label>\n" +
    "\n" +
    "              <div class=\"form-inline planmailer_email_add\">\n" +
    "                <input type=\"email\" ng-model=\"email.address\" name=\"email\" required\n" +
    "                       ui-keypress=\"{13:'mailForm.email.$invalid || addEmailAddress(email.address); $event.stopPropagation();'}\"/>\n" +
    "\n" +
    "                <a class=\"add\" ng-click=\"mailForm.email.$invalid || addEmailAddress(email.address)\"\n" +
    "                   ng-class=\"{invalid : mailForm.email.$invalid}\">\n" +
    "                  <span>hinzufügen</span>\n" +
    "                </a>\n" +
    "\n" +
    "                <span ng-model=\"email.error\" class=\"alert alert-error\"\n" +
    "                      ng-show=\"!mailForm.email.$pristine && mailForm.email.$valid === false && mailForm.email.$error.required === false\">\n" +
    "                  <div data-ng-switch=\"email.error\">\n" +
    "                    <div ng-switch-when=\"invalidAddress\">\n" +
    "                      Bitte geben Sie eine gültige E-Mail Adresse ein.\n" +
    "                    </div>\n" +
    "                    <div ng-switch-when=\"addressExists\">\n" +
    "                      Diese E-Mail Adresse wurde bereits hinzugefügt.\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </span>\n" +
    "                <span class=\"alert\" ng-show=\"!mailForm.email.$pristine && mailForm.email.$error.required === true\">Bitte füllen Sie dieses Feld aus.</span>\n" +
    "\n" +
    "              </div>\n" +
    "\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"alert alert-block alert-norecipienterror\" ng-show=\"sendrevision.norecipienterror && sendTo.list.length == 0\">\n" +
    "            Sie haben noch noch keinen Plan-Empfänger ausgewählt oder hinzugefügt.\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"buttonbar\">\n" +
    "\n" +
    "            <a class=\"button button-spinner\"\n" +
    "               ng-class=\"{disabled: sendrevision.requestInProgress || emailAddresses.list.length === 0 && sendTo.list.length == 0}\"\n" +
    "               ng-click=\"sendRevision(plan.getGetLatestRevision())\"\n" +
    "                >\n" +
    "              <div ng-hide=\"sendrevision.requestInProgress\">Senden</div>\n" +
    "              <div class=\"spinner-wrap\" ng-show=\"sendrevision.requestInProgress\">\n" +
    "                <div spinner spinnertext=\"Plan wird versendet …\" spinnercolor=\"#ffffff\"></div>\n" +
    "              </div>\n" +
    "            </a>\n" +
    "\n" +
    "            <a class=\"cancel\"\n" +
    "               ng-click=\"closeMailForm()\"\n" +
    "               ng-hide=\"sendrevision.requestInProgress\"\n" +
    "                >abbrechen</a>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"afterSendingMessageBox\" ng-show=\"emailWasSent.message\">\n" +
    "\n" +
    "        <div ng-hide=\"emailWasSent.error\" class=\"alert alert-success alert-large\">\n" +
    "          <div ng-switch=\"emailWasSent.message\">\n" +
    "            <div ng-switch-when=\"sentSuccess\">Die Revision wurde erfolgreich an\n" +
    "\n" +
    "              <strong>\n" +
    "              <span ng-repeat=\"recipient in showReceivers.list\">\n" +
    "                <span ng-show=\"showReceivers.list.length > 1 && $index === (showReceivers.list.length - 1) \"><span style=\"font-weight:normal;\">und</span></span>\n" +
    "                <div fullname user=\"recipient\" donotlink=\"true\"></div>\n" +
    "                <span ng-show=\"$index < showReceivers.list.length - 2\"><span style=\"font-weight:normal;\">,</span></span>\n" +
    "              </span>\n" +
    "              </strong>\n" +
    "\n" +
    "              versendet.\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"emailWasSent.error\" class=\"alert alert-error alert-large\">\n" +
    "\n" +
    "          <div ng-switch=\"emailWasSent.message\">\n" +
    "            <div ng-switch-when=\"error\">Es gab einen Fehler beim Versenden der Revision.</div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-if=\"emailWasSent.sendErrors && emailWasSent.sendErrors.length > 0\">\n" +
    "\n" +
    "            <div ng-repeat=\"error in emailWasSent.sendErrors\">\n" +
    "              <span ng-if=\"error.code === 406\">\n" +
    "                An die E-Mail Adresse {{error.email}} kann kein E-Mail versendet werden, da sie keine Mails akzeptiert.\n" +
    "              </span>\n" +
    "              <span ng-if=\"error.code !== 406\">\n" +
    "                Es gab ein Problem beim Senden an {{error.email}}.\n" +
    "              </span>\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-switch=\"emailWasSent.message\">\n" +
    "            <div ng-switch-when=\"error\">Es gab einen Fehler beim Versenden der Revision.</div>\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"buttonbar\">\n" +
    "          <a class=\"text_icon_close\" ng-click=\"emailWasSent.message = ''; bksendplan.toggle = false;\">schließen\n" +
    "            <span></span>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <!--planmailer-->\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "<!-- .planrevision -->\n" +
    "\n" +
    "<!-- old planrevisions-->\n" +
    "<div class=\"planrevisions\">\n" +
    "\n" +
    "  <div class=\"no-revisions\" ng-show=\"plan.revisions.length < 2\">\n" +
    "    <h4>Es sind keine alten Planrevisionen vorhanden.</h4>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"revisions\" ng-show=\"plan.revisions.length > 1\">\n" +
    "    <h4>Alte Planrevisionen:</h4>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"oldplanrevisions_wrap\" ng-show=\"plan.revisions.length > 1\">\n" +
    "    <div class=\"revision_toggle inactive\" ng-hide=\"showallrevisionsflag\">\n" +
    "      <a ng-click=\"showAllRevisions()\">Revisionen anzeigen<b class=\"caret\"></b></a>\n" +
    "    </div>\n" +
    "    <div class=\"revision_toggle active\" ng-show=\"showallrevisionsflag\">\n" +
    "      <a ng-click=\"hideAllRevisions()\">Revisionen verstecken<b class=\"caret\"></b></a>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- .oldplanrevisions_list -->\n" +
    "    <div class=\"oldplanrevisions_list\">\n" +
    "\n" +
    "      <div class=\"oldplanrevisions_wrap\" ng-show=\"showallrevisionsflag\">\n" +
    "\n" +
    "        <!-- .oldplanrevisions_list -->\n" +
    "        <div class=\"oldplanrevisions_list\">\n" +
    "\n" +
    "          <!-- object .planrevision -->\n" +
    "          <div class=\"planrevision detail_body old\"\n" +
    "               ng-repeat=\"revision in plan.revisions | orderBy:'created':!reverse \"\n" +
    "               ng-hide=\"$first\">\n" +
    "            <div class=\"detail_body_innerwrap\">\n" +
    "              <div class=\"table detail_body_content\" data-ng-include=\"'projects/plans/_plans_detail_detail_revisioncontent.tpl.html'\"></div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <!-- .planrevision -->\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- .planrevision -->\n" +
    "\n" +
    "      </div>\n" +
    "      <!-- .oldplanrevisions_list -->\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--old planrevisions-->\n" +
    "\n" +
    "\n" +
    "<div class=\"buttonbar align-left\">\n" +
    "  <a ng-click=\"navigateToPlanList()\">\n" +
    "    zurück zur Listenansicht\n" +
    "  </a>\n" +
    "</div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("projects/plans/plans_detail_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plans_detail_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "\n" +
    "  <a class=\"backtolist\" ng-click=\"navigateToPlanList()\">\n" +
    "    <span></span>\n" +
    "    zur Listenansicht wechseln\n" +
    "  </a>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"result\">\n" +
    "\n" +
    "  <div ng-include=\"'projects/plans/plans_detail_detail.tpl.html'\">\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("projects/plans/plans_list_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plans_list_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "\n" +
    "  <div class=\"phases phases_filter\">\n" +
    "\n" +
    "    <div class=\"phase selectall\" ng-class=\"{selected: whichPhaseTag.idx == currentproject.phasetags.at.length}\"\n" +
    "         ng-click=\"whichPhaseTag.idx = currentproject.phasetags.at.length\" ng-init=\"getNumberOfPlans()\">\n" +
    "      <span class=\"numberoftaggedplans\">{{numOfPlans.all}}</span>\n" +
    "      <span class=\"name\">Alle Pläne</span>\n" +
    "    </div>\n" +
    "    <div class=\"phase\" ng-repeat=\"tag in currentproject.phasetags.at\" ng-click=\"setPhaseTagIdx($index)\"\n" +
    "         ng-class=\"{selected: whichPhaseTag.idx == {{$index}} }\" ng-init=\"getNumberOfPlansForPhasetag($index)\">\n" +
    "      <span class=\"numberoftaggedplans\">{{numOfPlans[$index]}}</span>\n" +
    "      <span class=\"name\">{{tag.plural}}</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"textsearch\">\n" +
    "    <form method=\"get\">\n" +
    "      <label for=\"id_q\">Suche:</label>\n" +
    "      <input type=\"text\" name=\"q\" id=\"id_q\" ng-model=\"query.searchText\" required/>\n" +
    "      <a class=\"delete\" ng-click=\"query.searchText = '' \">\n" +
    "        <span>Suchfeld löschen</span>\n" +
    "      </a>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"filter_area role\">\n" +
    "    <div class=\"role_tags edit\">\n" +
    "      <a class=\"role_tag\" ng-class=\"{selected : filter.roles[0] === ''}\" ng-click=\"filter.roles[0] = ''\">Alle anzeigen</a>\n" +
    "\n" +
    "      <a class=\"role_tag\" ng-class=\"{selected : filter.roles[0] === roleElement.role}\" ng-click=\"filter.roles[0] = roleElement.role\"\n" +
    "         ng-repeat=\"roleElement in currentproject.roles\">{{roleElement.role}}</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"searchhits\">\n" +
    "    {{filtered.length}} Treffer\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"result\">\n" +
    "\n" +
    "  <button class=\"button_new_plan\" ng-click=\"navtonewplan.requestInProgress || navigateToNewPlan()\">Neuen Plan anlegen</button>\n" +
    "\n" +
    "  <div ng-if=\"currentproject.lastrevisionupload\">\n" +
    "    <div class=\"timestamp_plan\">\n" +
    "      <span class=\"text\">… letzte Änderung</span> {{currentproject.lastrevisionupload | fromNow }}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"planlistingheader sortable\" ng-hide=\"filtered == 0\">\n" +
    "\n" +
    "    <div class=\"planname cell first\"\n" +
    "         ng-class=\"{active: orderField == 'name', desc: orderField == 'name' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('name')\">\n" +
    "      Plannummer\n" +
    "    </div>\n" +
    "    <div class=\"index_cell cell\"\n" +
    "         ng-class=\"{active: orderField == 'index', desc: orderField == 'index' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('index')\">\n" +
    "      Index\n" +
    "    </div>\n" +
    "    <div class=\"plancontent cell\"\n" +
    "         ng-class=\"{active: orderField == 'content', desc: orderField == 'content' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('content')\">\n" +
    "      Planinhalt\n" +
    "    </div>\n" +
    "    <div class=\"phase cell\"\n" +
    "         ng-class=\"{active: orderField == 'phase', desc: orderField == 'phase' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('phase')\">\n" +
    "      Planungsphase\n" +
    "    </div>\n" +
    "    <div class=\"file_pdf cell\"\n" +
    "         ng-class=\"{active: orderField == 'files_pdf', desc: orderField == 'files_pdf' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('files_pdf')\">\n" +
    "      Druck\n" +
    "    </div>\n" +
    "    <div class=\"file_dwg cell\"\n" +
    "         ng-class=\"{active: orderField == 'files_dwg', desc: orderField == 'files_dwg' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('files_dwg')\">\n" +
    "      CAD\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"uploader cell\"\n" +
    "         ng-class=\"{active: orderField == 'by', desc: orderField == 'by' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('by')\">\n" +
    "      von\n" +
    "    </div>\n" +
    "    <div class=\"modified cell last\"\n" +
    "         ng-class=\"{active: orderField == 'update', desc: orderField == 'update' && orderReverse}\"\n" +
    "         ng-click=\"setOrderField('update')\">\n" +
    "      aktualisiert\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"planlistingmessagebox no-plans\" ng-show=\"filtered.length === 0\">\n" +
    "    <!-- A query, no phasetag filter, no role filter -->\n" +
    "    <div ng-if=\"query.searchText.length > 0 && whichPhaseTag.idx === currentproject.phasetags.at.length && filter.roles[0].length === 0\">\n" +
    "      <p>Mit dem Suchbegriff „{{query.searchText}}“ konnten keine Pläne gefunden werden.</p>\n" +
    "    </div>\n" +
    "    <!-- A query, no phasetag filter, a role filter -->\n" +
    "    <div ng-if=\"query.searchText.length > 0 && whichPhaseTag.idx === currentproject.phasetags.at.length && filter.roles[0].length > 0\">\n" +
    "      <p>Mit dem Suchbegriff „{{query.searchText}}“ und der Rolle „{{filter.roles[0]}}“ konnten keine Pläne gefunden werden.</p>\n" +
    "    </div>\n" +
    "    <!-- A query, a phasetag filter, no role filter -->\n" +
    "    <div ng-if=\"query.searchText.length > 0 && whichPhaseTag.idx < currentproject.phasetags.at.length && filter.roles[0].length === 0\">\n" +
    "      <p>Mit dem Suchbegriff „{{query.searchText}}“ unter „{{currentproject.phasetags.at[whichPhaseTag.idx].plural}}“ konnten keine Pläne gefunden werden.</p>\n" +
    "    </div>\n" +
    "    <!-- A query, a phasetag filter, a role filter -->\n" +
    "    <div ng-if=\"query.searchText.length > 0 && whichPhaseTag.idx < currentproject.phasetags.at.length && filter.roles[0].length > 0\">\n" +
    "      <p>Mit dem Suchbegriff „{{query.searchText}}“ unter „{{currentproject.phasetags.at[whichPhaseTag.idx].plural}}“ und der Rolle „{{filter.roles[0]}}“ konnten keine Pläne gefunden werde</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- No query, no phasetag filter, no role filter -->\n" +
    "    <div ng-if=\"(!query.searchText || query.searchText.length === 0) && whichPhaseTag.idx === currentproject.phasetags.at.length && filter.roles[0].length === 0\">\n" +
    "      <p>Es sind noch keine Pläne vorhanden</p>\n" +
    "    </div>\n" +
    "    <!-- No query, no phasetag filter, a role filter -->\n" +
    "    <div ng-if=\"(!query.searchText || query.searchText.length === 0) && whichPhaseTag.idx === currentproject.phasetags.at.length && filter.roles[0].length > 0\">\n" +
    "      <p>Für die Rolle „{{filter.roles[0]}}“ sind noch keine Pläne vorhanden.</p>\n" +
    "    </div>\n" +
    "    <!-- No query, a phasetag filter, no role filter -->\n" +
    "    <div ng-if=\"(!query.searchText || query.searchText.length === 0) && whichPhaseTag.idx < currentproject.phasetags.at.length && filter.roles[0].length === 0\">\n" +
    "      <p>Unter „{{currentproject.phasetags.at[whichPhaseTag.idx].plural}}“ sind noch keine Pläne vorhanden.</p>\n" +
    "    </div>\n" +
    "    <!-- No query, a phasetag filter, a role filter -->\n" +
    "    <div ng-if=\"(!query.searchText || query.searchText.length === 0) && whichPhaseTag.idx < currentproject.phasetags.at.length && filter.roles[0].length > 0\">\n" +
    "      <p>Unter „{{currentproject.phasetags.at[whichPhaseTag.idx].plural}}“ sind für die Rolle „{{filter.roles[0]}}“ noch keine Pläne vorhanden.</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"planslisting enable_hover\">\n" +
    "    <div\n" +
    "        ng-repeat=\"plan in filtered = (plans | filter: byPhaseTag | filter: queryPlans:query | filter: byRole | orderBy:orderByField:orderReverse)\">\n" +
    "\n" +
    "      <div class=\"plan\" ng-click=\"navigateToPlanDetail(plan.$id())\">\n" +
    "        <div class=\"planname cell first\">{{plan.name}}</div>\n" +
    "        <div class=\"index_cell cell even\">\n" +
    "          <span class=\"index\">{{plan.getGetLatestRevision().index}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"plancontent cell\">{{plan.content}}</div>\n" +
    "        <div class=\"phase cell even\">{{currentproject.phasetags.at[plan.phasetag].label}}</div>\n" +
    "        <div class=\"files cell\">\n" +
    "          <span class=\"file\">\n" +
    "\n" +
    "            <span ng-show=\"plan.getGetLatestRevision().pdf_file.filename\" class=\"filepdf label\">{{plan.getGetLatestRevision().pdf_file.filename | filetypeending }}</span>\n" +
    "            <span ng-show=\"plan.getGetLatestRevision().pdf_file.filename\">{{plan.getGetLatestRevision().pdf_file.filename}}</span>\n" +
    "\n" +
    "            <span ng-show=\"!plan.getGetLatestRevision().pdf_file.filename\" class=\"filepdf label_link disabled\">\n" +
    "              <span class=\"label\">Druck</span> fehlt\n" +
    "            </span>\n" +
    "\n" +
    "          </span>\n" +
    "\n" +
    "          <span class=\"file\">\n" +
    "            <span ng-show=\"plan.getGetLatestRevision().dwg_file.filename\" class=\"filedwg label\">{{plan.getGetLatestRevision().dwg_file.filename | filetypeending }}</span>\n" +
    "            <span ng-show=\"plan.getGetLatestRevision().dwg_file.filename\">{{plan.getGetLatestRevision().dwg_file.filename}}</span>\n" +
    "\n" +
    "            <span ng-show=\"!plan.getGetLatestRevision().dwg_file.filename\" class=\"filedwg label_link disabled\">\n" +
    "              <span class=\"label\">CAD</span> fehlt\n" +
    "            </span>\n" +
    "\n" +
    "          </span>\n" +
    "        </div>\n" +
    "        <div class=\"uploader cell even\">\n" +
    "          <div class=\"uploader_name\">\n" +
    "            <span ng-show=\"plan.getGetLatestRevision().createdby.profile.company\">\n" +
    "              {{plan.getGetLatestRevision().createdby.profile.company}}\n" +
    "            </span>\n" +
    "            <span ng-hide=\"plan.getGetLatestRevision().createdby.profile.company\">\n" +
    "              {{plan.getGetLatestRevision().createdby.email}}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "          <div class=\"role_tag\" ng-repeat=\"roleElement in plan.getGetLatestRevision().creator_roles\">{{roleElement.role}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"modified cell last\"> {{plan.modified | fromNow }}</div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- ng-switch=\"planview_switch\" end    -->\n" +
    "");
}]);

angular.module("projects/plans/plans_new_detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plans_new_detail.tpl.html",
    "<div class=\"new_plan_detail\" ng-controller=\"PlansNewCtrl\">\n" +
    "\n" +
    "  <div class=\"new_plan_form_wrap\">\n" +
    "    <form name=\"valFormNewRevision\"\n" +
    "          novalidate\n" +
    "          class=\"new_plan_form\"\n" +
    "          ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "      <!--Planname-->\n" +
    "      <div class=\"detail_header edit_detail_header\">\n" +
    "        <div class=\"input_wrap\">\n" +
    "          <label for=\"plannummer\">Plannummer:</label>\n" +
    "          <input type=\"text\" name=\"name\" ng-model=\"plan.name\" placeholder=\"Plannummer\" title=\"Plannummer\" id=\"plannummer\" required/>\n" +
    "          <span ng-show=\"submitted.it && valFormNewRevision.name.$error.required\" class=\"alert\">\n" +
    "            Bitte tragen Sie eine Plannummer ein\n" +
    "          </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"input_wrap last\">\n" +
    "          <label for=\"planinhalt\">Planinhalt:</label>\n" +
    "          <input type=\"text\" name=\"content\" ng-model=\"plan.content\" placeholder=\"Planinhalt\" title=\"Planinhalt\" id=\"planinhalt\" required/>\n" +
    "          <span ng-show=\"submitted.it && valFormNewRevision.content.$error.required\" class=\"alert\">\n" +
    "            Bitte tragen Sie einen Plantitel ein\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <!--Planname Ende-->\n" +
    "\n" +
    "      <!--phases-->\n" +
    "      <div class=\"phases_wrap\">\n" +
    "        <div class=\"phases\">\n" +
    "          <span class=\"phase\" ng-repeat=\"phasetag in currentproject.phasetags.at\" ng-click=\"setPhaseTagIndex($index)\"\n" +
    "                ng-class=\"{selected: whichPhaseTag.idx == {{$index}}}\"><span class=\"checkbox_phase\"></span>{{phasetag.label}}\n" +
    "          </span>\n" +
    "          <span ng-show=\"submitted.it && whichPhaseTag.idx === undefined\" class=\"alert\">\n" +
    "            Bitte wählen Sie eine Planphase aus\n" +
    "          </span>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"new_plan_upload_wrap\">\n" +
    "        <div class=\"new_plan_upload\" data-ng-include=\"'projects/plans/plan_uploadpartial.tpl.html'\"></div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"buttonbar\">\n" +
    "\n" +
    "        <a class=\"submit button button-spinner\"\n" +
    "           ui-keypress=\"{13:'saveplan.requestInProgress || save(valFormNewRevision.$valid);'}\"\n" +
    "           ng-click=\"saveplan.requestInProgress || save(valFormNewRevision.$valid);\"\n" +
    "           ng-class=\"{disabled: valFormNewRevision.$invalid || !fileuploadcheck.uploaded || whichPhaseTag.idx === undefined || saveplan.requestInProgress}\"\n" +
    "            >\n" +
    "\n" +
    "          <div ng-hide=\"saveplan.requestInProgress\">Plan speichern</div>\n" +
    "          <div class=\"spinner-wrap\" ng-show=\"saveplan.requestInProgress\">\n" +
    "            <div spinner spinnertext=\"Plan wird gespeichert …\" spinnercolor=\"#ffffff\"></div>\n" +
    "          </div>\n" +
    "        </a>\n" +
    "\n" +
    "        <a class=\"text_link\"\n" +
    "           data-ng-click=\"navigateToPlanList()\"\n" +
    "           ng-hide=\"saveplan.requestInProgress\"\n" +
    "            >\n" +
    "          abbrechen\n" +
    "        </a>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("projects/plans/plans_new_page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/plans/plans_new_page.tpl.html",
    "<div class=\"headerbar\">\n" +
    "  <a class=\"backtolist\" ng-click=\"navigateToPlanList()\">\n" +
    "    <span></span>\n" +
    "    zur Listenansicht wechseln\n" +
    "  </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"result\">\n" +
    "  <div ng-include=\"'projects/plans/plans_new_detail.tpl.html'\">\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projects/projects_basepagetemplate.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/projects_basepagetemplate.tpl.html",
    "<div class=\"uploadmanager\"></div>\n" +
    "\n" +
    "<div class=\"projectsheetwrap_left\">\n" +
    "  <div class=\"projectsheetwrap_right\">\n" +
    "    <div class=\"projectsheet\">\n" +
    "\n" +
    "      <div data-ng-include=\"'projecttitle/projecttitle.tpl.html'\"></div>\n" +
    "\n" +
    "      <div data-ng-include=\"'navbar/navbar.tpl.html'\"></div>\n" +
    "\n" +
    "      <div class=\"contentlisting\">\n" +
    "        <div class=\"innerwrap\">\n" +
    "          <div data-ng-include=\"getPagePartial()\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projects/projects_list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/projects_list.tpl.html",
    "<div class=\"projectspage\">\n" +
    "  <div class=\"innerwrap\">\n" +
    "    <h1>Projekte</h1>\n" +
    "\n" +
    "      <h3 ng-show=\"myfilteredprojects.length > 0\">Meine Projekte</h3>\n" +
    "      <ul>\n" +
    "        <li ng-repeat=\"project in myfilteredprojects = (projects | isprojectowner) | orderBy:'title' \">\n" +
    "          <a href=\"/#/projects/{{project.$id()}}/plans/\">\n" +
    "            <span class=\"projecttitle_list\">{{project.title}}</span>\n" +
    "            <div ng-if=\"project.lastrevisionupload\">\n" +
    "              <span class=\"timestamp smallest\">{{project.lastrevisionupload | fromNow }} aktualisiert</span>\n" +
    "            </div>\n" +
    "          </a>\n" +
    "\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <h3 ng-show=\"filteredprojects.length > 0\">Projektbeteiligungen</h3>\n" +
    "      <ul>\n" +
    "        <li ng-repeat=\"project in filteredprojects = (projects | isnotprojectowner) | orderBy:'title' \">\n" +
    "          <a href=\"/#/projects/{{project.$id()}}/plans/\">\n" +
    "            <span class=\"projecttitle_list\">{{project.title}}</span>\n" +
    "            <div ng-if=\"project.lastrevisionupload\">\n" +
    "              <span class=\"timestamp smallest\">{{project.lastrevisionupload | fromNow }} aktualisiert</span>\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <a class=\"linkbutton new\" href=\"/#/projects/new/\">Neues Projekt</a>\n" +
    "\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"communication-element\" ng-include=\"'communication.tpl.html'\"></div>\n" +
    "");
}]);

angular.module("projects/projects_new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projects/projects_new.tpl.html",
    "<div class=\"projectsheetwrap_left\">\n" +
    "  <div class=\"projectsheetwrap_right\">\n" +
    "    <div class=\"projectsheet\">\n" +
    "\n" +
    "      <div class=\"projecttitle_new\" ng-hide=\"states.error\">\n" +
    "        <form name=\"valForm\"\n" +
    "              novalidate\n" +
    "              ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "          <div class=\"projecttitle\">\n" +
    "            <span class=\"projecttitle_label\">Mein Projekt:</span>\n" +
    "            <input type=\"text\" name=\"title\" ng-model=\"newproject.title\" placeholder=\"Projekttitel eingeben\" required>\n" +
    "            <span ng-show=\"showError('title', 'required')\" class=\"alert\">Bitte geben Sie einen Projekttitel ein.</span>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"role\">\n" +
    "            <div class=\"input_label\">Meine Rolle im Projekt:</div>\n" +
    "            <div roleselector rolesinproject=\"rolesinproject\" participantroles=\"participantroles\" onselect=\"onRoleSelect(selectionresults)\" multiselect=\"false\"></div>\n" +
    "            <span class=\"alert\" ng-show=\"states.submitted && states.noroleselected\">Bitte wählen Sie Ihre Rolle im Projekt aus oder fügen Sie eine für Sie passende Rolle hinzu</span>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"buttonbar\">\n" +
    "\n" +
    "            <a class=\"submit button button-spinner\"\n" +
    "               ng-class=\"{disabled: !isProjectFormValid() || states.requestInProgress}\"\n" +
    "               ng-click=\"saveProject()\"\n" +
    "                >\n" +
    "              <div ng-hide=\"states.requestInProgress\">Neues Projekt anlegen</div>\n" +
    "              <div class=\"spinner-wrap\" ng-show=\"states.requestInProgress\">\n" +
    "                <div spinner spinnertext=\"Projekt wird angelegt …\" spinnercolor=\"#ffffff\"></div>\n" +
    "              </div>\n" +
    "            </a>\n" +
    "\n" +
    "            <a class=\"cancel\"\n" +
    "               data-ng-click=\"cancel()\"\n" +
    "               ng-hide=\"states.requestInProgress\"\n" +
    "                >\n" +
    "              abbrechen\n" +
    "            </a>\n" +
    "          </div>\n" +
    "\n" +
    "\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"alert alert-error alert-large\" data-ng-show=\"states.error\">\n" +
    "        Es ist ein Fehler aufgetreten. Das Projekt konnte womöglich nicht angelegt werden.\n" +
    "        <br>\n" +
    "        Bitte überprüfen Sie Ihre <a class=\"cancel\" data-ng-click=\"cancel()\"> Projektliste </a>. Falls das von Ihnen angelegte Projekt nicht in der Projektliste aufscheint versuchen Sie es bitte erneut das gewünschte Projekt anzulegen.\n" +
    "      </div>\n" +
    "\n" +
    "      <!--<div ng-show=\"showStartTrailPeriodMsg\">-->\n" +
    "        <!--<div class=\"communication-element communication-element-narrow\">-->\n" +
    "          <!--<h4>Ihr erstes eigenes Projekt!</h4>-->\n" +
    "\n" +
    "          <!--<p>Sobald Sie Ihr erstes Projekt anlegen, beginnt die <strong>-->\n" +
    "            <!--<nobr>2-monatige</nobr>-->\n" +
    "            <!--Testphase.</strong> Falls Sie ab sofort den vollen Planfred-Support nützen wollen, können Sie in Ihrem-->\n" +
    "            <!--<a href=\"/#/account\">Benutzerkonto</a> jederzeit auf eines der Planfred-Modelle umsteigen.-->\n" +
    "          <!--</p>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "      <!--</div>-->\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("projecttitle/projecttitle.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("projecttitle/projecttitle.tpl.html",
    "<div class=\"projecttitle\" ng-controller=\"ProjectTitleCtrl\">\n" +
    "\n" +
    "  <span class=\"projecttitle_label\" data-ng-switch=\"state.isOwner\">\n" +
    "    <span ng-switch-when=\"false\">\n" +
    "      <div fullname user=\"owner.user\"></div>\n" +
    "      s Projekt:\n" +
    "    </span>\n" +
    "    <span ng-switch-default>\n" +
    "      Mein Projekt:\n" +
    "    </span>\n" +
    "  </span>\n" +
    "\n" +
    "  <div class=\"showtitle\" ng-hide=\"state.showeditform\">\n" +
    "    <h1>\n" +
    "      <a class=\"title\">{{project.title}}</a>\n" +
    "    </h1>\n" +
    "\n" +
    "    <a class=\"edit\" ng-class=\"{unauthorized: !state.userIsAllowedToEdit || state.requestInProgress }\" ng-click=\"state.requestInProgress || edit()\"> ändern</a>\n" +
    "  </div>\n" +
    "\n" +
    "  <form name=\"valForm\"\n" +
    "        class=\"edittitle\"\n" +
    "        ng-show=\"state.showeditform\"\n" +
    "        novalidate\n" +
    "        ui-keyup=\"{27: 'cancel()'}\">\n" +
    "\n" +
    "    <input type=\"text\" ng-model=\"project.title\" ui-keypress=\"{13:'state.requestInProgress || save()'}\" required/>\n" +
    "\n" +
    "    <button class=\"confirm\"\n" +
    "            ui-keypress=\"{13:'state.requestInProgress || save()'}\"\n" +
    "            ng-click=\"save()\"\n" +
    "            ng-disabled=\"valForm.$invalid\">\n" +
    "      speichern\n" +
    "    </button>\n" +
    "    <a class=\"cancel\" ng-click=\"cancel()\">abbrechen</a>\n" +
    "\n" +
    "  </form>\n" +
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
    "\n" +
    "\n" +
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
    "            ng-repeat=\"activity in filteredactivitiessports = (activities | filter: onlySports)\"\n" +
    "            >\n" +
    "\n" +
    "          <div data-ng-if=\"$index % 2 === 0\">\n" +
    "            <div\n" +
    "                data-ng-if=\"filteredactivitiessports[$index+0]\"\n" +
    "                class=\"filter-category-sub div-cell\"\n" +
    "                ng-class=\"{selected: !filteredactivitiessports[$index+0].hidden}\"\n" +
    "                ng-click=\"toggleItemSelection(filteredactivitiessports[$index+0])\"\n" +
    "                >\n" +
    "              <span class=\"checkbox inline\"></span>\n" +
    "              {{filteredactivitiessports[$index+0].name}}\n" +
    "            </div>\n" +
    "\n" +
    "            <div\n" +
    "                class=\"filter-category-sub div-cell\"\n" +
    "                data-ng-if=\"filteredactivitiessports[$index+1]\"\n" +
    "                ng-class=\"{selected: !filteredactivitiessports[$index+1].hidden}\"\n" +
    "                ng-click=\"toggleItemSelection(filteredactivitiessports[$index+1])\"\n" +
    "                >\n" +
    "              <span class=\"checkbox inline\"></span>\n" +
    "              {{filteredactivitiessports[$index+1].name}}\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
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
    "          ng-repeat=\"activity in filteredactivitiesculture = (activities | filter: onlyCulture)\"\n" +
    "          >\n" +
    "\n" +
    "        <div data-ng-if=\"$index % 2 === 0\">\n" +
    "          <div\n" +
    "              data-ng-if=\"filteredactivitiesculture[$index+0]\"\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              ng-class=\"{selected: !filteredactivitiesculture[$index+0].hidden}\"\n" +
    "              ng-click=\"toggleItemSelection(filteredactivitiesculture[$index+0])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{filteredactivitiesculture[$index+0].name}}\n" +
    "          </div>\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"filteredactivitiesculture[$index+1]\"\n" +
    "              ng-class=\"{selected: !filteredactivitiesculture[$index+1].hidden}\"\n" +
    "              ng-click=\"toggleItemSelection(filteredactivitiesculture[$index+1])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{filteredactivitiesculture[$index+1].name}}\n" +
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
    "          ng-repeat=\"activity in filteredactivitieswellness = (activities | filter: onlyWellness)\"\n" +
    "          >\n" +
    "\n" +
    "        <div data-ng-if=\"$index % 2 === 0\">\n" +
    "          <div\n" +
    "              data-ng-if=\"filteredactivitieswellness[$index+0]\"\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              ng-class=\"{selected: !filteredactivitieswellness[$index+0].hidden}\"\n" +
    "              ng-click=\"toggleItemSelection(filteredactivitieswellness[$index+0])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{filteredactivitieswellness[$index+0].name}}\n" +
    "          </div>\n" +
    "\n" +
    "          <div\n" +
    "              class=\"filter-category-sub div-cell\"\n" +
    "              data-ng-if=\"filteredactivitieswellness[$index+1]\"\n" +
    "              ng-class=\"{selected: !filteredactivitieswellness[$index+1].hidden}\"\n" +
    "              ng-click=\"toggleItemSelection(filteredactivitieswellness[$index+1])\"\n" +
    "              >\n" +
    "            <span class=\"checkbox inline\"></span>\n" +
    "            {{filteredactivitieswellness[$index+1].name}}\n" +
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
    "            You can book this venue right here!\n" +
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
    "\n" +
    "\n" +
    "  <div data-ng-include=\"'views/login/login.html'\"></div>\n" +
    "\n" +
    "\n" +
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
    "<div class=\"page\" ng-show=\"!isAuthenticated\">\n" +
    "  <div class=\"authpage\">\n" +
    "    <div class=\"innerwrap\">\n" +
    "\n" +
    "      <form class=\"loginform\" name=\"loginform\" novalidate autocomplete=\"on\"\n" +
    "            action=\"{{actionurl}}\" method=\"post\" target=\"_self\">\n" +
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
    "          <input name=\"username\" type=\"email\" ng-model=\"user.email\" required autofocus class=\"input-block-level\">\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <label>Passwort</label>\n" +
    "          <input name=\"password\" id=\"password\" type=\"password\" ng-model=\"user.password\" required class=\"input-block-level\">\n" +
    "        <!--  <a class=\"forgottenpasswordlink\" ng-click=\"forgotPassword()\">Passwort vergessen?</a>-->\n" +
    "        </p>\n" +
    "\n" +
    "        <button type=\"submit\">Anmelden</button>\n" +
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
    "\n" +
    "  <div class=\"input-group input-group-lg\">\n" +
    "    <input type=\"text\" class=\"form-control\">\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <button class=\"btn\" type=\"button\">Go!</button>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "\n" +
    "  from\n" +
    "  <input type=\"text\"\n" +
    "         class=\"form-control\"\n" +
    "         ng-model=\"fromDate\"\n" +
    "         data-max-date=\"{{untilDate}}\"\n" +
    "         placeholder=\"From\"\n" +
    "         bs-datepicker\n" +
    "         autoclose=\"true\"\n" +
    "      >\n" +
    "  till\n" +
    "  <input type=\"text\"\n" +
    "         class=\"form-control\"\n" +
    "         ng-model=\"untilDate\"\n" +
    "         data-min-date=\"{{fromDate}}\"\n" +
    "         placeholder=\"Until\"\n" +
    "         bs-datepicker\n" +
    "         autoclose=\"true\"\n" +
    "      >\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
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
