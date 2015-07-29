'use strict';

angular.module('anorakApp')
  .directive('downloadAsCsv', function downloadAsCsvFactory() {

    var controller = ["$element", function ($element) {

// prepare CSV data
      var csvData = [];
      csvData.push('"E-Mail","Company","FirstName","LastName"');
      this.providers.forEach(function (item, index, array) {
        csvData.push('"' + item.email + '","' + item.profile.company + '","' + item.profile.firstName + '","' + item.profile.lastName + '"');
      });

// download stuff
      var fileName = "providers.csv";
      var buffer = csvData.join("\n");
      var blob = new Blob([buffer], {
        "type": "application/csv;charset=UTF-8;"
      });
      var link = document.createElement("a");

      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", fileName);
        link.innerHTML = "Export Providers as .CSV";
      } else {
        link.innerHTML = "";
      }

      $element.empty().append(link);

    }];

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        providers: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      template: ''
    };
    return directiveDefinitionObject;
  }
)
;
