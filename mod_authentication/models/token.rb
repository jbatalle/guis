class Token < ActiveRecord::Base
	include BCrypt
	#validates_uniqueness_of   :user_id, :token
end
