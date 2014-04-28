'use strict';

//var assert = function (condition, message) {
//  if (!condition) {
//    console.log('Assertion failed', message);
//    console.trace();
//    throw new Error(message || "Assertion failed");
//  }
//};

angular.module('anorakApp')
  .service('shoppingcart', function shoppingcart() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var theShoppingCart = {};
    var dictCounter = 0;

    this.add = function(item) {
      var idxOfTheItem = dictCounter;

      assert(item.price, "provide a price for the item");

      // add item functions
      item.remove = function() {
        delete theShoppingCart[idxOfTheItem];
      };

      theShoppingCart[dictCounter] = item;
      dictCounter += 1;
    };

    this.getCart = function() {
      return theShoppingCart;
    };

    this.getTotal = function() {
      return {
        num : Object.keys(theShoppingCart).length,
        price : _.reduce(theShoppingCart, function(res, value, key) {
          assert(value.price, "price missing for item in the shoppingcart");
          assert(value.quantity, "quantity missing for item in the shoppingcart");

          return res + value.price * value.quantity;
        }, 0 /* init value */)
      };
    };

    this.checkout = function() {

    };

    // TestData
    this.add({
      name : "Quad Tour",
      price : 250,
      quantity : 2,
      duration : 4,
      category : "sports",
      startDate : new Date()
    });

    this.add({
      name : "Guided Tours",
      price : 150,
      quantity : 1,
      duration : 24,
      category : "culture",
      startDate : new Date()
    });


  });
