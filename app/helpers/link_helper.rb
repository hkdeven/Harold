require 'cgi'

module LinkHelper
  def enable_mailto_links(text)
    text = CGI::escapeHTML(text)
    pat  = /([\w\-\.]+@[\w\-]+\.[\w\-\.]+)/
    text.gsub pat, '<a href="mailto:\1">\1</a>'
  end
end
