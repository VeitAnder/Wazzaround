'use strict';

var assert = function (condition, message) {
  if (!condition) {
    console.log('Assertion failed', message);
    console.trace();
    throw new Error(message || "Assertion failed");
  }
};

angular.module('anorakApp')
  .service('shoppingcart', function shoppingcart() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var theShoppingCart = {};
    var dictCounter = 0;

    this.add = function(item) {
      var idxOfTheItem = dictConter;

      assert(item.price, "provide a price for the item");

      // add item functions
      item.remove = function() {
        delete theShoppingCart[idxOfTheItem];
      };

      theShoppingCart[dictCounter] = item;
      dictConter += 1;
    };

    this.getCart = function() {
      var cart = [];

      for (var i in theShoppingCart) {
        cart.push(theShoppingCart[i])
      }
      return cart;
    };

    this.getTotal = function() {
      return {
        numItems : Object.keys(theShoppingCart).length,
        price : _.reduce(theShoppingCart, function(a, b) { return a.price + b.price })
      };
    };

  });
