require 'spec_helper'

describe 'components/_hero_banner.html.haml' do

  describe 'an email address in the image caption' do
    it 'is rendered as a mailto: link' do
      view.stub(properties: {image_caption: 'a gaggle of giggling geese@goose.com'})
      render
      expect(rendered).to have_css('p.copy--body a[href^="mailto:"]')
    end
  end

  describe 'an image caption lacking an email address' do
    it 'will not render a mailto: link' do
      view.stub(properties: {image_caption: 'a gaggle of giggling gooses'})
      render
      expect(rendered).to_not have_css('p.copy--body a[href^="mailto:"]')
    end
  end
end
