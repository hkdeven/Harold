define([
  "jquery",
  "lib/utils/debounce",
  "polyfills/function_bind"
], function($, debounce) {

  "use strict";

  var defaults = {
    selector: ".js-toggle-active"
  };

  function ToggleActive(args) {
    this.config = $.extend({}, defaults, args);

    this.$toggles = $(this.config.selector);
    this.$context = $(document);

    this.init();
  }

  ToggleActive.prototype.init = function() {
    this.$toggles.length && (this._prepareTogglesAndTargets(), this.listen());
  };

  // -------------------------------------------------------------------------
  // Subscribe to Events
  // -------------------------------------------------------------------------

  ToggleActive.prototype.listen = function() {
    var _this = this;

    this.$context
      .on("click", this.config.selector, this._handleClick.bind(this))
      .on(":toggleActive/update", function(e, target) {
        _this._updateClasses($(target));
      });

    this.$context.trigger(":toggleActive/listening");
  };

  // -------------------------------------------------------------------------
  // Broadcast Events
  // -------------------------------------------------------------------------

  ToggleActive.prototype.broadcast = function($toggle) {
    var $targets = this._getTargetEls($toggle);

    $toggle.trigger(":toggleActive/click", {
      isActive: $targets.hasClass("is-active"),
      targets: $targets
    });
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------

  ToggleActive.prototype._prepareTogglesAndTargets = function() {
    var i, len, $toggle, $targets;

    this.$toggles.css("cursor", "pointer");

    for (i = 0, len = this.$toggles.length; i < len; i++) {
      $toggle = this.$toggles.eq(i);
      $targets = this._getTargetEls($toggle);

      if ($toggle.data("toggleMe") && !$toggle.hasClass("is-active")) {
        $toggle.addClass("is-not-active");
      }

      $targets.not(".is-active").addClass("is-not-active");
    }
  };

  ToggleActive.prototype._handleClick = function(e) {
    var $toggle = $(e.currentTarget);

    e.stopPropagation();

    if (e.target.nodeName.toUpperCase() === "A" && !$toggle.data("allowLinks")) {
      e.preventDefault();
    }

    if (!this.debounce) {
      this.debounce = debounce(this._toggle.bind(this, $toggle), 100);
    }

    this.debounce();
  };

  ToggleActive.prototype._toggle = function($toggle) {
    this._updateClasses($toggle);
    this.broadcast($toggle);

    this.debounce && (this.debounce = null);
  };

  ToggleActive.prototype._updateClasses = function($toggle) {
    var classList = [ "is-active", "is-not-active" ];

    if ($toggle.data("toggleClass")) {
      classList.push($toggle.data("toggleClass"));
    }

    classList = classList.join(" ");

    if ($toggle.data("toggleMe")) {
      $toggle.toggleClass(classList);
    }

    this._getTargetEls($toggle).toggleClass(classList);

    this.$context.trigger(":toggleActive/ready", $toggle);
  };

  ToggleActive.prototype._getTargetEls = function($toggle) {
    return $($toggle.data("toggleTarget"));
  };

  // -------------------------------------------------------------------------
  // Self-instantiate
  // -------------------------------------------------------------------------

  $(document).ready(function() {
    new ToggleActive;
  });

  return ToggleActive;
});
