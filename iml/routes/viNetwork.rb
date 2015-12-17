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

	post '/viNetworks' do
		viNet, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		@viReqNetwork = ViReqNetwork.find(viNet['id'])
		logger.error @viReqNetwork

		if !@viReqNetwork['period_start'] || !@viReqNetwork['period_end'] 
			logger.error "Period missing"
			halt 400, "Period missing"
		else

		end
		@viNetwork = ViNetwork.new({:name => "", :period_start => @viReqNetwork['period_start'], :period_end => @viReqNetwork['period_end']})
		#add virtual resource
		logger.error "For each resources"
		logger.error @viReqNetwork['viReqResources']
		logger.error @viReqNetwork.viReqResources
		@viReqNetwork['viReqResources'].each do |viReqResource|
			logger.error viReqResource
			#r = 
			@viNetwork.viResources << ViResource.new({:type => viReqResource['resource_type'], :endpoint => ""})
			logger.error "For each ports"
			#logger.error viReqResource['viReqPorts']
			viReqResource['viReqPorts'].each do |viReqPort|
				logger.error viReqPort
				#logger.error @viNetwork.viResources.last
				#p = ViReqPort.new({:physical => viReqPort['mapped'] })
				#logger.error p
				@viNetwork.viResources.last.viPorts << ViPort.new({:physical => viReqPort['mapped'] })
				#@viNetwork.viResources << ViResource.new({:type => viReqResource, :endpoint => ""})
			end
		end
		@viNetwork.save!
		return @viNetwork
		#@viNetwork.viResources << ViResource.new({})
		#logger.error @viReqNetwork.viReqResources
		#add ports according to mapping
		#add vlans according to mapping
	end

	delete '/viNetworks/:id' do
		ViNetwork.find(params['id']).delete
	end

	delete '/viNetworks' do
		ViNetwork.delete_all
	end
	
end
