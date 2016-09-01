module AdHelper

  AD_SENSE_ID = "ca-pub-7817033512402772"

  def ad_sense_properties(type)
    if type == "leaderboard"
      return { ad_slot: 8090484046, id: AD_SENSE_ID, style: "display: inline-block; width: 728px; height: 90px;" }
    elsif type == "responsive"
      return { ad_slot: 3297975641, id: AD_SENSE_ID , style: "display: block;", ad_format: "auto", }
    end
    { ad_slot: 2903404846, id: AD_SENSE_ID , style: "display: inline-block; width: 162px; height: 312px;" }
  end

  def ad_unit_data(type, props)
    attrs = {
      size: { mapping: type },
      targeting: { position: nil },
      extension: nil
    }

    attrs.merge!(props.symbolize_keys) if props.present?
    attrs[:targeting] = attrs[:targeting].to_json

    attrs
  end

end
