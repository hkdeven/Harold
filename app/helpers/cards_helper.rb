module CardsHelper

  def card_classes(props)
    [
      "card",
      "js-card",
      "card--#{props[:kind] || 'general'}",
      "card--#{props[:fixed?] ? 'fixed' : 'flexible'}",
      # Cards are short by default in list view
      "card--list--#{props[:tall_listing?] ? 'tall' : 'short'}",
      # Cards are tall by default in column view
      "card--column--#{props[:short?] ? 'short' : 'tall' }",
      "card--column--#{props[:double?] ? 'double' : 'single'}",
      "card--#{props[:cover?] ? 'cover' : 'no-cover'}",
      "card--#{props[:image_url].present? ? 'has-img' : 'no-img'}",
      "card--#{props[:price_tag].present? ? 'has-price' : 'no-price'}",
      "card--#{props[:author_name].present? || props[:context_locale].present? || (props[:tags] && props[:tags][:lp_reviewed?]) ? 'has-footer' : 'no-footer'}"
    ]
  end

  def card_href_for_test_variation(props, variation=nil)
    url = props[:url]

    if url.present? && variation
      url += "#{props[:url].match(/\?/) ? '&' : '?'}ctv=#{variation}"
    end

    url
  end

  def card_link_data(props)
    card_tracking_data(props).merge(card_layer_data(props))
  end

  def card_tracking_data(props)
    return {} unless props[:tracking].present?
    {
      lpa_category: props[:tracking][:category],
      lpa_action: props[:tracking][:action],
      lpa_label: props[:tracking][:label]
    }
  end

  def card_layer_data(props)
    return {} unless props[:layer?]
    {
      lightbox: {
        showpreloader: 'true',
        class: 'lightbox--layer'
      }
    }
  end

  def card_from_widget_data(data, index)
    {
      fixed?: true,
      cover?: true,
      short?: index > 2,
      double?: index.zero?,
      kind: 'flickr',
      url: data[:url],
      title: data[:image_title],
      image_url: data[:image_url],
      image_alt: data[:image_title],
      author_name: data[:owner_name],
      author_avatar: data[:owner_image],
      tags: { position: index + 1 }
    }
  end

  def card_icon(props)
    props[:kind] == 'need-to-know' ? 'information' : props[:kind]
  end

  def card_link_if(condition, *props)
    if condition
      haml_tag(:a, *props){ yield }
    else
      yield
    end
  end

  def card_grid_classes(is_double: false, has_rail: false)
    class_names = ['col--one-whole']

    if is_double
      class_names += ['nv--col--one-whole', 'mv--col--two-thirds', 'lv--col--one-half']

      if has_rail
        class_names += ['wv--col--two-thirds', 'cv--col--one-half']
      else
        class_names += ['wv--col--two-fifths']
      end
    else
      class_names += ['nv--col--one-half', 'mv--col--one-third', 'lv--col--one-quarter']

      if has_rail
        class_names += ['wv--col--one-third', 'cv--col--one-quarter']
      else
        class_names += ['wv--col--one-fifth']
      end
    end

    class_names
  end

  def card_grid_helper(card_index: 0, is_double: false, is_mpu: false, is_row: false, has_rail: false, reset: false)
    class_str = card_grid_classes(is_double: is_double || is_mpu, has_rail: has_rail)

    @grid_helper_doubles = 0 if  @grid_helper_doubles.nil? || card_index == 0 || reset
    @grid_helper_doubles += 1 if is_double

    class_str << 'col--right' if is_mpu

    position_index = card_index + @grid_helper_doubles

    if card_index > 0
      class_str << 'nv--clear' if position_index % 2 == 0
      class_str << 'mv--clear' if position_index % 3 == 0
      class_str << 'lv--clear' if position_index % 4 == 0
      class_str << 'wv--clear' if has_rail && position_index % 3 == 0
      class_str << 'cv--clear' if has_rail && position_index % 4 == 0
      class_str << 'wv--clear' if !has_rail && position_index % 5 == 0

      if is_row
        class_str << 'mv--hide wv--hide' if has_rail && position_index % 3 == 0
        class_str << 'wv--hide' if !has_rail && position_index % 4 == 0
      end
    end

    class_str
  end

end
