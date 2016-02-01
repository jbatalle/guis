# @see Manager
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

	get "/users", :auth => [:ip] do
		#get "/users" do
		return User.all.to_json
	end
	#remove users
	delete "/users/:id", :auth => [:ip] do
		#if user is itself
		token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
        if token
			user = User.find(token.user_id)
		#            return user.to_json
        else
			halt 401, {'Content-Type' => 'text/plain'}, 'Token invalid'
		end
		
		if user.id == params["id"]
			halt 401, {'Content-Type' => 'text/plain'}, 'You can not remove yourself'
		end
		User.find(params["id"]).destroy
		status 200
	end
	
	#activate users
	post "/users/:id/activate", :auth => [:sysadmin, :tenantadmin, :ip] do
		user = User.find(params[:id])
		user.update_attribute(:active, 1)
		status 200
	end
	
	#activate users
	post "/users/:id/disable", :auth => [:sysadmin, :tenantadmin, :ip] do
		user = User.find(params[:id])
		user.update_attribute(:active, 0)
		status 200
	end
	
	#add user to SP
	post "/users/:id/sp/:spId" do
		logger.error params[:id]
		logger.error params[:spId]
		user = User.find(params[:id])
		logger.error user.name
		sp = SP.find(params[:spId])
		logger.error sp.name
		#user.sp = sp
		puts "ERROR:"
		logger.error user.roles
		user.roles do |item|
			logger.error item
			logger.error item[:name]
		end
		puts "ERROR:"
		logger.error user.roles.include?(Role.where(name: 'sp').first)
		if (!user.roles.include?(Role.where(name: 'sp').first))
			user.roles << Role.where(name: "sp").first
			user.update_attribute(:sp_id, sp.id)
		end
		puts "ERROR2:"
		
		status 200
	end
	
	#get profile
	get "/users/:id", :auth => [:sysadmin] do
		user = User.find(params[:id])
		return user.to_json
	end
	
	#update profile
	put "/users/:id", :auth => [:sysadmin] do
		user = User.find(params[:id])
		profile, errors = parse_json(request.body.read)
        return 400, errors if errors

		user.update_attribute(:fullname, profile['fullname'])
        user.update_attribute(:email, profile['email'])

        user.roles = [];
        profile['roles'].each do |role|
			user.roles << Role.where(name: role).first
        end
        
        if user.name == 'admin'
			user.roles << Role.where(name: "sysadmin").first
		end

        #user.update_attribute(:tenant, profile.email)
		#user.update_attribute(:roles, profile.roles)
		return user.to_json
	end
	
	#create roles
	get "/roles", :auth => [:sysadmin] do
		return Role.all.to_json
	end
	#create roles
	put "/tenants/:id" do
		tenant = Tenants.find(params[:id])
		tenant.abr = 1
		return tenant.to_json
	end

	options "*" do
		response.headers["Allow"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization"
		200
	end
end

