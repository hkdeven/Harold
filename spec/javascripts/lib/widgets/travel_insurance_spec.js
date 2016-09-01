define([ "public/assets/javascripts/lib/widgets/travel_insurance" ], function(TravelInsurance) {

  "use strict";

  describe("TravelInsurance", function() {

    define("wnmock", function() {
      return {};
    });

    describe("pulling in the World Nomad widget", function() {
      var widget;

      beforeEach(function(done) {
        widget = new TravelInsurance({
          path: "wnmock",
          callback: done
        });

        widget.render()
      });

      it("has loaded", function() {
        expect(widget.$el).toBeDefined();
      });
    });

    describe("should return a promise when rendering", function() {
      var widget;

      beforeEach(function(done) {
        widget = new TravelInsurance({
          path: "wnmock"
        });

        widget.render().then(done);
      });

      it("has resolved", function() {
        expect(widget.$el).toBeDefined();
      });
    });

  });

});
