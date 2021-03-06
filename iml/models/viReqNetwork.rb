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

class ViReqNetwork
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  #embeds_many :viReqResources, cascade_callbacks: true
  embeds_many :vi_req_resources, cascade_callbacks: true

  accepts_nested_attributes_for :vi_req_resources, reject_if: :all_blank, allow_destroy: true

  #field :vi_resource_req, type: Array
  #field :viReqResource, type: Array
end