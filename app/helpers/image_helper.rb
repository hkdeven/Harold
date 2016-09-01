module ImageHelper
  def safe_image_tag(image_url, opts={})
    return if image_url.blank?
    if lazyload = opts.delete(:lazyload)
      lazyloaded_image_tag(image_tag(image_url, opts))
    else
      image_tag(image_url, opts)
    end
  end

  def lazyloaded_image_tag(image)
    html = raw("<div data-uncomment=true>")
    html += raw("<!-- #{image.to_s} -->")
    html += raw("</div>")
    html.html_safe
  end

  def srcset_url(opts={}, src, retina)
    std_format = ImageResizer::Format.from_hash(opts)
    std_url = ImageResizer.url_for(src, std_format)

    if retina
      scale_factor = 1.5
      retina_opts = opts.dup

      if resize = retina_opts[:resize]
        resize[:width]  = resize[:width].to_i  * scale_factor if resize[:width]
        resize[:height] = resize[:height].to_i * scale_factor if resize[:height]
        retina_opts[:resize] = resize
      end

      if crop = retina_opts[:crop]
        crop[:width]    = crop[:width].to_i    * scale_factor if crop[:width]
        crop[:height]   = crop[:height].to_i   * scale_factor if crop[:height]
        crop[:x_offset] = crop[:x_offset].to_i * scale_factor if crop[:x_offset]
        crop[:y_offset] = crop[:y_offset].to_i * scale_factor if crop[:y_offset]
        retina_opts[:crop] = crop
      end

      retina_opts[:optimize] = {quality: 85}

      retina_format = ImageResizer::Format.from_hash(retina_opts)
      retina_url    = ImageResizer.url_for(src, retina_format)

      return "#{std_url}, #{retina_url} 2x"
    else
      std_url
    end
  end

end
