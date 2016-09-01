define([ "jquery", "lib/core/sailthru_form" ], function($, SailthruForm) {

  "use strict";

  describe("SailthruForm", function() {
    var instance;

    beforeEach(function() {
      loadFixtures("newsletter_form.html");
    });

    describe("Initialization", function() {

      beforeEach(function() {
        instance = new SailthruForm({
          el: ".js-newsletter-footer",
          alert: ".js-newsletter-footer"
        });
      });

      it("is defined", function() {
        expect(instance).toBeDefined();
      });

      it("finds newsletter form element", function() {
        expect(instance.$el).toExist();
      });
    });

    describe("Functionality", function() {
      var request;

      beforeEach(function() {
        jasmine.Ajax.install();
        instance = new SailthruForm({
          el: ".js-newsletter-footer",
          alert: ".js-newsletter-footer"
        });
        instance.$el.submit();
        request = jasmine.Ajax.requests.mostRecent();
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      describe("First time sign up", function() {
        beforeEach(function() {
          request.respondWith({
            status: 200,
            responseText: "{}"
          });
        });

        it("shows success notification", function() {
          expect($('.alert--success')[0]).toBeInDOM();
        });
      });

      describe("Already signed up", function() {
        beforeEach(function() {
          request.respondWith({
            status: 409,
            responseText: "{}"
          });
        });

        it("shows notification", function() {
          expect($('.alert--announcement')[0]).toBeInDOM();
        });
      });

      describe("Sign up error", function() {
        beforeEach(function() {
          request.respondWith({
            status: 500,
            responseText: "{}"
          });
        });

        it("shows error notification", function() {
          expect($('.alert--error')[0]).toBeInDOM();
        });
      });
    });

  });
});
