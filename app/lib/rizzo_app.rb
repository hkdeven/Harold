class RizzoApp

  class << self
    attr_reader :root

    def set_root(root)
      @root = root
    end
  end

  def initialize(path)
    @path = path
    @page_hopper_sections = flatten_page_hopper_sections
  end

  def page_title
    {
      title: active_section[:title],
      is_body_title: true,
      icon: "housekeeping"
    }
  end

  def primary_nav_items
    @primary_nav_items ||= load_yaml_file('data/styleguide/primary_nav')
  end

  def secondary_nav_items
    {
      items: sections.map do |section|
        {
          title: section[:title],
          slug: "#{root}#{section[:slug]}",
          current: section[:title] == active_section[:title],
          submenu: section[:submenu]
        }
      end
    }
  end

  def left_nav_items
    @left_nav ||= build_left_nav
  end

  def page_hopper_sections
    { sections: @page_hopper_sections }
  end


  private

  def build_left_nav(active_left_nav = {})

    return active_left_nav unless left_nav_for_section

    active_left_nav[:groups] = left_nav_for_section.map do |group|
      group[:items].each do |item|
        item[:slug] = "#{preceding_slug}#{item[:slug]}"
        item[:active] = (item[:slug] == @path) ? true : false
        item[:extra_style] = (item[:name] == "Konami") ? "nav--left__item--konami" : nil
        item
      end
      group
    end

    active_left_nav
  end

  def preceding_slug
    @preceding_slug ||= "#{root}#{active_section[:slug]}/"
  end

  def left_nav_for_section
    @left_nav_for_section ||= left_nav[:"#{active_section[:slug].gsub(/^\//, "").gsub(/[ -]/, "_")}"]
  end

  def root
    self.class.root
  end

  def active_section
    if section_from_slug = @path.match(/(performance|styleguide|documentation)\/([^\/]+)/)
      sections.map{|s| return s if s[:slug].include? section_from_slug[2]}
    end
    sections[0]
  end

  def flatten_page_hopper_sections
    converted_sections = flatten_page_hopper_section(sg_sections[:left_nav])

    converted_sections.push({ title: "Style Guide", slug: "/styleguide" })
    converted_sections.push({ title: "Performance Monitoring", slug: "/performance" })

    converted_sections.concat flatten_page_hopper_section(sg_sections[:secondary_nav])
  end

  def flatten_page_hopper_section section
    section.inject([]) do |result, (k,v)|
      styleguide_slug = k.to_s
      v.each do |k2,v2|
        group_slug = k2.to_s.gsub('_', '-')

        if v2.nil?
          result << { title: "#{k2[:title]}", slug: File.join('', styleguide_slug, k2[:slug]) }
        else
          v2.each do |h|
            group_title = h[:title]
            h[:items].each do |h2|
              result << { title: "#{group_title} - #{h2[:name]}", slug: File.join('', styleguide_slug, group_slug, h2[:slug]) }
            end
          end
        end
      end

      result
    end
  end

  def sg_sections
    @sg_sections ||= {
      left_nav: {
        styleguide: load_yaml_file('data/styleguide/left_nav'),
        performance: load_yaml_file('data/performance-monitoring/left_nav')
      },
      secondary_nav: {
        styleguide: load_yaml_file('data/styleguide/secondary_nav'),
        performance: load_yaml_file('data/performance-monitoring/secondary_nav')
      }
    }
  end

  def load_yaml_file(relative_path)
    YAML.load_file(File.expand_path("../../#{relative_path}.yml", __FILE__))
  end

end
