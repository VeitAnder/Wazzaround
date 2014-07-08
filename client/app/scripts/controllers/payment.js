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
  .controller('PaymentCtrl', function ($scope, models, shoppingcart) {
    var payment = this;

    this.submitEnabled = true;
    this.errorMsg;
    this.bookingId;

    this.readableBookingId;

    var PaymillResponseHandler = function (error, result) {
      if (error) {
        console.log("PaymillResponseHandler error", error);

        payment.errorMsg = error.apierror;
        payment.submitEnabled = true;
        $scope.$apply();

      } else {

        // Output token
        var token = result.token;
        console.log("token", token);

        shoppingcart.checkout(token, payment.profile)
          .then(function(res) {
            console.log("checkout response", res);

            payment.bookingId = res.bookingId;
            payment.readableBookingId = res.bookingId.match(/.{1,4}/g).join("-");

            $scope.$apply();
          })
          .fail(function(err){
            payment.errorMsg = err.message;
            $scope.$apply();
          });
      }
    };

    this.profile = {};
    this.card = {};
    this.amount_int = Math.floor(shoppingcart.getTotal().price * 100);

    this.submitPayment = function (event) {
      console.log("submitPayment", payment.card, payment.profile, shoppingcart.getTotal());

      payment.submitEnabled = false;

      paymill.createToken({
        number: payment.card.number,            // required, ohne Leerzeichen und Bindestriche
        exp_month: payment.card.expiry_month,   // required
        exp_year: payment.card.expiry_year,     // required, vierstellig z.B. "2016"
        cvc: payment.card.cvc,                  // required
        amount_int: payment.amount_int,         // required, integer, z.B. "15" für 0,15 Euro
        currency: 'EUR',                        // required, ISO 4217 z.B. "EUR" od. "GBP"
        cardholder: payment.card.name           // optional
      }, PaymillResponseHandler);    // Antwort vom Server

      return false;
    };
  });
