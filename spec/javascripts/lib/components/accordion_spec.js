define(["public/assets/javascripts/lib/components/accordion.js"], function(Accordion) {

  describe("Accordion", function() {

    describe("When only one panel is allowed to be open", function() {
      beforeEach(function() {
        loadFixtures("accordion.html");
        window.myAccordion = new Accordion({
          parent: ".my-accordion"
        });
      });

      it("hides all panels", function() {
        expect($("#item1")).toHaveClass("is-closed");
        expect($("#item2")).toHaveClass("is-closed");
        expect($("#item3")).toHaveClass("is-closed");
        expect($("#item4")).toHaveClass("is-closed");
      });

      it("opens panel 1", function() {
        myAccordion.openPanel(0);
        expect($("#item1")).not.toHaveClass("is-closed");
        expect($("#item1")).toHaveClass("is-open");
      });

      it("closes panel 1", function() {
        myAccordion.closePanel(0);
        expect($("#item1")).not.toHaveClass("is-open");
        expect($("#item1")).toHaveClass("is-closed");
      });

      it("closes panel 1 and opens panel 2", function() {
        myAccordion.openPanel(0);
        myAccordion.openPanel(1);
        expect($("#item1")).toHaveClass("is-closed");
        expect($("#item2")).toHaveClass("is-open");
      });
    });

    describe("When only one panel is allowed to be open and we pass a selector", function() {
      beforeEach(function() {
        loadFixtures("accordion.html");
        window.myAccordion = new Accordion({
          parent: ".my-accordion"
        });
      });

      it("closes panel 1 and opens panel 2", function() {
        myAccordion.openPanel("#item1");
        expect($("#item1")).toHaveClass("is-open");
        myAccordion.openPanel("#item2");
        expect($("#item1")).toHaveClass("is-closed");
        expect($("#item2")).toHaveClass("is-open");
      });
    });

    describe("When multiple panels can be opened", function() {
      beforeEach(function() {
        loadFixtures("accordion.html");
        window.myAccordion = new Accordion({
          parent: ".my-accordion",
          multiplePanels: true
        });
      });

      it("opens panel 1", function() {
        myAccordion.openPanel(0);
        expect($("#item1")).not.toHaveClass("is-closed");
        expect($("#item1")).toHaveClass("is-open");
      });

      it("opens panel 2 and panel 1 remains open", function() {
        myAccordion.openPanel(0);
        expect($("#item1")).toHaveClass("is-open");
        myAccordion.openPanel(1);
        expect($("#item1")).not.toHaveClass("is-closed");
        expect($("#item1")).toHaveClass("is-open");
        expect($("#item2")).not.toHaveClass("is-closed");
        expect($("#item2")).toHaveClass("is-open");
      });

      it("does not open panel 1 because state is blocked", function() {
        myAccordion.block();
        $("#item1 .js-accordion-trigger").click();
        expect($("#item1")).not.toHaveClass("is-open");
        expect($("#item1")).toHaveClass("is-closed");
      });

      it("opens panel 1 after state is unblocked", function() {
        myAccordion.block();
        $("#item1 .js-accordion-trigger").click();
        expect($("#item1")).toHaveClass("is-closed");
        myAccordion.unblock();
        $("#item1 .js-accordion-trigger").click();
        expect($("#item1")).toHaveClass("is-open");
      });
    });

    describe("Animated heights", function() {

      describe("When open and closed height is assumed by default", function() {
        beforeEach(function() {
          loadFixtures("accordion.html");
          window.myAccordion = new Accordion({
            parent: ".my-accordion",
            animateHeights: true
          });
        });

        it("has a closed height", function() {
          var assumedClosedHeight;
          assumedClosedHeight = $(".my-accordion").find(".js-accordion-trigger").outerHeight();
          expect($("#item1").data("closed")).toEqual(assumedClosedHeight);
        });

        it("has an open height", function() {
          var assumedOpenHeight;
          assumedOpenHeight = $(".my-accordion").find(".js-accordion-trigger").outerHeight();
          expect($("#item1").data("open")).toEqual(assumedOpenHeight);
        });
      });

      describe("When open and closed height is specified", function() {
        beforeEach(function() {
          loadFixtures("accordion.html");
          window.myAccordion = new Accordion({
            parent: ".my-accordion",
            animateHeights: true,
            openHeight: 250,
            closedHeight: 50
          });
        });

        it("has an explicit closed height", function() {
          expect($("#item1").data("closed")).toEqual(50);
        });

        it("has an explicit open height", function() {
          expect($("#item1").data("open")).toEqual(250);
        });
      });

    });

  });

});
