require 'spec_helper'

describe GoogleApiHelper do

  describe "Google JS API URI" do

    it "should return a uri to the Google JS API with the key set" do
      helper.google_js_api_uri.should eq "http://www.google.com/jsapi?key=AIzaSyBQxopw4OR08VaLVtHaY4XEXWk3dvLSj5k"
    end

    it "should allow you to set a different API key" do
      helper.google_js_api_uri('wombats!').should eq "http://www.google.com/jsapi?key=wombats!"
    end

  end

  describe "Google Maps URL" do

    let(:latitude) { 51.5073 }
    let(:longitude) { -0.1277 }

    it "should return a URL based on given coordinates" do
      helper.google_maps_url(latitude, longitude).should eq "https://www.google.com/maps/place/51.5073,-0.1277/"
    end

  end

  describe "Static Maps image SRC" do

    context "without markers" do

      let(:properties) do
        {
          zoom: 15,
          scale: 2,
          width: 320,
          height: 240,
          marker: false,
          latitude: 51.5073,
          longitude: -0.1277
        }
      end

      it "should return static map SRC" do
        helper.google_static_map_src(properties, false, 123).should eq "https://maps.googleapis.com/maps/api/staticmap?key=123&size=320x240&zoom=15&scale=2&center=51.5073,-0.1277"
      end

    end

    context "with markers" do

      let(:properties) do
        {
          zoom: 15,
          scale: 2,
          width: 320,
          height: 240,
          marker: true,
          latitude: 51.5073,
          longitude: -0.1277,
          icon: "http://assets.staticlp.com/assets/shared/poi-map-marker.png",
          icon_scale: 1
        }
      end

      it "should return static map SRC" do
        helper.google_static_map_src(properties, false, 123).should eq "https://maps.googleapis.com/maps/api/staticmap?key=123&size=320x240&zoom=15&scale=2&markers=scale:1|icon:http%3A%2F%2Fassets.staticlp.com%2Fassets%2Fshared%2Fpoi-map-marker.png|51.5073,-0.1277"
      end

    end

  end

end
