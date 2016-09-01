module GoogleApiHelper

  API_KEY = "AIzaSyBQxopw4OR08VaLVtHaY4XEXWk3dvLSj5k"

  def google_js_api_uri(key=API_KEY)
    javascript_path "http://www.google.com/jsapi?key=#{key}"
  end

  def google_maps_url(latitude, longitude)
    "https://www.google.com/maps/place/#{latitude},#{longitude}/"
  end

  def google_static_map_src(properties, use_stylers=true, key=API_KEY)
    src = "https://maps.googleapis.com/maps/api/staticmap"
    src += "?key=#{key}"
    src += "&size=#{properties[:width]}x#{properties[:height]}"
    src += "&zoom=#{properties[:zoom]}&scale=#{properties[:scale]}"

    if properties[:marker]
      src+= "&markers=scale:#{properties[:icon_scale]}|icon:#{CGI.escape(properties[:icon])}|#{properties[:latitude]},#{properties[:longitude]}"
    else
      src+= "&center=#{properties[:latitude]},#{properties[:longitude]}"
    end

    if use_stylers
      stylers = [
        "feature:water|element:geometry|color:0xcbdae7",
        "feature:landscape.man_made|element:geometry.fill|color:0xeff1f3",
        "feature:road|element:labels.text.stroke|color:0xffffff",
        "feature:road.arterial|element:geometry.fill|color:0xffffff",
        "feature:road.arterial|element:geometry.stroke|visibility:off",
        "feature:road.highway|element:geometry.fill|color:0x16c98d",
        "feature:road.highway|element:geometry.stroke|visibility:off",
        "feature:road.local|element:geometry.stroke|visibility:off",
        "feature:road.local|element:labels|visibility:off",
        "feature:poi.park|element:geometry.fill|color:0xc8e6aa",
        "feature:poi.school|element:geometry|color:0xdfdad3",
        "feature:poi.medical|element:geometry|color:0xfa5e5b"
      ]

      src+= "&style=#{stylers.join('&style=')}"
    end

    src
  end

end
