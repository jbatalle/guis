class Vi < ActiveRecord::Base
	has_many :vi_resources, :dependent => :destroy
	validates_uniqueness_of :name
	
	has_and_belongs_to_many :sps
end
