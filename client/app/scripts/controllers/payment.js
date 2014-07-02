'use strict';

angular.module('anorakApp')
  .controller('PaymentPageCtrl', function ($scope, $translate) {
    $scope.getPagePartial = function () {
      return 'views/payment.html';
    };

    $scope.lang = $translate.use();
    $scope.$watch(function () {
      return $translate.use();
    }, function () {
      $scope.lang = $translate.use();
    });

  })
    .controller('PaymentCtrl', function ($scope, models) {

    $scope.submitEnabled = true;

    var PaymillResponseHandler = function(error, result) {
      if (error) {
        console.log("error", error);
        // Shows the error above the form
        $(".payment-errors").text(error.apierror);
        $(".submit-button").removeAttr("disabled");
      } else {
        var form = $("#payment-form");
        // Output token
        var token = result.token;
        console.log("token", token);
        // Insert token into form in order to submit to server
        //form.append("");

        models.BookingModel.pay({
          ammount : $scope.ammount,
          paymentToken : token
        });
      }
    };


    $scope.submitPayment = function(event) {
      console.log("submitPayment");

      $scope.submitEnabled = false;

      paymill.createToken({
        number: $('.card-number').val(),  // required, ohne Leerzeichen und Bindestriche
        exp_month: $('.card-expiry-month').val(),   // required
        exp_year: $('.card-expiry-year').val(),     // required, vierstellig z.B. "2016"
        cvc: $('.card-cvc').val(),                  // required
        amount_int: $('.card-amount-int').val(),    // required, integer, z.B. "15" für 0,15 Euro
        currency: $('.card-currency').val(),    // required, ISO 4217 z.B. "EUR" od. "GBP"
        cardholder: $('.card-holdername').val() // optional
      }, PaymillResponseHandler);                   // Antwort vom Server

      return false;
    };
  });
