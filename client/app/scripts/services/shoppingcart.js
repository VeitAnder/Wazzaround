'use strict';

//var assert = function (condition, message) {
//  if (!condition) {
//    console.log('Assertion failed', message);
//    console.trace();
//    throw new Error(message || "Assertion failed");
//  }
//};

angular.module('anorakApp')
  .service('shoppingcart', function shoppingcart(models) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;

    this.theShoppingCart = {};
    this.dictCounter = 0;

    // used for ui states that need to be persisted along with shoppingcart data
    this.states = {};

    this.reset = function() {
      this.theShoppingCart = {};
      this.dictCounter = 0;
    };

    this.add = function (item) {
      var idxOfTheItem = this.dictCounter;

      assert(item.price !== undefined, "provide a price for the item");

      // add item functions
      item.remove = function () {
        delete self.theShoppingCart[idxOfTheItem];
      };

      // increase quantity if item is already in the cart
      for (var i in this.theShoppingCart) {
        // already in card
        if (this.theShoppingCart[i].eventId === item.eventId) {
          this.theShoppingCart[i].quantity += 1;
          return;
        }
      }

      this.theShoppingCart[this.dictCounter] = item;
      this.dictCounter += 1;
    };

    this.getCart = function () {
      return this.theShoppingCart;
    };

    this.getTotal = function () {
      return {
        num: Object.keys(this.theShoppingCart).length,
        price: _.reduce(this.theShoppingCart, function (res, value, key) {
          assert(value.price !== undefined, "price missing for item in the shoppingcart");
          assert(value.quantity, "quantity missing for item in the shoppingcart");

          return res + value.price * value.quantity;
        }, 0 /* init value */)
      };
    };

    this.checkout = function (paymentToken, profile) {
      var params = [];
      for (var i in this.theShoppingCart) {
        params.push({
          activity: this.theShoppingCart[i].activityId,
          item: this.theShoppingCart[i].bookableItemId,
          event: this.theShoppingCart[i].eventId,
          quantity: this.theShoppingCart[i].quantity
        });
      }

      return models.BookingModel.checkout({
        'bookings': params,
        'payment': {
          'token' : paymentToken,
          'amount_int' : Math.floor(this.getTotal().price * 100),
          'currency' : 'EUR'
        },
        'profile' : profile
      });
    };

  });
