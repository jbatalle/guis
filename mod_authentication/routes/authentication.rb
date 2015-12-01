# @see Authentication
class Authentication < Sinatra::Application
	set(:auth) do |*roles|   # <- notice the splat here
		condition do
			token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
			unless token && check_expiration(token)
				halt 401, {'Content-Type' => 'text/plain'}, 'Token expired. Login please.'
			end
			user = User.find(token.user_id)
			unless token && roles.any? {|role| user.role? role }
				halt 401, {'Content-Type' => 'text/plain'}, 'No privileges to access there.'
			end
		end
	end

	# @method status
	# @overload post '/register'
	# 	Post name and password in Form mode, e.g. user['name'], user['password']
	# 	@param [JSON]
	# Post a user
	post "/register" do
		user = User.new
		#user.name = params[:user][:name]
		user.name = params[:username].downcase
		user.password = params[:password]
		user.password_salt = BCrypt::Engine.generate_salt
		user.password_hash = BCrypt::Engine.hash_secret(params[:password], user.password_salt)
		if params[:tenant] != nil
			tenant = Tenant.new(:name => params[:tenant])
			begin
				tenant.save!
			rescue => ex
				tenant = Tenant.where(:name => params[:tenant], :active => 0).first
			end
			user.tenant = tenant
		end
		
		user.email = params[:email]
		user.fullname = params[:fullname]
		user.active = 0
		user.roles << Role.where(name: "tenantuser").first
		begin
			user.save!
			sendRegistermMail(user.email)
			sendInformMail(user.name)
			status 201
		rescue => ex
			puts "Error #{$!}"
			halt 422, {'Content-Type' => 'text/plain'}, ex.message
		end
	end

	post "/login" do
		logger.error env
		logger.error request.env['HTTP_X_CLIENT_IP']
		ip = request.env['HTTP_X_CLIENT_IP']
		print params
		print params.to_json
		if user = User.where(:name => params[:username].downcase).first
			if user.active == 1
				if user.password_hash == BCrypt::Engine.hash_secret(params[:password], user.password_salt)
					token = BCrypt::Engine.generate_salt
					tkn = {user_id: user.id, token: token, expiration: Time.now.to_i + (60*60*2)}

					Token.create(tkn)
					
					user.last_login_ip = ip
					user.last_login_timestamp = Time.now
					user.failed_logins = 0
					user.save!
					
					Login.new( :user_id => user.id, :ip => ip, :logged => true).save!

					#user.logins = login.logins
					#user.save!
					
					#LoginEvent.new(:user_id => user.id, :logged => true).save!
		
					return tkn.to_json;
				else
					user.last_failed_login_timestamp = Time.now
					user.failed_logins = user.failed_logins.to_i + 1
					user.last_failed_login_ip = ip
					user.save!
					Login.new( :user_id => user.id, :ip => ip, :logged => false).save!
					halt 401, {'Content-Type' => 'text/plain'}, 'User/Password combination does not match'
				end
			else
				halt 401, {'Content-Type' => 'text/plain'}, 'Sorry, this user is not active.'
			end
		else
			halt 401, {'Content-Type' => 'text/plain'}, 'That user is not recognised'
		end
		#403 – Account is not Active
	end

	post "/logout" do
		if token = Token.where(:user_id => params[:user_id]).first
			print token
			token.delete
			halt 200, {'Content-Type' => 'text/plain'}, 'Logout correct.'
		else
			logger.error 'Some error during the logout'
			halt 401, {'Content-Type' => 'text/plain'}, 'You are not logged'
		end
	end

	get "/profile" do
		if request.env['HTTP_X_AUTH_TOKEN'].present?
			token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
			if token
				user = User.find(token.user_id)
				return user.to_json
			else
				halt 401, {'Content-Type' => 'text/plain'}, 'Token invalid'
			end
		end
	end

	post "/forgotpass" do
		user = User.where(:email => params[:email]).first
		user.password_reset_hash = BCrypt::Engine.generate_salt
		recoverPassMail(user.email, password_reset_hash)
	end

	post "/recoverpass" do
		params[:verification_code]
		user = User.where(:email => params[:email], :password_reset_hash => params[:verification_code]).first
		user.password = params[:password]
		user.password_salt = BCrypt::Engine.generate_salt
		user.password_hash = BCrypt::Engine.hash_secret(params[:password], user.password_salt)
		if user.password == password_confirmation
			user.password_reset_hash = ''
			user.save!
		end
		status 200
	end

	#update profile
	put "/profile" do
		token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
		user = User.find(token.user_id)

		profile, errors = parse_json(request.body.read)
        return 400, errors if errors

		print profile.to_json

		user.email = profile['email']
		#user.tenant_id = profile['tenannt_i']
		user.fullname = profile['fullname']

		begin
			user.save!
		rescue => ex
			halt 400, {'Content-Type' => 'text/plain'}, ex.message
		end
		status 200
	end

	#update password
	put "/profile/pass" do
		token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
		user = User.find(token.user_id)

		profile, errors = parse_json(request.body.read)
        return 400, errors if errors

		#check if old password is correct
		if user.password_hash == BCrypt::Engine.hash_secret(profile['old_password'] , user.password_salt)
			if profile['password'] == profile['re_password']
				user.password = profile['password']
				user.password_salt = BCrypt::Engine.generate_salt
				user.password_hash = BCrypt::Engine.hash_secret(profile['password'] , user.password_salt)
				begin
					user.save!
				rescue => ex
					halt 422, {'Content-Type' => 'text/plain'}, ex.message
				end
				print "USER:\n"
				print user.to_json
			else
				halt 400, {'Content-Type' => 'text/plain'}, 'The repeat password is different from password.'
			end
		else
			halt 400, {'Content-Type' => 'text/plain'}, 'Old password is not correct.'
		end

		status 200
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD, GET, PUT, POST, DELETE, OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-Auth-Token, X-Client-IP"
		200
	end
end

