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
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "ViReq not found"
		end

		viReqNet, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viRequest.update_attributes(viReqNet)
		
		return @viRequest.to_json
	end

	get '/viReqNetworks/:id/viReqResource' do
		begin
			return ViReqNetwork.find(params['id']).vi_req_resources.to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "ViReq network not found"
		end
	end

		 #viReqNetworks/567a6d571aa16018a1000007/viReqResource/567a75131aa16018a100000e
	get '/viReqNetworks/:id/viReqResource/:resourceId' do
		begin
			return ViReqNetwork.find(params['id']).vi_req_resources.find(params['resourceId']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	post '/viReqNetworks/:id/viReqResource/addResource' do
		viReqRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		n = ViReqNetwork.find(params['id'])
		@resource = n.vi_req_resources.create!(viReqRes)
		return @resource['id'].to_s

		@viReqNetwork.vi_req_resources << ViReqResource.new(viReqRes)
		logger.error @viReqNetwork.vi_req_resources.last['id'].to_s
		return @viReqNetwork.vi_req_resources.last['id'].to_s
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/addPort' do
		n = ViReqNetwork.find(params['id'])
		r = n.vi_req_resources.find(params['resourceId'])
		@port = r.vi_req_ports.create!()
		logger.error @port
		return @port['id'].to_s
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/mapResource' do
		data, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		logger.error data

		n = ViReqNetwork.find(params['id'])
		r = n.vi_req_resources.find(params['resourceId'])
		r.update_attribute('mapping', data['id'])
		r.update_attribute('mapping_uri', data['endpoint'])
		return n.to_json
	end

	#?arg0=port
	post '/viReqNetworks/:id/viReqResource/:resourceId/mapPort/:portId/:phyPort' do
		#data, errors = parse_json(request.body.read)
		#return 400, errors.to_json if errors

#		ViReqPort.find(params['portId']).update_attributes(:mapped => data['phyPort'])
		n = ViReqNetwork.find(params['id'])
		r = n.vi_req_resources.find(params['resourceId'])
		logger.error r.id
		p = r.vi_req_ports.find(params['portId'])
		logger.error p.id

		#remove
		r.vi_req_ports.find(params['portId']).delete
		p = r.vi_req_ports.create!({:name => "adasda", :mapped => params['phyPort']})
		#a = r.vi_req_ports.find(params['portId']).update({:mapped => data['phyPort']})

		return r.vi_req_ports.last['id'].to_s
		r.vi_req_ports.last.update_attribute('mapped', "aaaaa")
		logger.error r.vi_req_ports.find(params['portId'])
		r.reload.vi_req_ports
		n.reload.vi_req_resources

		#p = r.vi_req_ports.find(params['portId']).save!
		#p.update_attributes!(:mapped => data['phyPort'])
		#logger.error p.id
		return p.to_json
	end

	post '/viReqNetworks/:id/viReqResource/:resourceId/mapVlan' do
		logger.error "MAP VLAN"
		data, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors
		logger.error data.to_json
		n = ViReqNetwork.find(params['id'])
		r = n.vi_req_resources.find(params['resourceId'])
		logger.error r
		r.update_attribute('mappingVlans', data)
		logger.error r
		return @viReqNetwork.to_json
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
		r = n.vi_req_resources.find(params['resourceId'])
		r.vi_req_ports.each do |viReqPort|
			logger.error viReqPort
			logger.error viReqPort.id
			r.vi_req_ports.find(viReqPort['id']).delete
		end
		r.delete
	end

	delete '/viReqNetworks/:id/viReqResource' do
		ViReqResource.delete_all
	end

	delete '/viReqNetworks/:id' do
		n = ViReqNetwork.find(params['id'])
		n.vi_req_resources.each do |viReqResource|
			r = n.vi_req_resources.find(viReqResource['id'])
				r.vi_req_ports.each do |viReqPort|
				logger.error viReqPort
				logger.error viReqPort.id
				r.vi_req_ports.find(viReqPort['id']).delete
			end
			r.delete
		end
		n.delete
	end

	delete '/viReqNetworks' do
		ViReqNetwork.delete_all
	end

	options "*" do
                response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Cache-Control, Accept, Authorization, X-Auth-Token, X-FOG-TENANT"
                200
    end
	
end
