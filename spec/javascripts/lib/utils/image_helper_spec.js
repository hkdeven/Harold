define([
  "jquery",
  "public/assets/javascripts/lib/utils/image_helper.js"
], function($, ImageHelper) {

  var instance;

  describe("ImageHelper", function() {

    beforeEach(function() {
      loadFixtures("image_helper.html");
      instance = new ImageHelper();
    });

    describe(".detectOrientation()", function() {

      it("detects landscape", function() {
        expect(instance.detectOrientation($("#landscape .img"))).toBe("landscape");
      });

      it("detects portrait", function() {
        expect(instance.detectOrientation($("#portrait .img"))).toBe("portrait");
      });

      it("detects squarish (i.e.: neither quite portrait nor landscape)", function() {
        expect(instance.detectOrientation($("#squarish .img"))).toBe("squarish");
      });
    });

    describe(".detectRelativeSize()", function() {

      it("detects taller", function() {
        var $container = $("#taller"),
            $img = $container.find(".img");

        expect(instance.detectRelativeSize($img, $container)).toBe("taller");
      });

      it("detects wider", function() {
        var $container = $("#wider"),
            $img = $container.find(".img");

        expect(instance.detectRelativeSize($img, $container)).toBe("wider");
      });
    });

    describe(".applyOrientationClasses()", function() {

      it("adds `is-landscape` class", function() {
        var $img = $("#landscape .img");

        instance.applyOrientationClasses($img);

        expect($img).toHaveClass("is-landscape");
      });

      it("adds `is-portrait` class", function() {
        var $img = $("#portrait .img");

        instance.applyOrientationClasses($img);

        expect($img).toHaveClass("is-portrait");
      });
    });

    describe(".applyRelativeClasses()", function() {

      it("detects when the image is taller", function() {
        var $container = $("#taller"),
            $img = $container.find(".img");

        instance.applyRelativeClasses($img, $container);

        expect($img).toHaveClass("is-taller");
      });

      it("detects when the image is wider", function() {
        var $container = $("#wider"),
            $img = $container.find(".img");

        instance.applyRelativeClasses($img, $container);

        expect($img).toHaveClass("is-wider");
      });
    });

    describe(".centerWithinContainer()", function() {

      it("centers vertically", function() {
        var $container = $("#centerV"),
            $img = $container.find(".img");

        instance.centerWithinContainer($img, $container);

        expect($("#centerV .img")[0].style.marginLeft).toBe("-12.5%");
      });

      it("centers horizontally", function() {
        var $container = $("#centerH"),
            $img = $container.find(".img");

        instance.centerWithinContainer($img, $container);

        expect($("#centerH .img")[0].style.marginTop).toBe("-50%");
      });
    });

    describe(".processImages()", function() {

      it("Finds and processes images", function() {
        var $images = $(".img"),
            hasOrientationClasses = true,
            hasSizeClasses = true;

        instance.processImages({
          img: ".img",
          container: ".img-container"
        });

        $images.each(function(i, img) {
          if (!img.className.match(/is\-landscape|portrait|squarish/)) {
            return hasOrientationClasses = false;
          }
          if (!img.className.match(/is\-taller|wider|equal/)) {
            return hasSizeClasses = false;
          }
        });

        expect(hasOrientationClasses).toBeTruthy();
        expect(hasSizeClasses).toBeTruthy();
      });

      it("Waits for images to load if they have no dimensions & processes the images", function() {
        var $img = $(".img-onload");

        instance.processImages({
          img: ".img-onload",
          container: ".img-onload-container"
        });

        $img.eq(0).css({
          width: 1000,
          height: 600
        }).triggerHandler("load");

        $img.eq(1).css({
          width: 600,
          height: 1000
        }).triggerHandler("load");

        expect($img.eq(0)).toHaveClass("is-landscape");
        expect($img.eq(0)).toHaveClass("is-wider");
        expect($img.eq(1)).toHaveClass("is-portrait");
        expect($img.eq(1)).toHaveClass("is-taller");
      });
    });
  });
});
