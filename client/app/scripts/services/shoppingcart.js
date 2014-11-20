'use strict';

//var assert = function (condition, message) {
//  if (!condition) {
//    console.log('Assertion failed', message);
//    console.trace();
//    throw new Error(message || "Assertion failed");
//  }
//};

angular.module('anorakApp')
  .factory('shoppingcart', function shoppingcart(models, $localStorage) {

    // AngularJS will instantiate a singleton by calling "new" on this function

    var shoppingCart = function (storage) {
      this.storage = storage;
      this.states = {};
    };

    shoppingCart.prototype.add = function (item) {
      assert(item.price !== undefined, "provide a price for the item");

      if (this.storage.theShoppingCart[item.eventId]) {
        this.storage.theShoppingCart[item.eventId].quantity += 1;
        return;
      }

      this.storage.theShoppingCart[item.eventId] = item;
      this.storage.dictCounter += 1;
    };

    shoppingCart.prototype.reset = function () {
      this.storage.theShoppingCart = {};
      this.storage.dictCounter = 0;
    };

    shoppingCart.prototype.add = function (item) {
      assert(item.price !== undefined, "provide a price for the item");

      if (this.storage.theShoppingCart[item.eventId]) {
        this.storage.theShoppingCart[item.eventId].quantity += 1;
        return;
      }

      this.storage.theShoppingCart[item.eventId] = item;
      this.storage.dictCounter += 1;
    };

    shoppingCart.prototype.remove = function (item) {
      delete this.storage.theShoppingCart[item.eventId];
      this.storage.dictCounter -= 1;
    };

    shoppingCart.prototype.getCart = function () {
      return this.storage.theShoppingCart;
    };

    shoppingCart.prototype.getNumberOfItems = function () {
      return this.storage.dictCounter;
    };

    shoppingCart.prototype.getTotal = function () {
      return {
        num: Object.keys(this.storage.theShoppingCart).length,
        price: _.reduce(this.storage.theShoppingCart, function (res, value, key) {
          assert(value.price !== undefined, "price missing for item in the shoppingcart");
          //assert(value.quantity, "quantity missing for item in the shoppingcart");

          return res + value.price * value.quantity;
        }, 0 /* init value */)
      };
    };

    shoppingCart.prototype.checkout = function (paymentToken, profile) {
      var params = [];
      for (var i in this.storage.theShoppingCart) {
        params.push({
          activity: this.storage.theShoppingCart[i].activityId,
          item: this.storage.theShoppingCart[i].bookableItemId,
          event: this.storage.theShoppingCart[i].eventId,
          quantity: this.storage.theShoppingCart[i].quantity
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

    shoppingCart.prototype.getCopy = function () {
      var copy = new shoppingCart({
        theShoppingCart: angular.copy(this.storage.theShoppingCart),
        dictCounter: this.storage.dictCounter
      });

      return copy;
    };

    return new shoppingCart($localStorage.$default({
        theShoppingCart: {},
        dictCounter: 0
      })
    );

  });
