require 'spec_helper'

describe 'Rizzo' do

  let(:root) { "/styleguide" }
  let(:path) { "/styleguide/components" }

  let(:sections) {[
    {title: "foo", slug: "/foo"},
    { title: "components", submenu: [], slug: "/components" }
  ]}

  let(:left_nav) {{
    components: [
      { items: [
        {
          name: "component one",
          slug: "component-one"
        }, {
          name: "component two",
          slug: "component-two"
        }
      ]}
    ]
  }}

  before(:each) do
    @rizzo = RizzoApp.new(path)
    @rizzo.stub sections: sections, left_nav: left_nav, root: root
  end

  describe "stores path as an instance variable" do
    specify{ @rizzo.instance_variable_get(:@path).should eql(path) }
  end

  describe "page navigation" do

    describe "page_title" do
      specify{ @rizzo.page_title[:title].should eq "components" }
      specify{ @rizzo.page_title[:is_body_title].should eq true }
      specify{ @rizzo.page_title[:icon].should eq "housekeeping" }
    end

    describe "secondary_nav_items" do
      let(:result) { @rizzo.secondary_nav_items[:items] }

      specify{ result[1][:title].should eq sections[1][:title]}
      specify{ result[1][:slug].should eq "#{root}#{sections[1][:slug]}"}

      specify{ result[1][:current].should eq true}
      specify{ result[0][:current].should eq false}
    end

    describe "left nav" do

      describe "no items" do
        let(:path) { "/styleguide/bar" }
        specify{@rizzo.left_nav_items.should eq({})}
      end

      describe "with items" do

        let(:result) {@rizzo.left_nav_items[:groups][0][:items]}

        describe "first item" do
          let(:path) { "/styleguide/components/component-one" }
          specify{result.first[:active].should eq true }
        end

        describe "second item" do
          let(:path) { "/styleguide/components/component-two" }
          specify{result.last[:active].should eq true }
        end

        describe "konami" do
          let(:left_nav) { { components: [{ items: [{ name: "Konami", slug: "konami" }]}] } }
          specify{result.first[:extra_style].should eq "nav--left__item--konami" }
        end

      end

    end

  end

end
