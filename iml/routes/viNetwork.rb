# @see IMLSodales
class IMLSodales < Sinatra::Application

	get '/viNetworks' do
		return ViNetwork.all.to_json
	end

	get '/viNetworks/:id' do
		begin
			return ViNetwork.find(params['id']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	get '/viNetworks/:id/resource/:resourceId' do
		logger.error ViNetwork.find(params['id']).vi_resources
		begin
			return ViNetwork.find(params['id']).vi_resources.find_by(:id => params['resourceId']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	post '/viNetworks' do
		viNet, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viReqNetwork = ViReqNetwork.find(viNet['id'])
		logger.error @viReqNetwork

		if !@viReqNetwork['period']['period_start'] || !@viReqNetwork['period']['period_end'] 
			logger.error "Period missing"
			halt 400, "Period missing"
		else

		end

		if @viReqNetwork['period']['period_end'].to_i < Time.now.to_i
			logger.error "Period out of scope"
			halt 400, "The period of the virtual request is out of the allowed range."
		else

		end

		@viNetwork = ViNetwork.new({:name => viNet['name'], :period => {:period_start => @viReqNetwork['period']['period_start'], :period_end => @viReqNetwork['period']['period_end']}})
		#add virtual resource
		logger.error "For each resources"
		logger.error @viReqNetwork['vi_req_resources']
		logger.error @viReqNetwork.vi_req_resources
		@viReqNetwork['vi_req_resources'].each do |viReqResource|
			logger.error viReqResource
			#r = 
			@viNetwork.vi_resources << ViResource.new({:type => viReqResource['type'], :mapped_resource =>  viReqResource['mapped'], :endpoint => viReqResource['mapping_uri']})
			logger.error "For each ports"
			logger.error viReqResource['vi_req_ports']
			if viReqResource['vi_req_ports'].empty?
				logger.error "Do nothing... no ports defined"
			else
				viReqResource['vi_req_ports'].each do |viReqPort|
					logger.error viReqPort
					#logger.error @viNetwork.viResources.last
					#p = ViReqPort.new({:physical => viReqPort['mapped'] })
					#logger.error p
					@viNetwork.vi_resources.last.vi_ports << ViPort.new({:physical => viReqPort['mapped'] })
					#@viNetwork.viResources << ViResource.new({:type => viReqResource, :endpoint => ""})
				end
			end

			#map vlans/lambdas/timeslots
			if !viReqResource['mappedVlans'].nil?
				@viNetwork.vi_resources.last['mappedVlans'] = viReqResource['mappedVlans']
			end
			if !viReqResource['mapped_lambda'].nil?
				@viNetwork.vi_resources.last['mapped_lambda'] = viReqResource['mapped_lambda']
			end
			if !viReqResource['mapped_timeslot'].nil?
				@viNetwork.vi_resources.last['mapped_timeslot'] = viReqResource['mapped_timeslot']
			end
		end
		
		logger.error "Save VI NETWORK ........................................"
		if @viNetwork.save!
			return "#{@viNetwork.id}"
		else
			halt 400, "Not posible to save"
		end

		#@viNetwork.viResources << ViResource.new({})
		#logger.error @viReqNetwork.viReqResources
		#add ports according to mapping
		#add vlans according to mapping
	end

	delete '/viNetworks/:id' do
		n = ViNetwork.find(params['id'])
		n.vi_resources.each do |viResource|
			r = n.vi_resources.find(viResource['id'])
				r.vi_ports.each do |viPort|
				logger.error viPort
				logger.error viPort.id
				r.vi_ports.find(viPort['id']).delete
			end
			r.delete
		end
		n.delete
	end

	delete '/viNetworks' do
		ViNetwork.delete_all
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Cache-Control, Accept, Authorization, X-Auth-Token, X-FOG-TENANT"
        200
    end

	
end
