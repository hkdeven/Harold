define([ "jquery", "lib/core/timeago" ], function($, Timeago) {

  "use strict";

  describe("TimeAgo", function() {

    var instance, date;

    beforeEach(function() {
      date = new Date(new Date() - 1000 * 60 * 60).toISOString(); // 1h ago

      loadFixtures("timeago.html");

      $(".js-timeago").attr("datetime", date);
      $(".js-timeago-full").attr("datetime", date);

      instance = new Timeago();
    });

    describe("Initialisation", function() {

      it("is defined", function() {
        expect(instance).toBeDefined();
      });

      it("finds all elements", function() {
        expect(instance.els.$fulls).toExist();
        expect(instance.els.$responsives).toExist();
      });
    });

    describe("Functionality", function() {

      describe("Screen width > breakpoint", function() {

        beforeEach(function() {
          spyOn(instance, "_isMobile").and.returnValue(false);
          instance.update();
        });

        it("binds full strings to all elements", function() {
          expect(instance.els.$responsives).toHaveText("an hour ago");
          expect(instance.els.$fulls).toHaveText("an hour ago");
        });
      });

      describe("Screen width < breakpoint", function() {

        beforeEach(function() {
          spyOn(instance, "_isMobile").and.returnValue(true);
          instance.update();
        });

        it("binds full strings to $fulls only", function() {
          expect(instance.els.$fulls).toHaveText("an hour ago");
        });

        it("binds short strings to $responsives", function() {
          expect(instance.els.$responsives).toHaveText("1h");
        });

        describe("for dates older than 1 month", function() {

          beforeEach(function() {
            spyOn(Date, "now").and.returnValue(1423954800000); // 2015.02.15 00:00
          });

          it("returns correct month name", function() {
            var monthName = instance._getMonthName(null, 3024000000); // 35 days
            expect(monthName).toEqual("Jan");
          });

          it("returns correct year", function() {
            var fullYear = instance._getFullYear(null, 31968000000); // 370 days
            expect(fullYear).toEqual("2014");
          });

        });
      });
    });
  });
});
