define([
  "jquery",
  "lib/utils/debounce",
  "lib/utils/throttle",
  "polyfills/function_bind"
], function($, debounce, throttle) {

  "use strict";

  function Sticky($target, options) {
    var defaults = {
      // Minimum viewport width required for sticky positioning to be activated.
      minWidth: 1024,
      // If there's only 60px below the target for it to move into, why bother?
      threshold: 60,
      // Viewport offset to add to the top of the target element.
      offset: 0,
      // The element that gets stuck.
      sticky: ".js-sticky"
    };

    this.options = $.extend({}, defaults, options);

    this.$target = $target;
    this.$parent = $target.offsetParent();
    this.$sticky = $target.find(this.options.sticky);

    this.init();
  }

  Sticky.prototype.init = function() {
    this.reset();
    $(window).on("resize.sticky", debounce(this._onResize.bind(this), 100));
  };

  Sticky.prototype.teardown = function() {
    $(window).off(".sticky");
    this.unstick();
  };

  Sticky.prototype.stick = function() {
    this.$sticky
      .addClass("is-sticky")
      .removeClass("is-at-bottom")
      .css({ position: "fixed", top: this.options.offset, left: this._leftPosition() });
  };

  Sticky.prototype.unstick = function(bottom) {
    this.$sticky
      .removeClass("is-sticky")
      .css({ position: "", top: "", left: "" })
      .addClass(bottom ? "is-at-bottom" : null);
  };

  Sticky.prototype.refresh = function() {
    if (this.$sticky.hasClass("is-sticky")) {
      this.$sticky.css("left", this._leftPosition());
    }
  };

  Sticky.prototype.reset = function() {
    $(window).on("scroll.sticky.stickyPending", this._onScrollStart.bind(this));
  };

  Sticky.prototype._onScrollStart = function() {
    if (!this._minHeight() || !this._minWidth()) return;

    $(window)
      .off(".stickyPending")
      .on("scroll.sticky.stickyScroll", throttle(this._onScroll.bind(this), 10))
      .on("scroll.sticky.stickyScroll", debounce(this._onScrollEnd.bind(this), 200));
  };

  Sticky.prototype._onScroll = function() {
    if (this.$sticky.hasClass("is-sticky")) {
      this._limitTop() && this.unstick();
      this._limitBottom() && this.unstick(true);
      return;
    }

    if (!this._limitTop() && !this._limitBottom()) {
      this.stick();
    }
  };

  Sticky.prototype._onScrollEnd = function() {
    $(window).off(".stickyScroll");
    this.reset();
  };

  Sticky.prototype._onResize = function() {
    if (!this.$sticky.hasClass("is-sticky")) return;

    if (!this._minWidth() || !this._minHeight()) {
      this.unstick();
    } else {
      this.refresh();
    }
  };

  Sticky.prototype._window = function() {
    // This is only a function so we can stub it out in tests
    return {
      scrollY: $(window).scrollTop(),
      scrollX: $(window).scrollLeft(),
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  };

  Sticky.prototype._heights = function() {
    return {
      parent: this.$parent.outerHeight(),
      sticky: this.$sticky.outerHeight(true)
    };
  };

  Sticky.prototype._offsets = function() {
    return {
      parent: this.$parent.offset(),
      target: this.$target.offset()
    };
  };

  Sticky.prototype._leftPosition = function() {
    // Fixed positioning is relative to the viewport, not the element's offset
    // parent. This function calculates where the element would be if it was.
    return this._offsets().target.left;
  };

  Sticky.prototype._minWidth = function() {
    return this._window().innerWidth > this.options.minWidth;
  };

  Sticky.prototype._minHeight = function() {
    var heights = this._heights(),
        totalHeight = heights.sticky + this.options.threshold;

    // Tests if both the container and window have space to scroll into.
    return totalHeight < this._window().innerHeight && totalHeight < heights.parent;
  };

  Sticky.prototype._limitTop = function() {
    return this._window().scrollY < (this._offsets().parent.top - this.options.offset);
  };

  Sticky.prototype._limitBottom = function() {
    var heights = this._heights(),
        offsets = this._offsets();

    return (this._window().scrollY + heights.sticky) > (offsets.parent.top + heights.parent - this.options.offset);
  };

  return Sticky;

});
