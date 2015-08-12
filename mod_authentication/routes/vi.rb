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

	get "/vi" do
		return Vi.all.to_json
	end
	
	get "/vi/:id" do
		if(params["id"] == 'null')
			halt 200, {'Content-Type' => 'text/plain'}, ''
		end
		vi = Vi.find(params["id"])
        unless vi
			halt 404, {'Content-Type' => 'text/plain'}, 'This tenant no exists.'
        end
		return vi.to_json
	end
	
	#add resource to VI
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
	
	post "/vi", :auth => [:ip] do
		vi, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		
		vi = Vi.new(vi)
		begin
			vi.save!
		rescue => ex
			old_vi = Vi.where(:name => params[:name]).first
			old_vi.update_attributes(vi)
		end
		
		return vi.to_json
	end
	
	get "/vi/:id/:status" do
		tenant = VI.find(params[:id])
		tenant, errors = parse_json(request.body.read)
		return 400, errors if errors
		
		tenant.update_attribute(:abr, tenant.abr)
		return tenant.to_json
	end
	
	delete "/vi/:id", :auth => [:ip] do
		SP.find(params["id"]).destroy
		status 200
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-Auth-Token"
		200
	end
end

