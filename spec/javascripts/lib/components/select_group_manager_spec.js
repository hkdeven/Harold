define([ "public/assets/javascripts/lib/components/select_group_manager" ], function(SelectGroupManager) {

  describe("Select Group Manager", function() {

    var instance, $overlay, $select, $form;

    beforeEach(function() {
      loadFixtures("select_group_manager.html");
      instance = new SelectGroupManager();

      $select = $(".js-select");
      $form = $(".select-manager-form");
      $overlay = $(".js-select-overlay");
    });

    describe("initialization", function() {
      it("binds events to the wrapping element", function() {
        expect(instance.$selectContainers.length).toBe(1);
      });
    });

    describe("visual", function() {
      it("adds the selected class on focus", function() {
        $select.trigger("focus");
        expect($overlay.hasClass("is-selected")).toBe(true);
      });

      it("adds the selected class on blur", function() {
        $select.trigger("focus");
        expect($overlay.hasClass("is-selected")).toBe(true);
      });

      it("updates the label overlay on change", function() {
        $select.val("bar").change();
        expect($overlay.html()).toBe("Bar");
      });
    });

    describe("form submission", function() {
      beforeEach(function() {
        window.submit = function() {};
        spyOn(window, "submit");

        $form.on("submit", function(e) {
          e.preventDefault();
          window.submit();
          false;
        });

        $select.data("form-submit", true).val("bar").change();
      });

      it("submits the form", function() {
        expect(window.submit).toHaveBeenCalled();
      });
    });

  });

});
