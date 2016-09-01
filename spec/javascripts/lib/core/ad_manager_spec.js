define([ "public/assets/javascripts/lib/core/ad_manager" ], function(AdManager) {

  describe("Ad Manager", function() {

    var instance;

    beforeEach(function() {
      loadFixtures("ad_iframe.html");

      spyOn(window.lp, "getCookie").and.returnValue([]);

      window.Krux = {
        user: "foo",
        segments: []
      };

      instance = new AdManager({
        networkID: "xxxx",
        template: "overview",
        theme: "family-holiday",
        layers: [ "lonelyplanet", "destinations" ]
      });
    });

    afterEach(function() {
      $(".adunit").removeData("googleAdUnit adUnit");
    });

    describe(".init()", function() {

      beforeEach(function(done) {
        spyOn(instance, "load").and.callFake(done);
        instance.init();
      });

      it("has loaded jQuery DFP", function() {
        expect($.hasOwnProperty("dfp")).toBe(true);
        expect(instance.pluginConfig).toBeDefined();
      });

    });

    describe(".formatKeywords()", function() {
      var config = {
        adThm: "honeymoons,world-food",
        adTnm: "overview,poi-list",
        layers: [],
        interest: "adventure-travel",
        keyValues: {
          foo: "bar"
        }
      }, result;

      beforeEach(function() {
        result = instance.formatKeywords(config);
      });

      it("Should return a correctly formatted config for jQuery.dfp targeting", function() {
        expect(result.thm).toEqual(config.adThm);
        expect(result.tnm).toEqual(config.adTnm.split(","));
        expect(result.foo).toEqual(config.keyValues.foo);
        expect(result.interest).toEqual(config.interest);
      });

      it("supports krux targeting", function() {
        expect(result.ksg).toEqual(Krux.segments);
        expect(result.kuid).toEqual(Krux.user);
      });

    });

    describe(".getNetworkID()", function() {

      it("Should return the default network ID if no cookie and no URL parameter are set", function() {
        spyOn(instance, "_networkCookie").and.returnValue(null);
        spyOn(instance, "_networkParam").and.returnValue(null);
        expect(instance.getNetworkID()).toBe(9885583);
      });

      it("Should return the network ID specified in a cookie", function() {
        spyOn(instance, "_networkCookie").and.returnValue(123456);
        spyOn(instance, "_networkParam").and.returnValue(null);
        expect(instance.getNetworkID()).toBe(123456);
      });

      it("Should return the network ID specified in the URL", function() {
        spyOn(instance, "_networkCookie").and.returnValue(null);
        spyOn(instance, "_networkParam").and.returnValue(78910);
        expect(instance.getNetworkID()).toBe(78910);
      });

    });

    describe(".load()", function() {

      beforeEach(function() {
        spyOn($.fn, "dfp").and.stub();
      });

      it("instantiates new ad units", function() {
        instance.load();
        expect($.fn.dfp.calls.mostRecent().object.length).toBe(1);
      });

      describe("Does not reload ads", function() {
        beforeEach(function() {
          $(".adunit").data("googleAdUnit", true);
        });

        it("does not instantiate ", function() {
          instance.load();
          expect($.fn.dfp.calls.mostRecent().object.length).toBe(0);
        });
      });

    });

    describe(".refresh()", function() {

      it("should call the refresh method on ad units filtered by type with object param", function() {
        var unit;

        function MockAdUnit(type) {
          this.type = type;
        }
        MockAdUnit.prototype.getType = function() {
          return this.type;
        };

        instance.$adunits = $([]);

        [ "leaderboard", "adSense", "mpu" ].forEach(function(type) {
          var mock = new MockAdUnit(type);
          mock.refresh = jasmine.createSpy("refresh");
          var $unit = $("<div>").data("adUnit", mock);
          instance.$adunits = instance.$adunits.add($unit);
        });

        instance.refresh({
          type: "leaderboard"
        });
        expect(instance.$adunits.eq(0).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "adSense"
        });
        expect(instance.$adunits.eq(1).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "mpu"
        });
        expect(instance.$adunits.eq(2).data("adUnit").refresh).toHaveBeenCalled();

        instance.refresh({
          type: "mpu",
          ads: { param: "new" }
        });
        expect(instance.$adunits.eq(2).data("adUnit").refresh).toHaveBeenCalledWith({ param: "new" });

        expect(instance.$adunits.eq(0).data("adUnit").refresh.calls.count()).toEqual(1);
        expect(instance.$adunits.eq(1).data("adUnit").refresh.calls.count()).toEqual(1);
        expect(instance.$adunits.eq(2).data("adUnit").refresh.calls.count()).toEqual(2);

      });

    });

  });

});
