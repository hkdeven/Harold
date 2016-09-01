define([ "jquery", "nouislider/jquery.nouislider" ], function($) {

  "use strict";

  var RangeSlider = function() {
    this.sliders = $(".js-range-slider");
    this._initSliders();
  },
  rangeSlider;

  RangeSlider.prototype._initSliders = function() {
    var _this = this;

    this.sliders.each(function() {
      var $slider = $(this),
          sliderData = $slider.data(),
          targets = sliderData.targets.split(","),
          $sliderContainer = $slider.closest(".js-range-slider-container"),
          $minValue = $sliderContainer.find("[name='" + targets[0] + "']"),
          $maxValue = $sliderContainer.find("[name='" + targets[1] + "']"),
          $minLabel = $sliderContainer.find(".js-range-min"),
          $maxLabel = $sliderContainer.find(".js-range-max"),
          updateProxies;

      updateProxies = function(event, data) {
        var curMinVal = Math.floor(data[0]),
            curMaxVal = Math.floor(data[1]);

        _this._setLabelText(sliderData, $minLabel, curMinVal);
        _this._setLabelText(sliderData, $maxLabel, curMaxVal);

        _this._setFormValue(sliderData, $minValue, curMinVal);
        _this._setFormValue(sliderData, $maxValue, curMaxVal);
      };

      // Initialize jQuery plugin
      $slider.noUiSlider(_this._getConfig(sliderData));

      // Call proxy update functions
      $slider.on("slide", updateProxies);
      updateProxies(null, _this._getStartValues(sliderData));
    });
  };

  RangeSlider.prototype._getStartValues = function(data) {
    return [ parseInt(data.current.split(",")[0], 10), parseInt(this._getMaxStartValue(data), 10) ];
  };

  RangeSlider.prototype._getConfig = function(data) {
    return {
      range: this._setRange(data),
      start: this._getStartValues(data),
      handles: 2,
      connect: true
    };
  };

  RangeSlider.prototype._getMaxRangeValue = function(data) {
    var maxValue = data.capLevel || data.range.split(",")[1];
    return parseInt(maxValue, 10);
  };

  RangeSlider.prototype._getMaxStartValue = function(data) {
    var capValue = this._getMaxRangeValue(data),
        currentValue = parseInt(data.current.split(",")[1], 10);

    if (capValue && currentValue > capValue) {
      return capValue;
    }
    return currentValue;
  };

  RangeSlider.prototype._setRange = function(data) {
    if (data.snapDateAt) {
      return this._buildSnapRange(data);
    } else {
      return {
        min: [ Math.floor(data.range.split(",")[0]), 1 ],
        max: [ Math.floor(this._getMaxRangeValue(data)), 1 ]
      };
    }
  };

  RangeSlider.prototype._buildSnapRange = function(data) {
    var maxRange = this._getMaxRangeValue(data),

    // This is where the slider should transition from hour granularity to days
    snapPercent = Math.floor((data.snapDateAt / maxRange) * 100),
        snapKey = snapPercent + "%",
        range   = {};

    // Set range this way because noUISlider (v7.0.10) fails to set range correctly if keys are not in the right order
    range.min = [ Math.floor(data.range.split(",")[0]), 1 ];
    range[snapKey] = [ parseInt(data.snapDateAt, 10), 24 ];
    range.max = [ maxRange, 1 ];

    return range;
  };

  RangeSlider.prototype._addUnitToValue = function(data, value) {
    if (data.unitPosition === "before") {
      return data.unit + value;
    } else {
      if (data.unit === "hours") {
        return this._getDurationUnit(data.unit, value);
      }
      return value + " " + data.unit;
    }
  };

  RangeSlider.prototype._getDurationUnit = function(unit, value) {
    if (value >= 48) {
      unit = "days";
      value = Math.floor(value / 24);
    } else if (value === "1") {
      unit = "hour";
    }
    return value + " " + unit;
  };

  // ---------------------------------------------------------------------------
  // These functions are proxies for updating the slider on user action
  //
  // They are called within the scope of RangeSlider
  // ---------------------------------------------------------------------------

  RangeSlider.prototype._setLabelText = function(sliderData, $label, value) {
    var newValue;

    if (sliderData.unit && sliderData.unitPosition) {
      newValue = this._addUnitToValue(sliderData, value);
    }

    if (value == this._getMaxRangeValue(sliderData)) {
      newValue = (newValue || value) + "+";
    }

    $label.text(newValue);
  };

  RangeSlider.prototype._setFormValue = function(sliderData, $input, value) {
    if (value == this._getMaxRangeValue(sliderData)) {
      value = sliderData.range.split(",")[1];
    }

    $input.val(value);
  };

  // ---------------------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------------------

  $(document).ready(function() {
    rangeSlider = new RangeSlider();
  });

  return RangeSlider;

});
