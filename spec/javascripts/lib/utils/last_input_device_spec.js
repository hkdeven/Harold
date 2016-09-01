define([ "public/assets/javascripts/lib/utils/last_input_device.js" ], function() {

  "use strict";

  describe("lastInputDevice", function() {

    describe("body class", function() {

      beforeEach(function() {
        window.htmlEvent = document.createEvent("HTMLEvents");
      })

      it("does not contain last-input", function() {
        expect(document.documentElement.className).not.toContain("last-input");
      });

      it("shows last-input-mouse after a mouse", function() {
        window.htmlEvent.initEvent("mousemove", true, false);
        document.dispatchEvent(window.htmlEvent);
        expect(document.documentElement.className).toContain("last-input-mouse");
      });

      it("shows last-input-touch after a touch", function() {
        window.htmlEvent.initEvent("touchmove", true, false);
        document.dispatchEvent(window.htmlEvent);
        expect(document.documentElement.className).toContain("last-input-touch");
      });

      it("shows last-input-keyboard after a keyup", function() {
        window.htmlEvent.initEvent("keyup", true, false);
        document.dispatchEvent(window.htmlEvent);
        expect(document.documentElement.className).toContain("last-input-keyboard");
      });

    });

  });
});
