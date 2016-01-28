#!/bin/bash

echo "Create physical network"
phyId=$(curl -XPOST http://localhost:4050/phyNetworks -d '{}')

echo "ID:"
echo $phyId


echo "Add physical resource"
phyIdRes=$(curl -XPOST http://localhost:4050/phyNetworks/$phyId/resource/addResource -d '{"type":"ARN", "coords": {"lat": "40", "lon": "2"}}')
phyIdRes2=$(curl -XPOST http://localhost:4050/phyNetworks/$phyId/resource/addResource -d '{"type":"CPE", "coords": {"lat": "40", "lon": "2"}}')
phyIdLink=$(curl -XPOST http://localhost:4050/phyNetworks/$phyId/link/addLink -d '{"from": "$phyIdLink", "to": "$phyIdLink2"}')
phyIdResPorts=$(curl -XPOST http://localhost:4050/phyNetworks/$phyId/resource/$phyIdRes/addPorts -d '[{"id": "aaaaa", "card": "bbbbb"}, {"id": "ccccc", "card": "ddddd"}]')

#curl -XDELETE http://localhost:4050/viReqNetworks
echo "Create virtual network requests"

id=$(curl -XPOST http://localhost:4050/viReqNetworks)

time_start=$(date +%s)
time_end=$(date -d "10 day" +"%s")
curl -XPUT http://localhost:4050/viReqNetworks/$id -d '{"period": {"period_start": "'$time_start'", "period_end":"'$time_end'"}}'

echo "Adding ARN#1"
id2=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/addResource -d '{"type":"ARN"}')
id3=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/addPort)
id4=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/addPort)
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapPort/$id3/port-1212 -d '[{"upperBound": 1, "lowerBound": 128}, {"upperBound": 256, "lowerBound": 390}]'
exit
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapResource -d '{"id": "aa", "endpoint": "http://delta-ptin.no-ip.info:41080/cgi-bin/xml-parser.cgi"}'

echo "Create network"
netId=$(curl -XPOST http://localhost:4050/viNetworks -d '{"id": "'$id'"}')
