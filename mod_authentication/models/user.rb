class User < ActiveRecord::Base
	#include DataMapper::Resource
	include BCrypt
	attr_accessor :password, :password_confirmation
	validates_presence_of   :name, :email
	validates_uniqueness_of :name, :email
	validates_presence_of     :password, :on => :create
	validates_length_of       :password, :minimum => 6, :on => create
	validates_confirmation_of :password
	#belongs_to :tenant
	has_and_belongs_to_many :roles
	
	serialize :roles
	
	before_validation on: :create do
		self.roles << Role.find_by(name: 'guest')
	end
	
	def role?(role)
		return !!self.roles.find_by_name(role.to_s)
	end
	
	def as_json(options={})
		super(
			:include => [ :roles],
			:except => [ :password_hash, :password_salt, :activation_hash, :password_reset_hash]
		)
	end
end
