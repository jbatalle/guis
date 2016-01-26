# @see IMLSodales
class IMLSodales < Sinatra::Application

	get '/phyNetworks' do
		return PhyNetwork.all.to_json
	end

	get '/phyNetworks/:id' do
		begin
			return PhyNetwork.find(params['id']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	post '/phyNetworks' do
		
		@phyRequest = PhyNetwork.new()
		if @phyRequest.save!
			return "#{@phyRequest.id}"
		else
			halt 400, "Not posible to save"
		end
	end

	get '/phyNetworks/:id/resource/:resourceId' do
		logger.error PhyNetwork.find(params['id']).phy_resources
		begin
			return PhyNetwork.find(params['id']).phy_resources.find_by(:id => params['resourceId']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	get '/phyNetworks/:id/links' do
		logger.error PhyNetwork.find(params['id']).phy_resources
		begin
			return PhyNetwork.find(params['id']).phy_resources.find_by(:id => params['resourceId']).to_json
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Not found"
		end
	end

	post '/phyNetworks/:id/resource/addResource' do
		phyRes, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		n = PhyNetwork.find(params['id'])
		@resource = n.phy_resources.create!(phyRes)
		return @resource['id'].to_s

		#@viReqNetwork.phy_resources << PhyResource.new(phyRes)
		#logger.error @viReqNetwork.vi_req_resources.last['id'].to_s
		#return @viReqNetwork.vi_req_resources.last['id'].to_s
	end

	post '/phyNetworks/:id/link/addLink' do
		phyLink, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		n = PhyNetwork.find(params['id'])
		@resource = n.phy_links.create!(phyLink)
		return @resource['id'].to_s

		#@viReqNetwork.phy_resources << PhyResource.new(phyRes)
		#logger.error @viReqNetwork.vi_req_resources.last['id'].to_s
		#return @viReqNetwork.vi_req_resources.last['id'].to_s
	end

	post '/phyNetworks/:id/resource/:resourceId/addPorts' do
		phyPorts, errors = parse_json(request.body.read)
		return 400, errors.to_json if errors

		begin
			r = PhyNetwork.find(params['id']).phy_resources.find_by(:id => params['resourceId'])
		rescue Mongoid::Errors::DocumentNotFound => e
			halt 404, "Resource not found"
		end

		#r = r.vi_req_resources.find(params['resourceId'])
		r.phy_ports.create!(phyPorts)
		#r.vi_req_ports.create!()
		logger.error @port
		return r.to_json

		#@viReqNetwork.phy_resources << PhyResource.new(phyRes)
		#logger.error @viReqNetwork.vi_req_resources.last['id'].to_s
		#return @viReqNetwork.vi_req_resources.last['id'].to_s
	end

	delete '/phyNetworks/:id/resource/:resourceId' do
		n = PhyNetwork.find(params['id'])
		r = n.phy_resources.find(params['resourceId'])
		r.phy_ports.each do |viReqPort|
			logger.error viReqPort
			logger.error viReqPort.id
			r.phy_ports.find(viReqPort['id']).delete
		end
		r.delete
	end

	delete '/phyNetworks/:id/link/:resourceId' do
		n = PhyNetwork.find(params['id'])
		r = n.phy_links.find(params['resourceId']).delete
	end


	delete '/phyNetworks/:id' do
		n = PhyNetwork.find(params['id'])
		n.phy_resources.each do |viResource|
			r = n.phy_resources.find(viResource['id'])
				r.phy_ports.each do |viPort|
				logger.error viPort
				logger.error viPort.id
				r.phy_ports.find(viPort['id']).delete
			end
			r.delete
		end
		n.delete
	end

	delete '/phyNetworks' do
		PhyNetwork.delete_all
	end

	options "*" do
		response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Cache-Control, Accept, Authorization, X-Auth-Token, X-FOG-TENANT"
        200
    end
	
end
