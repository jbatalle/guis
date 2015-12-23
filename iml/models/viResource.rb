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

class ViResource
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

	embedded_in :vi_network
  embeds_many :vi_ports

end
#class ViResource < ActiveRecord::Base
#	belongs_to :viNetwork
#	validates_uniqueness_of :name
#end