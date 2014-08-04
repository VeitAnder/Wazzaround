'use strict';

//var assert = function (condition, message) {
//  if (!condition) {
//    console.log('Assertion failed', message);
//    console.trace();
//    throw new Error(message || "Assertion failed");
//  }
//};

angular.module('anorakApp')
  .service('shoppingcart', function shoppingcart(models, $localStorage) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var $storage = $localStorage.$default({
      theShoppingCart: {},
      dictCounter: 0
    });

    // used for ui states that need to be persisted along with shoppingcart data
    this.states = {};

    this.reset = function () {
      $storage.theShoppingCart = {};
      $storage.dictCounter = 0;
    };

    this.add = function (item) {
      assert(item.price !== undefined, "provide a price for the item");

      if ($storage.theShoppingCart[item.eventId]) {
        $storage.theShoppingCart[item.eventId].quantity += 1;
        return;
      }

      $storage.theShoppingCart[item.eventId] = item;
      $storage.dictCounter += 1;
    };

    this.remove = function (item) {
      delete $storage.theShoppingCart[item.eventId];
      $storage.dictCounter -= 1;
    };

    this.getCart = function () {
      return $storage.theShoppingCart;
    };

    this.getNumberOfItems = function () {
      return $storage.dictCounter;
    };

    this.getTotal = function () {
      return {
        num: Object.keys($storage.theShoppingCart).length,
        price: _.reduce($storage.theShoppingCart, function (res, value, key) {
          assert(value.price !== undefined, "price missing for item in the shoppingcart");
          assert(value.quantity, "quantity missing for item in the shoppingcart");

          return res + value.price * value.quantity;
        }, 0 /* init value */)
      };
    };

    this.checkout = function (paymentToken, profile) {
      var params = [];
      for (var i in $storage.theShoppingCart) {
        params.push({
          activity: $storage.theShoppingCart[i].activityId,
          item: $storage.theShoppingCart[i].bookableItemId,
          event: $storage.theShoppingCart[i].eventId,
          quantity: $storage.theShoppingCart[i].quantity
        });
      }

      return models.BookingModel.checkout({
        'bookings': params,
        'payment': {
          'token': paymentToken,
          'amount_int': Math.floor(this.getTotal().price * 100),
          'currency': 'EUR'
        },
        'profile': profile
      });
    };

  });
