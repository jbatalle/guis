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
		return SP.all.to_json
	end
	
	get "/sp/users", :auth => [:ip, :sp] do
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
		tenant = SP.find(params["id"])
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
		sp = SP.find(params["id"])
        unless sp
			halt 404, {'Content-Type' => 'text/plain'}, 'This tenant no exists.'
        end
        logger.error sp.id
        users = User.where(:sp_id => sp.id)
		return users.to_json
	end
	
	post "/sp", :auth => [:ip] do
		tenant, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		
		#tenant.vis << []
		
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
	
	post "/sp/:id/vi/:name" do
		sp = SP.find(params[:id])
		vi = Vi.where(:name => params[:name]).first
		print vi
		if vi === nil
			vi = Vi.new({name: params[:name], status: "Created"})
		end
		
		#sp.vis << vi
		sp.vis << vi unless sp.vis.include?(vi)
		return sp.to_json
	end
	
	delete "/sp/:id/vi/:name" do
		sp = SP.find(params[:id])
		sp.vis.find((Vi.where(:name => params[:name]).first).id)
		
		if sp
			sp.vis.delete(Vi.where(:name => params[:name]).first)
		end
		
		
		return sp.to_json
	end
	
	delete "/sp/:id", :auth => [:ip] do
		SP.find(params["id"]).destroy
		status 200
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-Auth-Token"
		200
	end
end

