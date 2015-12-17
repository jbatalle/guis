# @see IMLSodales
class IMLSodales < Sinatra::Application

	get '/viResource' do
		return ViReqResource.all.to_json
	end

	get '/viResource/:id' do
		begin
			return ViReqResource.find(params['id']).to_json
		rescue ActiveRecord::RecordNotFound
			halt 404, "Not found"
		end
	end

	post '/viResource' do
		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		logger.error viReqRes

		#viReqRes['']
		#ViReqResource.new()
	end

	put '/viResource/:id' do
		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

	end

	delete 'viReqResource/:id' do
		ViReqResource.find(params['id']).delete
	end
	
end
