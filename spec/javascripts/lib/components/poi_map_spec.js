define([ "jquery", "public/assets/javascripts/lib/components/poi_map.js" ], function($, POIMap) {

  "use strict";

  describe("POI Maps", function() {

    var instance, mockAPI;

    beforeEach(function() {
      loadFixtures("poi_map.html");

      instance = new POIMap();

      mockAPI = jasmine.createSpyObj("Google Maps", [ "Map", "LatLng", "Marker", "Size", "Point" ]);

      mockAPI.Map.and.callFake(function() {
        return jasmine.createSpyObj("Google Map Instance", [ "setCenter", "panBy" ]);
      });

      mockAPI.Marker.and.callFake(function() {
        return jasmine.createSpyObj("Google Maps Marker", [ "setIcon", "getPosition" ]);;
      });

      spyOn(instance, "_googleMapsOptions").and.returnValue({
        center: null
      });
    });

    afterEach(function() {
      window.google = window.mapsCallback = instance = undefined;
    });

    describe("Initialisation", function() {

      it("should find the target, placeholder and map container elements", function() {
        expect(instance.$el.length).toBe(1);
        expect(instance.$container.length).toBe(1);
        expect(instance.$placeholder.length).toBe(1);
      });

    });

    describe("Loading and displaying JS maps", function() {

      it("should set the component state to loading", function() {
        spyOn(instance, "_loadGoogleMaps").and.returnValue(null);

        instance.toggle();

        expect(instance.$el).toHaveClass("is-loading");
        expect(window.mapsCallback).toBeDefined();
      });

      it("should build and open the JS map when Google Maps has loaded", function() {
        spyOn(instance, "_loadGoogleMaps").and.callFake(function() {
          window.google = {
            maps: mockAPI
          };
          window.mapsCallback && window.mapsCallback();
        });

        spyOn(instance, "_googleMapsMarker").and.callFake(function() {
          return {
            url: "marker.png",
            origin: { x: 10, y: 10 },
            size: { width: 100, height: 100 }
          };
        });

        instance.toggle();

        expect(instance.$el).not.toHaveClass("is-loading");
        expect(instance.$el).toHaveClass("is-open");
        expect(window.mapsCallback).not.toBeDefined();
        expect(mockAPI.Marker).toHaveBeenCalledWith({
          icon: {
            url: "marker.png",
            origin: { x: 10, y: 10 },
            size: { width: 100, height: 100 }
          },
          position: null,
          map: instance.map
        });
      });

    });

  });

});
