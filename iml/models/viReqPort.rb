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

class ViReqPort
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

	#belongs_to :viReqNetworḱ
	embedded_in :viReqResource
	#validates_uniqueness_of :name
=begin
	def as_json(options={})
		super(
			:except => [ :vi_req_network_id ],
		)
	end
=end
end