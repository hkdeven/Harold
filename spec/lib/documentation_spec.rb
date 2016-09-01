require 'spec_helper'

describe 'Documentation' do

  let(:path) { "/documentation/css" }
  let(:sections) {[
    {title: "JS", slug: "/js/first", section_slug: "/js"},
    {title: "CSS", slug: "/css/first", section_slug: "/css"}
  ]}
  let(:directory_listing) { ["app/docs/css/float.md", "app/docs/css/clear.md"] }

  before(:each) do
    @docs = Documentation.new(path)
    @docs.stub sections: sections, directory_listing: directory_listing
  end

  describe "stores path as an instance variable" do
    specify{ @docs.instance_variable_get(:@path).should eql(path) }
  end

  describe "page navigation" do

    describe "page_title" do
      specify{ @docs.page_title[:title].should eq "CSS" }
    end

    describe "secondary_nav_items" do
      let(:result) { @docs.secondary_nav_items[:items] }
      specify{ result[0][:title].should eq sections[0][:title]}
      specify{ result[1][:title].should eq sections[1][:title]}
      specify{ result[1][:slug].should eq "/documentation#{sections[1][:slug]}"}
      specify{ result[1][:current].should eq true}
    end

    describe "left nav" do
      let(:result) {@docs.left_nav_items[:groups][0][:items]}
      let(:path) { "/documentation/css/float" }
      specify{result[0][:name].should eq "Float" }
      specify{result[0][:active].should eq true }
      specify{result[1][:name].should eq "Clear" }
    end

  end

end
