require_relative '../models/init'
ViReqNetwork.destroy_all
ViReqResource.destroy_all


ViReqNetwork.create! [
  { name: "Test" },
  { name: "Test2" }
]

ViReqNetwork.all
test = ViReqNetwork.find_by name: "Test"

viReqResource = ViReqResource.create!({ name: "Test"})

test.viReqResources.create! [
	{ name: "Test2"}
]
#test.save!
