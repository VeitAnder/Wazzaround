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

    var theShoppingCart = {};
    var dictCounter = 0;

    // used for ui states that need to be persisted along with shoppingcart data
    this.states = {};

    this.add = function (item) {
      var idxOfTheItem = dictCounter;

      assert(item.price, "provide a price for the item");

      // add item functions
      item.remove = function () {
        delete theShoppingCart[idxOfTheItem];
      };

      // increase quantity if item is already in the cart
      for (var i in theShoppingCart) {
        // already in card
        if (theShoppingCart[i].eventId === item.eventId) {
          theShoppingCart[i].quantity += 1;
          return;
        }
      }

      theShoppingCart[dictCounter] = item;
      dictCounter += 1;
    };

    this.getCart = function () {
      return theShoppingCart;
    };

    this.getTotal = function () {
      return {
        num: Object.keys(theShoppingCart).length,
        price: _.reduce(theShoppingCart, function (res, value, key) {
          assert(value.price, "price missing for item in the shoppingcart");
          assert(value.quantity, "quantity missing for item in the shoppingcart");

          return res + value.price * value.quantity;
        }, 0 /* init value */)
      };
    };

    this.checkout = function () {
      var params = [];
      for (var i in theShoppingCart) {
        params.push({
          activity: theShoppingCart[i].activityId,
          item: theShoppingCart[i].bookableItemId,
          event: theShoppingCart[i].eventId,
          quantity: theShoppingCart[i].quantity
        });
      }

      return models.BookingModel.checkout({'bookings': params});
    };

  });
