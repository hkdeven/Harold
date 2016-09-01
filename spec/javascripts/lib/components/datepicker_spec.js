define([
  "jquery",
  "public/assets/javascripts/lib/components/datepicker.js"
], function($, Datepicker) {

  "use strict";

  describe("Datepicker", function() {

    describe("Initialisation", function() {

      beforeEach(function() {
        loadFixtures("datepicker.html");
      });

      it("sets up the datepicker with default class names", function() {
        new Datepicker({ target: ".js-standard" });

        expect($(".js-standard .picker").length).toBe(2);
      });

      it("sets up the datepicker with custom class names", function() {
        new Datepicker({
          target: ".js-custom",
          startSelector: "#js-custom-start",
          endSelector: "#js-custom-end",
          startLabelSelector: ".js-custom-start-label",
          endLabelSelector: ".js-custom-end-label"
        });

        expect($(".js-custom .picker").length).toBe(2);
      });
    });

    describe("Functionality", function() {

      beforeEach(function() {
        loadFixtures("datepicker.html");
      });

      it("fires a given 'onDateSelect' callback when a date is selected", function() {
        var config = {
          callbacks: {
            onDateSelect: function() {}
          },
          target: ".js-standard"
        };

        spyOn(config.callbacks, "onDateSelect");

        new Datepicker(config);

        $("#js-av-start").trigger("focus");
        $(".picker--opened .picker__day--today").trigger("click");

        expect(config.callbacks.onDateSelect).toHaveBeenCalled();
      });

      it("can limit searching to only be in the past", function() {
        var cell, sibling;

        new Datepicker({
          pickPast: true,
          target: ".js-standard"
        });

        $("#js-av-start").trigger("focus");

        cell = $(".picker--opened .picker__day--today").closest("td");

        if (cell.next().length) {
          sibling = cell.next();
        } else {
          sibling = cell.parent().next().children().first();
        }

        expect(sibling.find(".picker__day")).toHaveClass("picker__day--disabled");
      });

      it("can allow searching for any date", function() {
        var cell, nextCell, prevCell;

        new Datepicker({
          pickFuture: true,
          pickPast: true,
          target: ".js-standard"
        });

        $("#js-av-start").trigger("focus");

        cell = $(".picker--opened .picker__day--today").closest("td");

        if (cell.next().length) {
          nextCell = cell.next();
        } else {
          nextCell = cell.parent().next().children().first();
        }

        expect(nextCell.find(".picker__day")).not.toHaveClass("picker__day--disabled");

        if (cell.prev().length) {
          prevCell = cell.next();
        } else {
          prevCell = cell.parent().prev().children().first();
        }

        expect(prevCell.find(".picker__day")).not.toHaveClass("picker__day--disabled");
      });

      describe("Choosing dates", function() {

        var instance, stubDate, $start, $end;

        beforeEach(function() {
          stubDate = new Date(2016, 4, 20);
          jasmine.clock().install()
          jasmine.clock().mockDate(stubDate);

          instance = new Datepicker({ target: ".js-standard" });
          $start = $("#js-av-start"),
          $end = $("#js-av-end");
        });

        afterEach(function() {
          jasmine.clock().uninstall();
        });

        it("selecting 'start' date opens 'end' picker", function() {
          expect($end).not.toHaveClass("picker__input--active");

          $start.data("pickadate").set("select", stubDate);
          $start.data("pickadate").close();

          expect($end).toHaveClass("picker__input--active");
          expect($start).not.toHaveClass("picker__input--active");
        });

        it("selecting 'end' date opens 'start' picker", function() {
          expect($start).not.toHaveClass("picker__input--active");

          $end.data("pickadate").set("select", stubDate);
          $end.data("pickadate").close();

          expect($start).toHaveClass("picker__input--active");
          expect($end).not.toHaveClass("picker__input--active");
        });

        describe("Invalid dates auto correction", function() {
          var startDaysSelector = ".js-start-container .picker__day--infocus:not(.picker__day--disabled)",
              endDaysSelector = ".js-end-container .picker__day--infocus:not(.picker__day--disabled)",
              selectedStartDaySelector = ".js-start-container .picker__day--selected",
              selectedEndDaySelector = ".js-end-container .picker__day--selected";

          describe("selecting 'end' date earlier than 'start' date opens 'start' picker", function() {

            it("and sets its date to the day before by default", function() {
              $start.focus();
              $(startDaysSelector).filter(":contains('23')").trigger("click");
              $(endDaysSelector).filter(":contains('22')").trigger("click");

              expect($start).toHaveClass("picker__input--active");
              expect($(selectedStartDaySelector).text()).toBe("21");
            });

            it("and sets its date to the same day if 'allowSameDate' option is set", function() {
              instance.config.allowSameDate = true;
              instance.init();

              $start.focus();
              $(startDaysSelector).filter(":contains('23')").trigger("click");
              $(endDaysSelector).filter(":contains('22')").trigger("click");

              expect($start).toHaveClass("picker__input--active");
              expect($(selectedStartDaySelector).text()).toBe("22");
            });
          });

          describe("selecting 'start' date later than 'end' date opens 'end' picker", function() {

            it("and sets its date to the day after by default", function() {
              $end.focus();
              $(endDaysSelector).filter(":contains('23')").trigger("click");
              $(startDaysSelector).filter(":contains('24')").trigger("click");

              expect($end).toHaveClass("picker__input--active");
              expect($(selectedEndDaySelector).text()).toBe("25");
            });

            it("and sets its date to the same day if 'allowSameDate' option is set", function() {
              instance.config.allowSameDate = true;
              instance.init();

              $end.focus();
              $(endDaysSelector).filter(":contains('23')").trigger("click");
              $(startDaysSelector).filter(":contains('24')").trigger("click");

              expect($end).toHaveClass("picker__input--active");
              expect($(selectedEndDaySelector).text()).toBe("24");
            });
          });
        });
      });
    });
  });
});
