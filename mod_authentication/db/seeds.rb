require "bcrypt"
require "securerandom"
require_relative '../models/init'

#['sysadmin', 'tenantadmin', 'tenantuser', 'guest'].each do |role|
#  Role.find_or_create_by({name: role})
#end

#Role.destroy_all
roles = Role.create([
	{name: "ip"},
	{name: "sp"},
	{name: "guest"}
])
if roles[0].save and roles[1].save and roles[2].save
	puts "Default roles: " + roles.map(&:name).join(', ')
else
	puts '>>> Roles not created!'
end

#Tenant.destroy_all
#tenants = Tenant.create([{ name: "Ajuntament de Barcelona", abr: "ajbBcn"}, { name: "Guardia Urbana", abr: "gu"}, { name: "Sensefields", abr: "sf"}, 
#{ name: "Emergencies", abr: "112"}])

#if tenants[0].save and tenants[1].save and tenants[2].save and tenants[3].save
#	puts "Default tenants: " + tenants.map(&:name).join(', ')
#else
#	puts '>>> Tenants not created!'
#end

vi = Vi.create({name: "vi-req-1", status: "Created"})
if vi.save
	puts "VI Created"
else
	puts '>>> VI not created!'
end

sp = SP.create({name: "sp1", url: "test", description: "test", vis: [vi]})
if sp.save
	puts "SP Created"
else
	puts '>>> SP not created!'
end


#User.destroy_all
salt = BCrypt::Engine.generate_salt
users = User.create([
	{roles: [roles[0]], name: 'admin',  password: 'adminpass',  password_confirmation: 'adminpass', password_salt: salt,
		sp_id: sp.id, password_hash: BCrypt::Engine.hash_secret("adminpass", salt), email: "josep.batalle@i2cat.net", active: 1}
])
if users[0].save
	puts "Default users: " + users.map(&:name).join(', ')
else
	puts '>>> Users not created!'
end


