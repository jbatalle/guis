# Set environment
ENV['RACK_ENV'] ||= 'development'

require 'sinatra'
require 'sinatra/config_file'
require 'sinatra/reloader'
require 'yaml'

# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require :default, ENV['RACK_ENV'].to_sym

require_relative 'routes/init'
require_relative 'helpers/init'
require_relative 'models/init'

configure do
	# Configure logging
	enable :logging
	Dir.mkdir("#{settings.root}/log") unless File.exists?("#{settings.root}/log")
	log_file = File.new("#{settings.root}/log/#{settings.environment}.log", "a+")
	log_file.sync = true
	use Rack::CommonLogger, log_file
	
end

before do
	logger.level = Logger::DEBUG
end

class IMLSodales < Sinatra::Application
	register Sinatra::ConfigFile
	# Load configurations
	config_file 'config/config.yml'

	register Sinatra::CrossOrigin

	Mongoid.load!('config/mongoid.yml')
	
	AC_ALLOW_HEADERS = 'Accept, Authorization, X-Auth-Token'
	before do
		# Accept any cross-site requests from the client.
		response['Access-Control-Allow-Origin'] = request.env['HTTP_ORIGIN']
	end
	
	options '*' do
		headers 'Access-Control-Allow-Origin' => '*',
			'Access-Control-Allow-Methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization', 'X-Auth-Token', 'X-AUTH-TOKEN']
	end
end
