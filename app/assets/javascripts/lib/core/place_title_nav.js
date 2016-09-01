define([
  "jquery",
  "lib/utils/template",
  "polyfills/function_bind"
], function($, Template) {

  "use strict";
  function PlaceTitleNav() {
    this.$el = $(".js-place-title");

    if (!this.navItemTemplate) {
      this.navItemTemplate = $("#tmpl-nav-item").text();
      this.navItemTemplateNoImage = $("#tmpl-nav-item-no-image").text();
      if (!(this.navItemTemplate && this.navItemTemplateNoImage)) return;
    }

    this.$el.length && this.navItemTemplate && this.init();
  }

  PlaceTitleNav.prototype.init = function() {
    $.each(this.$el.find(".js-place-title-nav"), function(i, el) {
      this.fetchNavItems(el);
    }.bind(this));

    // The menu can be quite long so disable scrollperf to maintain
    // hover state when the user has to scroll.
    this.$el.hover(
      function() {
        this.$el.trigger(":scrollperf/disable");
      }.bind(this),
      function() {
        this.$el.trigger(":scrollperf/enable");
      }.bind(this)
    );

  };

  PlaceTitleNav.prototype.getUrl = function(menuItem) {
    return $(menuItem).attr("data-slug") + "/navitems.json";
  };

  PlaceTitleNav.prototype.fetchNavItems = function(menuItem) {
    $.ajax({
      url: this.getUrl(menuItem),
      dataType: "json",
      success: function(data) {
        this.renderSubMenu(menuItem, data);
      }.bind(this)
    });

  };

  PlaceTitleNav.prototype.renderSubMenu = function(menuItem, data) {
    if (data && data.length ) {
      var html = "",
          template;

      for (var i = 0; i < data.length; i++) {
        /* jshint ignore:start */
        template = data[i].image_url ? this.navItemTemplate : this.navItemTemplateNoImage;
        /* jshint ignore:end */

        html += Template.render(template, data[i]);
      }
      $(menuItem).parent().addClass("nav__submenu__trigger")
        .find(".nav__submenu__content").prepend(html);
    }

  };

  $(document).ready(function() {
    new PlaceTitleNav;
  });

  return PlaceTitleNav;

});
