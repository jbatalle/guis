# @see IMLSodales
class IMLSodales < Sinatra::Application

	get '/viReqNetworks' do
		return ViReqNetwork.all.to_json
	end

	get '/viReqNetworks/:id' do
		begin
			return ViReqNetwork.find(params['id']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "ViReq not found"
		end
	end

	post '/viReqNetworks' do
		
		@viRequest = ViReqNetwork.new()
		if @viRequest.save!
			return "#{@viRequest.id}"
		else
			halt 400, "Not posible to save"
		end
	end

	put '/viReqNetworks/:id' do
		begin
			@viRequest = ViReqNetwork.find(params['id'])
		rescue ActiveRecord::RecordNotFound
			halt 404, "ViReq not found"
		end

		viReqNet, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viRequest.update_attributes(viReqNet)
		
		return @viRequest.to_json
	end

	get '/viReqNetworks/:id/viReqResource' do
		begin
			return ViReqNetwork.find(params['id']).viReqResources.to_json
		rescue ActiveRecord::RecordNotFound
			halt 404, "ViReq network not found"
		end
	end

	get '/viReqNetworks/:id/viReqResource/:idRes' do
		begin
			return ViReqResource.find(params['idRes']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "ViResource not found"
		end
	end

	post '/viReqNetworks/:id/viReqResource/addResource' do
		begin
			@viReqNetwork = ViReqNetwork.find(params['id'])
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end

		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viReqNetwork.viReqResources << ViReqResource.new(viReqRes)
		logger.error @viReqNetwork.viReqResources.last['id'].to_s
		return @viReqNetwork.viReqResources.last['id'].to_s
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/addPort' do
		begin
			@viReqNetwork = ViReqNetwork.find(params['id'])
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "VI Req Not found"
		end

		n = ViReqNetwork.find(params['id'])
		r = n.viReqResources.find(params['resourceId'])
		r.viReqPorts << ViReqPort.new()
		return r.viReqPorts.last['id'].to_s
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/mapResource' do
		n = ViReqNetwork.find(params['id'])
		r = n.viReqResources.find(params['resourceId'])
		r.update_attribute('mapping', params[:arg0])
		return @viReqNetwork
	end

	#?arg0=port
	post '/viReqNetworks/:id/viReqResource/:resourceId/mapPort/:portId' do
		n = ViReqNetwork.find(params['id'])
		r = n.viReqResources.find(params['resourceId'])
		p = r.viReqPorts.find(params['portId'])
		p.update_attribute('mapping', params[:arg0])
		return @viReqNetwork
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/mapVlan' do
		data, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		n = ViReqNetwork.find(params['id'])
		r = n.viReqResources.find(params['resourceId'])
		r.update_attribute('mappingVlans', data)
		return @viReqNetwork
	end

	post '/viReqNetworks/:id/viReqResource' do

		begin
			@viReqNetwork = ViReqNetwork.find(params['id'])
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end

		logger.error @viReqNetwork.to_json

		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		logger.error viReqRes

		@viReqNetwork.vi_resource_req = []

		#@viReqNetwork['vi_resource_req'] = []

		#@viReqNetwork.viReqResources.create!(viReqRes)
		#@viReqNetwork.update_attribute(:vi_resource_req, viReqRes)

		#@viReqNetwork.save!

		return @viReqNetwork.to_json
		#@viRequest = ViReqResource.new(viReqRes)
		#if @viRequest.save
		#	return "#{@viRequest.id}"
		#else
		#	halt 400, "Not posible to save"
		#end
	end

	put '/viReqNetworks/:id/viReqResource/:idRes' do
		begin
			@viReqNetwork = ViReqNetwork.find(params['id'])
		rescue ActiveRecord::RecordNotFound
			halt 404, "Not found"
		end

		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viReqNetwork.update_attribute(:vi_resource_req, viReqRes)

		return @viReqNetwork.to_json
	end

	delete '/viReqNetworks/:id/viReqResource/:resourceId' do
		n = ViReqNetwork.find(params['id'])
		r = n.viReqResources.find(params['resourceId'])
		r.viReqPorts.each do |viReqPort|
			logger.error viReqPort
			logger.error viReqPort.id
			r.viReqPorts.find(viReqPort['id']).delete
		end
		r.delete
	end

	delete '/viReqNetworks/:id/viReqResource' do
		ViReqResource.delete_all
	end

	delete '/viReqNetworks/:id' do
		n = ViReqNetwork.find(params['id'])
		n.viReqResources.each do |viReqResource|
			r = n.viReqResources.find(viReqResource['id'])
				r.viReqPorts.each do |viReqPort|
				logger.error viReqPort
				logger.error viReqPort.id
				r.viReqPorts.find(viReqPort['id']).delete
			end
			r.delete
		end
		n.delete
	end

	delete '/viReqNetworks' do
		ViReqNetwork.delete_all
	end
	
end
