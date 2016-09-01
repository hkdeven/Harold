define([
  "jquery",
  "lib/components/map_styles",
  "polyfills/function_bind"
], function($, MapStyles) {

  "use strict";

  var defaults = {
    pois: ".js-poi",
    el: ".js-poi-list"
  };

  function POIList(args, poiMap) {
    this.poiMap = poiMap;
    this.config = $.extend({}, defaults, args);

    this.$el = $(this.config.el);
    this.$pois = this.$el.find(this.config.pois);

    if (this.$pois.length) {
      this._init();
    }
  }

  POIList.prototype._init = function() {
    this.poiData = [];
    this.poiMarkers = [];
    this.latLngs = [];
    this.markerImages = {};

    if (this.poiMap.isOpen) {
      this._build();
    } else {
      this.poiMap.$el.on(":map/open", this._build.bind(this));
    }
  };

  POIList.prototype._build = function() {

    var map = this.poiMap;

    for (var i = 0, len = this.$pois.length; i < len; i++) {
      this.poiData.push(this.$pois.eq(i).data());
    }

    if (map.marker) {
      map.marker.setIcon(this._createMarkerImage("mark", "tiny"));

      map.$el.on(":map/pois-added", function() {
        map.setupTooltip();
      });
    }

    this._addPOIs();
    this.centerAroundMarkers();
  };

  POIList.prototype._getIcon = function( topic, size ) {
    if (topic === "lodging"){
      topic = "hotel";
    }

    if (this.markerImages[topic + "-" + size]){
      return this.markerImages[topic + "-" + size];
    } else {
      return this.markerImages[topic + "-" + size] = this._createMarkerImage(topic, size);
    }
  };

  POIList.prototype._createMarkerImage = function(topic, size) {
    var markerStyle = MapStyles.markerStyles(topic, size);

    return {
      url: MapStyles.markerBackgroundImage,
      size: new window.google.maps.Size(markerStyle.size.width, markerStyle.size.height),
      origin: new window.google.maps.Point( -markerStyle.position.x, -markerStyle.position.y )
    };
  };

  POIList.prototype._addPOIs = function(data) {
    data = data || this.poiData;

    for (var i = 0, len = data.length; i < len; i++){
      this._createMarker(i);
    }

    this.poiMap.trigger(":map/pois-added");

    this._listen();
  };

  POIList.prototype._createMarker = function(i) {
    var latLng = new window.google.maps.LatLng(
          this.poiData[ i ].latitude,
          this.poiData[ i ].longitude
        ),
        marker = new window.google.maps.Marker({
          icon: this._getIcon( this.poiData[ i ].topic, "small" ),
          animation: window.google.maps.Animation.DROP,
          position: latLng,
          map: this.poiMap.map,
          visible: false
        });

    setTimeout(marker.setVisible.bind(marker, true), (i + 1) * 100);

    this.poiMarkers.push( marker );
    this.latLngs.push( latLng );
  };

  POIList.prototype._listen = function() {
    this.$pois.on("click", function(event) {
      this.selectPOI( $(event.target).closest("li").index() );
    }.bind(this));

    for (var i = 0, len = this.poiMarkers.length; i < len; i++){
      window.google.maps.event.addListener(this.poiMarkers[i], "click", this.selectPOI.bind(this, i));
    }
  };

  POIList.prototype.resetSelectedPOI = function() {
    this.$el.find(".is-selected").removeClass("is-selected");
    for (var i = 0, len = this.poiMarkers.length; i < len; i++){
      this.poiMarkers[ i ].setIcon(this._getIcon( this.poiData[ i ].topic, "small" ));
      this.poiMarkers[ i ].setZIndex(1000);
    }
  };

  POIList.prototype.selectPOI = function(i) {
    var $poiItem = this.$pois.eq(i),
        poiData = this.poiData[ i ],
        poiMarker = this.poiMarkers[ i ];

    this.resetSelectedPOI();

    $poiItem.addClass("is-selected");
    poiMarker.setIcon( this._getIcon( poiData.topic, "large" ) );
    poiMarker.setZIndex(1000 + i);

    // Take into account the list overlay
    this.poiMap.map.setCenter( poiMarker.getPosition() );
    this.poiMap.map.panBy( this.poiMap.$container.width() / 6, 0 );
  };

  POIList.prototype.centerAroundMarkers = function() {
    var bounds = new window.google.maps.LatLngBounds();

    for (var i = 0, latLngLen = this.latLngs.length; i < latLngLen; i++) {
      //  And increase the bounds to take this point
      bounds.extend (this.latLngs[i]);
    }

    this.poiMap.map.fitBounds(bounds);
  };

  return POIList;
});
