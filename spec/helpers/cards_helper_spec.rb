require 'spec_helper'

describe CardsHelper do

  before do
    class << helper
      include Haml, Haml::Helpers
    end
    helper.init_haml_helpers
  end

  describe "#card_classes" do

    it "returns an array of structural class names for the given properties" do
      result = helper.card_classes(
        tall_listing?: true,
        double?: true,
        cover?: true,
        kind: "article"
      )

      result.should include("card--list--tall")
      result.should include("card--column--tall")
      result.should include("card--column--double")
      result.should include("card--cover")
      result.should include("card--article")

      result = helper.card_classes(
        short?: true,
        cover?: true,
        fixed?: true
      )

      result.should include("card--list--short")
      result.should include("card--column--single")
      result.should include("card--column--short")
      result.should include("card--fixed")
    end

    describe "returns an array of content class names for the given properties" do

      it "should add 'has' class names when given content" do
        result = helper.card_classes(
          image_url: "path/to/image",
          author_name: "Joe Bloggs",
          price_tag: {
            price: 123,
            currency: "£"
          }
        )

        result.should include("card--has-img")
        result.should include("card--has-footer")
        result.should include("card--has-price")
      end

      it "should add 'no' class names when given no content" do
        result = helper.card_classes(
          image_url: nil,
          meta_description: nil
        )

        result.should include("card--no-img")
        result.should include("card--no-footer")
        result.should include("card--no-price")
      end

    end

  end

  describe "#card_href_for_test_variation" do
    let(:var)   { nil }
    let(:url)   { "/path/to/thing" }
    let(:props) { { url: url } }

    context "with no variation" do
      it "returns the original URL" do
        result = helper.card_href_for_test_variation(props, var)
        result.should eq(url)
      end
    end

    context "with test variation" do
      let(:var) { 1 }

      context "when the URL has no QS" do
        it "returns the URL appended with variation" do
          result = helper.card_href_for_test_variation(props, var)
          result.should eq("#{url}?ctv=1")
        end
      end

      context "when the URL has a QS" do
        let(:url) { "/path/to/thing?foo=bar" }

        it "returns the URL appended with variation" do
          result = helper.card_href_for_test_variation(props, var)
          result.should eq("#{url}&ctv=1")
        end
      end
    end

  end

  describe "#card_link_data" do
    let(:tracking_data) { { category: "lodgings" } }
    let(:lightbox_data) { { lightbox: true } }

    before(:each) do
      helper.stub(:card_tracking_data).and_return(tracking_data)
      helper.stub(:card_layer_data).and_return(lightbox_data)
    end

    it "should return tracking and lightbox data" do
      result = helper.card_link_data({})

      result.should eq(
        :category => tracking_data[:category],
        :lightbox => lightbox_data[:lightbox]
      )
    end
  end

  describe "#card_tracking_data" do

    let(:tracking_data) do
      {
        category: "lodgings",
        action: "view",
        label: "/path/to/lodging"
      }
    end

    it "should return properties for given tracking hash" do
      result = helper.card_tracking_data(tracking: tracking_data)

      result.should eq(
        lpa_category: tracking_data[:category],
        lpa_action: tracking_data[:action],
        lpa_label: tracking_data[:label]
      )
    end

  end

  describe "#card_link_if" do

    let(:link_url) { "path/to/thing" }

    it "should return an anchor element with given properties if condition is true" do
      result = helper.capture_haml do
        helper.card_link_if(true, href: link_url) {}
      end

      result.should eq "<a href='#{link_url}'>\n</a>\n"
    end

  end

  describe "#card_grid_helper" do

    describe "returns a list of class names" do
      context "for a single width card" do
        it "adds single column classes" do
          result = helper.card_grid_helper()
          result.should include("col--one-whole")
          result.should include("nv--col--one-half")
          result.should include("mv--col--one-third")
          result.should include("lv--col--one-quarter")
          result.should include("wv--col--one-fifth")
        end
      end

      context "for a double width card" do
        it "adds multiple column classes" do
          result = helper.card_grid_helper(is_double: true)
          result.should include("col--one-whole")
          result.should include("mv--col--two-thirds")
          result.should include("lv--col--one-half")
          result.should include("wv--col--two-fifths")
        end
      end

      context "for an MPU card" do
        it "adds multiple column classes and right modifier" do
          result = helper.card_grid_helper(is_mpu: true)
          result.should include("col--right")
          result.should include("col--one-whole")
          result.should include("mv--col--two-thirds")
          result.should include("lv--col--one-half")
          result.should include("wv--col--two-fifths")
        end
      end
    end

    describe "adds clear left classes to correct cards" do
      context "for the third card" do
        it "adds a clear for narrow view" do
          result = helper.card_grid_helper(card_index: 2, reset: true)

          result.should     include("nv--clear")
          result.should_not include("mv--clear")
          result.should_not include("lv--clear")
          result.should_not include("wv--clear")
        end
      end

      context "for the fourth card" do
        it "adds a clear for medium view" do
          result = helper.card_grid_helper(card_index: 3, reset: true)

          result.should_not include("nv--clear")
          result.should     include("mv--clear")
          result.should_not include("lv--clear")
          result.should_not include("wv--clear")
        end
      end

      context "for the fifth card" do
        it "adds a clear for narrow and large views" do
          result = helper.card_grid_helper(card_index: 4, reset: true)

          result.should     include("nv--clear")
          result.should_not include("mv--clear")
          result.should     include("lv--clear")
          result.should_not include("wv--clear")
        end
      end

      context "for the sixth card" do
        it "adds a clear for wide view" do
          result = helper.card_grid_helper(card_index: 5, reset: true)

          result.should_not include("nv--clear")
          result.should     include("wv--clear")
          result.should_not include("mv--clear")
          result.should_not include("lv--clear")
        end
      end

      context "for the seventh card" do
        it "adds a clear for narrow, medium and cinema views" do
          result = helper.card_grid_helper(card_index: 6, reset: true)

          result.should     include("nv--clear")
          result.should     include("mv--clear")
          result.should_not include("lv--clear")
          result.should_not include("wv--clear")
        end
      end

      context "when using rows" do
        it "hides the 5th card for wide views" do
          result = helper.card_grid_helper(card_index: 4, reset: true, is_row: true)
          result.should include("wv--hide")
        end
      end

      context "with ad rail" do

        context "for a double width card" do
          it "adds multiple column classes" do
            result = helper.card_grid_helper(is_double: true, reset: true, has_rail: true)
            result.should include("col--one-whole")
            result.should include("mv--col--two-thirds")
            result.should include("lv--col--one-half")
            result.should include("wv--col--two-thirds")
            result.should include("cv--col--one-half")
          end
        end

        context "for the fourth card" do
          it "adds a clear for medium view" do
            result = helper.card_grid_helper(card_index: 3, reset: true, has_rail: true)

            result.should_not include("nv--clear")
            result.should     include("mv--clear")
            result.should_not include("lv--clear")
            result.should     include("wv--clear")
            result.should_not include("cv--clear")
          end
        end

        context "for the fifth card" do
          it "adds a clear for narrow and large views" do
            result = helper.card_grid_helper(card_index: 4, reset: true, has_rail: true)

            result.should     include("nv--clear")
            result.should_not include("mv--clear")
            result.should     include("lv--clear")
            result.should_not include("wv--clear")
            result.should     include("cv--clear")
          end
        end

        context "when using rows" do
          it "hides the 4th card for wide views" do
            result = helper.card_grid_helper(card_index: 3, reset: true, has_rail: true, is_row: true)
            result.should include("mv--hide wv--hide")
          end
        end

      end

    end

  end

end
