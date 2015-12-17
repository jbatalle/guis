root = ::File.dirname(__FILE__)
require ::File.join(root, 'main')

#use ActiveRecord::ConnectionAdapters::ConnectionManagement

run IMLSodales.new
