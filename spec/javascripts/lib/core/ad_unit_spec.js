define([ "public/assets/javascripts/lib/core/ad_unit" ], function(AdUnit) {

  describe("Ad Unit", function() {

    var instance, stub;

    beforeEach(function() {
      loadFixtures("ad_iframe.html");

      AdUnit.prototype.extensions.mpu = jasmine.createSpy();

      instance = new AdUnit($(".adunit"));
    });

    describe("._init()", function() {

      it("Should remove 'is-closed' class from closest ancestor", function() {
        var $fixture = $(".is-closed");

        spyOn(instance, "isEmpty").and.returnValue(false);

        expect($fixture.hasClass("is-closed")).toBe(false);
      });

      it("Should call extension if defined", function() {
        expect(instance.extensions.mpu).toHaveBeenCalled();
      });

      it("Should trigger :ads/visible event if !isEmpty()", function() {
        spyOn(instance, "isEmpty").and.returnValue(false);
        var SpyEvent = spyOnEvent(instance.$target, ":ads/visible");
        instance._init();
        expect(SpyEvent).toHaveBeenTriggered();
      });

      it("Should trigger :ads/hidden event if isEmpty()", function() {
        spyOn(instance, "isEmpty").and.returnValue(true);
        var SpyEvent = spyOnEvent(instance.$target, ":ads/hidden");
        instance._init();
        expect(SpyEvent).toHaveBeenTriggered();
      });

    });

    describe(".isEmpty()", function() {

      it("Should return true if ad slot set to display none by DFP", function() {
        instance.$target.css("display", "none");
        expect(instance.isEmpty()).toBe(true);
      });

      it("Should return true if loaded ad is a 1x1 image", function() {
        instance.$target.find("iframe").contents().find("body").append("<img width='1' height='1' />");
        expect(instance.isEmpty()).toBe(true);
      });

      it("Should return false if an loaded ad is not a 1x1 image", function() {
        instance.$target.find("iframe").contents().find("body").append("<img width='728' height='90' />");
        expect(instance.isEmpty()).toBe(false);
      });

    });

    describe(".getType()", function() {

      it("Should return the ad type based on the element ID", function() {
        instance.$target.attr("class", "js-ad-leaderboard");
        expect(instance.getType()).toBe("leaderboard");

        instance.$target.attr("class", "js-ad-adSense");
        expect(instance.getType()).toBe("adSense");

        instance.$target.attr("class", "js-ad-unknown");
        expect(instance.getType()).toBe(null);
      });

    });

    describe(".refresh()", function() {

      beforeEach(function() {

        function MockPubAds() {}
        MockPubAds.prototype.refresh = function() {};

        function MockGoogleTag() {}
        MockGoogleTag.prototype.pubads = function() {
          return new MockPubAds();
        };
        MockGoogleTag.prototype.cmd = {
          push: function() {}
        };

        window.googletag = new MockGoogleTag();
        spyOn(instance, "clearConfig").and.returnValue(true);
        spyOn(instance, "setNewConfig").and.returnValue(true);
      });

      it("With new config, it should clear old config and set the new one ", function() {
        instance.refresh({ param: "new" });
        expect(instance.clearConfig).toHaveBeenCalled();
        expect(instance.setNewConfig).toHaveBeenCalled();
      });

      it("without new config, just refresh ", function() {
        instance.refresh();
        expect(instance.clearConfig).not.toHaveBeenCalled();
        expect(instance.setNewConfig).not.toHaveBeenCalled();
      });

    });

  });

});
