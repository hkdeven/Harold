require 'spec_helper'

describe AdHelper do

  describe '#ad_sense_properties' do

    it 'returns the correct dimensions for a default ad' do
      helper.ad_sense_properties("default").should == { ad_slot: 2903404846, id: "ca-pub-7817033512402772", style: "display: inline-block; width: 162px; height: 312px;"}
    end

    it 'returns the correct dimensions for a leaderboard ad' do
      helper.ad_sense_properties("leaderboard").should == { ad_slot: 8090484046, id: "ca-pub-7817033512402772", style: "display: inline-block; width: 728px; height: 90px;"}
    end

    it 'returns the correct dimensions for a responsive ad' do
      helper.ad_sense_properties("responsive").should == { ad_slot: 3297975641, id: "ca-pub-7817033512402772", style: "display: block;", ad_format: "auto"}
    end

  end

  describe '#ad_unit_data' do

    let(:ad_type)  { 'mpu' }
    let(:ad_props) { nil }

    context 'with no properties' do
      it 'returns default properties' do
        result = helper.ad_unit_data(ad_type, ad_props)
        result[:size][:mapping].should == ad_type
      end
    end

    context 'with properties' do
      let(:ad_props) do
        {
          size: {
            mapping: 'foo'
          },
          targeting: {
            position: 'stack'
          }
        }
      end

      it 'merges the properties into the defaults' do
        result = helper.ad_unit_data(ad_type, ad_props)
        result[:size][:mapping].should == ad_props[:size][:mapping]
      end

      it 'encodes the targeting attribute as JSON' do
        result = helper.ad_unit_data(ad_type, ad_props)
        result[:targeting].should == ad_props[:targeting].to_json
      end
    end

  end

end
