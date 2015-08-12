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

	get "/sp" do
		return SP.where(:active => 1).to_json
	end
	
	get "/sp/users", :auth => [:sysadmin, :tenantadmin] do
		token = SP.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
		user = User.find(token.user_id)
		users = User.where(:tenant_id => user.tenant_id)
		return users.to_json
	end
	
	get "/sp/:id" do
		print params["id"]
		if(params["id"] == 'null')
			halt 200, {'Content-Type' => 'text/plain'}, ''
		end
		tenant = Tenant.find(params["id"])
        unless tenant
			halt 404, {'Content-Type' => 'text/plain'}, 'This tenant no exists.'
        end
		return tenant.to_json
	end
	
	get "/sp/:id/users" do
		print params["id"]
		if(params["id"] == 'null')
			halt 200, {'Content-Type' => 'text/plain'}, ''
		end
		tenant = SP.find(params["id"])
        unless tenant
			halt 404, {'Content-Type' => 'text/plain'}, 'This tenant no exists.'
        end
        users = User.where(:tenant_id => params["id"])
		return users.to_json
	end
	
	post "/sp", :auth => [:sysadmin] do
		tenant, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		
		tenant = SP.new(tenant)
		tenant.save!
		return tenant.to_json
	end
	
	put "/sp/:id" do
		tenant = SP.find(params[:id])
		tenant, errors = parse_json(request.body.read)
		return 400, errors if errors
		
		tenant.update_attribute(:abr, tenant.abr)
		return tenant.to_json
	end
	
	delete "/sp/:id", :auth => [:sysadmin] do
		SP.find(params["id"]).destroy
		status 200
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-Auth-Token"
		200
	end
end
