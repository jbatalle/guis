ENV['RACK_ENV'] ||= 'development'

require 'sinatra'
require 'sinatra/config_file'
require 'yaml'
require "bcrypt"
require 'rack/ssl'

# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require :default, ENV['RACK_ENV'].to_sym

require_relative 'models/init'
require_relative 'routes/init'
require_relative 'helpers/init'

configure do
	# Configure logging
	enable :logging
	log_file = File.new("#{settings.root}/log/#{settings.environment}.log", "a+")
	log_file.sync = true
	use Rack::CommonLogger, log_file
	set :allow_origin, :any
	set :allow_methods, [:get, :post, :options]
	set :allow_credentials, true
	set :max_age, "1728000"
	set :expose_headers, ['Content-Type']
end

before do
	logger.level = Logger::DEBUG
	content_type :json
	headers 'Access-Control-Allow-Origin' => '*',
		'Access-Control-Allow-Methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization', 'X-Auth-Token']
end

set :protection, false

class Authentication < Sinatra::Application
	register Sinatra::ConfigFile
	# Load configurations
	config_file 'config/config.yml'
	register Sinatra::CrossOrigin
	
	AC_ALLOW_HEADERS = 'Accept, Authorization, X-Auth-Token'
	before do
		# Accept any cross-site requests from the client.
		response['Access-Control-Allow-Origin'] = request.env['HTTP_ORIGIN']
	end
	
	options '*' do
		headers 'Access-Control-Allow-Origin' => '*',
			'Access-Control-Allow-Methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization', 'X-Auth-Token']
	end
end
