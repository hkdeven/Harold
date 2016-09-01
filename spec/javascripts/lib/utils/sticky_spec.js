define([ "public/assets/javascripts/lib/utils/sticky.js" ], function(Sticky) {

  describe("Sticky", function() {

    var instance,
        options = { minWidth: 200, threshold: 50 };

    beforeEach(function() {
      loadFixtures("sticky.html");
      instance = new Sticky($("#sticky-target"), options);
      instance.init();
    });

    afterEach(function() {
      instance.teardown();
      instance = null;
    });

    describe("Calculations and dimensions", function() {

      describe("._minWidth", function() {
        it("calculates if there is enough horizontal space", function() {
          spyOn(instance, "_window").and.returnValue({
            innerWidth: 250
          });

          expect(instance._minWidth()).toBe(true);
          instance.options = { minWidth: 275 }
          expect(instance._minWidth()).toBe(false);
          instance.options = options;
        });
      });

      describe("._minHeight", function() {
        it("calculates there to be enough vertical space", function() {
          spyOn(instance, "_window").and.returnValue({
            innerHeight: 400
          });

          spyOn(instance, "_heights").and.returnValue({
            sticky: 100,
            parent: 200
          });

          expect(instance._minHeight()).toBe(true);
        });

        it("calculates there to be not enough vertical space", function() {
          spyOn(instance, "_heights").and.returnValue({
            sticky: 100,
            parent: 100
          });

          expect(instance._minHeight()).toBe(false);
        });
      });

      describe("._limitTop", function() {
        beforeEach(function() {
          spyOn(instance, "_offsets").and.returnValue({
            parent: { top: 100 }
          });
        });

        it("calculates when the window has not scrolled past the top of the target's offset parent", function() {
          spyOn(instance, "_window").and.returnValue({
            scrollY: 0
          });

          expect(instance._limitTop()).toBe(true);
        });

        it("calculates when the window has scrolled past the top of the target's offset parent", function() {
          spyOn(instance, "_window").and.returnValue({
            scrollY: 200
          });

          expect(instance._limitTop()).toBe(false);
        });
      });

      describe("._limitBottom", function() {
        beforeEach(function() {
          spyOn(instance, "_heights").and.returnValue({
            sticky: 100,
            parent: 200
          });

          spyOn(instance, "_offsets").and.returnValue({
            parent: { top: 100 }
          });
        });

        it("calculates when the sticky element has reached the bottom of it's container", function() {
          spyOn(instance, "_window").and.returnValue({
            scrollY: 201
          });

          expect(instance._limitBottom()).toBe(true);
        });

        it("calculates when the sticky element has not reached the bottom of it's container", function() {
          spyOn(instance, "_window").and.returnValue({
            scrollY: 150
          });

          expect(instance._limitBottom()).toBe(false);
        });
      });

    });

  });

});
