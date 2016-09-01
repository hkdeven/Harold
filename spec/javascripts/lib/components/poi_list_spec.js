define([ "jquery", "public/assets/javascripts/lib/components/poi_list.js" ], function($, POIList) {

  "use strict";

  describe("POI List", function() {

    var instance, mockAPI;

    beforeEach(function() {
      loadFixtures("poi_list.html");

      jasmine.clock().install();

      mockAPI = jasmine.createSpyObj("Google Maps", [ "Map", "LatLng", "Marker", "Point", "Size", "Animation", "LatLngBounds" ]);

      mockAPI.Map.and.callFake(function() {
        return jasmine.createSpyObj("Google Map Instance", [ "setCenter", "panBy", "fitBounds" ]);
      });

      mockAPI.Marker.and.callFake(function() {
        return jasmine.createSpyObj("Google Maps Marker", [ "setIcon", "getPosition", "setVisible", "setZIndex" ]);
      });

      mockAPI.LatLngBounds.and.callFake(function() {
        return jasmine.createSpyObj("Google Maps LatLngBounds", [ "extend" ]);
      });

      instance = new POIList(null, {
        $container: $("div.js-poi-map-container"),
        $el: $("div.js-poi-map"),
        marker: mockAPI.Marker(),
        map: mockAPI.Map(),
        isOpen: false,
        trigger: jasmine.createSpy(),
        setupTooltip: jasmine.createSpy()
      });

      window.google = {
        maps: mockAPI
      };

      window.google.maps.event = {
        addListener: jasmine.createSpy()
      };
    });

    afterEach(function() {
      window.google = window.mapsCallback = instance = undefined;
      jasmine.clock().uninstall();
    });

    describe("Initialisation", function() {
      beforeEach(function() {
        spyOn(instance, "_addPOIs").and.callThrough();
      });

      it("should wait until POIMap is initialized", function() {
        expect(instance._addPOIs).not.toHaveBeenCalled();

        $(".js-poi-map").trigger(":map/open");

        expect(instance._addPOIs).toHaveBeenCalled();
      });

      it("should collect POI data", function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.clock().tick(1000);

        expect(instance.poiData.length).toBe(4);
      });
    });

    describe("Markers", function() {
      beforeEach(function() {
        spyOn(instance, "centerAroundMarkers");
        $(".js-poi-map").trigger(":map/open");
        jasmine.clock().tick(1000);
      });

      it("should create all the markers", function() {
        // Parent POI maps component will also call Marker
        expect(window.google.maps.Marker.calls.count() - 1).toBe(4);
        expect(instance.poiMarkers.length).toBe(4);
      });

      it("should zoom in and center around the markers", function() {
        expect(instance.centerAroundMarkers).toHaveBeenCalled();
      });
    });

    describe("Tooltip", function() {
      beforeEach(function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.clock().tick(1000);
        $(".js-poi-map").trigger(":map/pois-added");
      });

      it("should setup the tooltip when all markers have been added", function() {
        expect(instance.poiMap.setupTooltip).toHaveBeenCalled();
      });
    });

    describe("POI Highlight", function() {
      beforeEach(function() {
        $(".js-poi-map").trigger(":map/open");
        jasmine.clock().tick(1000);

        spyOn(instance, "_getIcon").and.callThrough();
      });

      it("should select poi on click", function() {
        instance.selectPOI(0);

        expect(instance._getIcon.calls.mostRecent().args[1]).toBe("large");
        expect(instance.$pois.eq(0)).toHaveClass("is-selected");
      });

      it("should reset the selected poi", function() {
        instance.resetSelectedPOI();

        expect(instance._getIcon.calls.mostRecent().args[1]).toBe("small");
        expect(instance.$pois.eq(0)).not.toHaveClass("is-selected");
      });
    });

  });

});
