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

	post "/history" do
		history, errors = parse_json(request.body.read)
        	return 400, errors if errors
        
        print request.env['HTTP_X_AUTH_TOKEN']
        print history
        
        token = Token.where(:token => request.env['HTTP_X_AUTH_TOKEN']).first
		if token
			user = User.find(token.user_id)
			History.new(:user_id => user.id, :content => history['content'], :status => history['type']).save!
		else
			halt 401, {'Content-Type' => 'text/plain'}, 'Token invalid'
		end
	end

	delete "/history" do
		History.delete_all
	end
	
	get "/history" do
		return History.all.to_json
	end

	get "/history/:user_id" do
		return History.where(:user_id => params[:user_id]).order("id desc").limit(20).to_json
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD, GET, PUT, POST, DELETE, OPTIONS"
		response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, X-Auth-Token"
		200
	end
end

