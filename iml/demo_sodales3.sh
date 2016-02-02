#!/bin/bash

echo "Create virtual network requests"

id=$(curl -XPOST http://localhost:4050/viReqNetworks)

time_start=$(date +%s)
time_end=$(date -d "10 day" +"%s")
curl -XPUT http://localhost:4050/viReqNetworks/$id -d '{"period": {"period_start": "'$time_start'", "period_end":"'$time_end'"}}'

echo "Adding ARN#1"
id2=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/addResource -d '{"type":"ARN"}')
id4=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/addPort)
id3=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/addResource -d '{"type":"ARN"}')
id4=$(curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id3/addPort)

curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id2/mapResource -d '{"endpoint": "http://185.37.215.49/cgi-bin/xml-parser.cgi", "id": "56af9e841aa1603fbd000006"}'
curl -XPOST http://localhost:4050/viReqNetworks/$id/viReqResource/$id3/mapResource -d '{"endpoint": "http://185.37.215.49/cgi-bin/xml-parser.cgi", "id": "56aff38c1aa160748e000008"}'

echo "Create network"
netId=$(curl -XPOST http://localhost:4050/viNetworks -d '{"id": "'$id'"}')
