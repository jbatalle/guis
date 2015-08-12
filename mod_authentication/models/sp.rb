class SP < ActiveRecord::Base
	#include DataMapper::Resource
	has_many :users
	validates_uniqueness_of :name
	
	has_and_belongs_to_many :vis
	
	serialize :vis
	
	def as_json(options={})
		super(
			:include => [ :vis ]
		)
	end
end
