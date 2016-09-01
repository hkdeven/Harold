define([ "jquery", "public/assets/javascripts/lib/core/shopping_cart" ], function($, ShoppingCart) {

  "use strict";

  describe("ShoppingCart", function() {

    var shoppingCart;

    describe("Empty basket", function() {

      beforeEach(function() {
        spyOn(window.lp, "getCookie").and.returnValue(false);
        loadFixtures("shopping_cart.html");
        shoppingCart = new ShoppingCart();
      });

      it("hides the shopping basket element", function() {
        var $nav = $("nav.js-user-nav:first");
        expect($nav).not.toHaveClass("has-basket");
      });

      it("has an empty basket", function() {
        var basketItems = $("span.js-basket-items").text();
        expect(basketItems).toBe("");
      });

    });

    describe("Has shopping items", function() {

      beforeEach(function() {
        loadFixtures("shopping_cart.html");
        var cartData = JSON.stringify({"D":78,"F":2653,"A":["5904","5904-DIGITAL_ONLY"]});
        spyOn(window.lp, "getCookie").and.returnValue(cartData);
        shoppingCart = new ShoppingCart();
      });

      afterEach(function() {
        $("nav.js-user-nav").remove();
      });

      it("displays the basket element", function() {
        expect($("nav.js-user-nav")).toExist();
      });

      it("shows the number of shopping items", function() {
        var basketItems = $("span.js-basket-items").text();
        expect(basketItems).toBe("2");
      });
    });

  });
});
