'use strict';

//var assert = function (condition, message) {
//  if (!condition) {
//    console.log('Assertion failed', message);
//    console.trace();
//    throw new Error(message || "Assertion failed");
//  }
//};

angular.module('anorakApp')
  .factory('shoppingcart', function shoppingcart(models, $localStorage, $translate) {

    function calculatePrice(item) {
      if (item.groupEvent) {
        return groupEventPriceCalcutation(item);
      } else {
        return singleEventPriceCalcutation(item);
      }

      function groupEventPriceCalcutation(item) {
        var additionalPersonsPrice = 0;

        if (item.groupEventAdditionalPersons > 0) {
          additionalPersonsPrice = item.priceForAdditionalPerson * item.groupEventAdditionalPersons;
        }

        return item.price + additionalPersonsPrice;
      }

      function singleEventPriceCalcutation(item) {
        return item.price * item.quantity;
      }
    }

    var shoppingCart = function (storage) {
      this.storage = storage;
      this.states = {};
    };

    shoppingCart.prototype.calculatePrice = calculatePrice;
    shoppingCart.prototype.add = function (item) {
      assert(item.price !== undefined, "provide a price for the item");

      // increase quantity only of single events if already in shopping cart
      if (this.storage.theShoppingCart[item.eventId] && !item.groupEvent) {
        this.storage.theShoppingCart[item.eventId].quantity += 1;
        return;
      }

      // always set quantity to 1 for group event
      if (item.groupEvent) {
        item.quantity = 1;
      }

      this.storage.theShoppingCart[item.eventId] = item;
      this.storage.dictCounter += 1;
    };

    shoppingCart.prototype.reset = function () {
      this.storage.theShoppingCart = {};
      this.storage.dictCounter = 0;
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
          return res + calculatePrice(value);
        }, 0 /* init value */)
      };
    };

    shoppingCart.prototype.checkout = function (paymentToken, profile) {
      var params = [];
      _.each(this.storage.theShoppingCart, function (item) {
        params.push({
          groupEventAdditionalPersons: item.groupEventAdditionalPersons,
          activity: item.activityId,
          item: item.bookableItemId,
          event: item.eventId,
          quantity: item.quantity
        });
      });

      return models.BookingModel.checkout({
        'bookings': params,
        'payment': {
          'token': paymentToken,
          'amount_int': Math.floor(this.getTotal().price * 100),
          'currency': 'EUR'
        },
        'profile': profile,
        'languageKey': $translate.use()
      });
    };

    shoppingCart.prototype.getCopy = function () {
      return new shoppingCart({
        theShoppingCart: angular.copy(this.storage.theShoppingCart),
        dictCounter: this.storage.dictCounter
      });
    };

    return new shoppingCart($localStorage.$default({
        theShoppingCart: {},
        dictCounter: 0
      })
    );

  });
