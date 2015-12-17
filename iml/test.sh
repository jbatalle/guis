#!/bin/bash

curl -XDELETE http://localhost:4050/viReqNetworks
curl -XDELETE http://localhost:4050/viReqNetworks/1/viReqResource
echo "Create virtual network requests"

id=$(curl -XPOST http://localhost:4050/viReqNetworks)

echo $id
echo "PUT"
time_start=$(date +%s)
time_end=$(date +%s)
data='{"period_start": "'$time_start'", "period_end":"'$time_end'"}'
curl -XPUT http://localhost:4050/viReqNetworks/$id -d '{"period_start": "'$time_start'", "period_end":"'$time_end'"}'
echo "GET"
curl -XGET http://localhost:4050/viReqNetworks/$id

echo "Insert resource"
id2=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/addResource -d '{"resource_type":"ARN"}')
echo "Insert port into " $id2
id3=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/addPort)
echo "Mapping in " $id3
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapPort/$id3\?arg0=port
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapVlan -d '{"upperBound": 1, "lowerBound": 10}'
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapResource -d '{"test": "aa"}'

#curl -XPUT http://localhost:4050/viReqNetworks/$id/viReqResource -d '{"name": "name-21", "resource_type":"ARN", "ports": "", "mapped_resource": 1}'

echo "List of viReqNetworks"
exit
curl -XGET http://localhost:4050/viReqNetworks

echo "Specific VIReq"
curl -XGET http://localhost:4050/viReqNetworks/$id

#remove resource
curl -XDELETE http://localhost:4050/viReqNetworks/$id/viReqResource/$id2

echo "Resource removed ok"

curl -XGET http://localhost:4050/viReqNetworks/$id
curl -XGET http://localhost:4050/viReqNetworks
echo "Remove network..."
curl -XDELETE http://localhost:4050/viReqNetworks/$id
echo "Network removed ok"
curl -XGET http://localhost:4050/viReqNetworks

#create network

#curl -XPOST http://localhost:4050/viNetworks -d '{"id": "567200ad6e95522902000000"}'

