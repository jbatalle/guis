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

class ViNetwork
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  embeds_many :viResources

  #field :vi_resource_req, type: Array
  #field :viReqResource, type: Array
end
#class ViNetwork < ActiveRecord::Base
#	has_many :viResources
#	validates_uniqueness_of :name
#end