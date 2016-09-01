Then /^there should not be any javascript errors$/ do
  # The capybara webkit way:
  page.try(:driver).try(:error_messages).should be_blank
end

Then /^(?:I )?take a screenshot$/ do 
  # From capybara-webkit.  Requires mini_magick and ImageMagick
  if page.respond_to?(:driver) and page.driver.respond_to?(:render)
    page.driver.render "tmp/screenshot_#{Time.now.to_i}.png"
  end
end