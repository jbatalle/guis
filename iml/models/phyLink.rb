#class ViReqResource < ActiveRecord::Base
module BSON
  class ObjectId
    def to_json(*)
      to_s.to_json
    end
    def as_json(*)
      to_s.as_json
    end
  end
end

module Mongoid
  module Document
    def serializable_hash(options = nil)
      h = super(options)
      h['id'] = h.delete('_id') if(h.has_key?('_id'))
      h
    end
  end
end

class PhyLink
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

	#belongs_to :viReqNetworḱ
	#embedded_in :viReqNetworḱ, inverse_of: :comments
	#embeds_many :viReqPorts
  embedded_in :phy_network
#  embeds_many :phy_ports, cascade_callbacks: true

#  accepts_nested_attributes_for :phy_ports, reject_if: :all_blank, allow_destroy: true

  #accepts_nested_attributes_for :viReqPorts, reject_if: :all_blank, allow_destroy: true 

end