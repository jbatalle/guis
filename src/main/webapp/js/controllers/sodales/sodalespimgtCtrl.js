'use strict';

angular.module('openNaaSApp')
        .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, arnService, cpeService) {
            var url = "";
//            $rootScope.networkId = "Network-Internal-1.0-7";
            console.log(localStorageService.get("mqNaaSElements"));
//            console.log(JSON.parse(localStorageService.get("mqNaaSElements")));
            localStorageService.set("graphNodes", []);
            console.log($rootScope.networkId);
            
            $scope.updateListNetworks = function(){
                console.log("Update list1");
                RootResourceService.list().then(function (data) {
                     data = checkIfIsArray(data.IRootResource.IRootResourceId);
                     console.log("UpdateList nts");
                     console.log(data);
                    $scope.listNetworks = data;
                });
            };
            
            RootResourceService.list().then(function (data) {
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                console.log($scope.listNetworks);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set("networkId", data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log("Clean localStorage networkElements due network is not created.");
                localStorageService.set("networkElements", []);
                localStorageService.set("link", []);
                console.log($rootScope.networkId);
                getMqNaaSResource($rootScope.networkId);
//                localStorageService.set("mqNaaSElements", data);
            });

            $scope.setNetworkId = function (netId) {
                console.log("Select networkId to rootScope: " + netId);
                $rootScope.networkId = netId;
                localStorageService.set("networkId", netId);
                getMqNaaSResource($rootScope.networkId);
            };
            $scope.list = function () {
                console.log("GET LSIT -----------------------------");
                RootResourceService.list().then(function (data) {
                    console.log(data);
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.listNetworks = data;
                    console.log($scope.listNetworks);
                    localStorageService.set("mqNaaSElements", data);
                });
            };

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $rootScope.networkId = data;
                    $scope.list();
                    $scope.updateListNetworks();
                });
            };

            $scope.arn = {network: "", endpoint: "http://192.168.122.237"};
            $scope.cpe = {endpoint: "http://fibratv.dtdns.net:41081"};
            /*            $scope.openARNDialog = function () {
             $scope.arn = {endpoint: "asdasdsa"};
             ngDialog.open({template: 'partials/sodales/arnDialog.html'});
             
             };*/

            $scope.createTSON = function () {
                var TSON = getResource("TSON");
                var json = TSON;
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, json).then(function (data) {
                    $scope.data = data;
                });
            };

            $scope.addARN = function (data) {
                console.log(data);
                var ARN = getARN(data.endpoint+"/cgi-bin/xml-parser.cgi");
                console.log(ARN);
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                arnService.setUrl(data.endpoint);
                MqNaaSResourceService.put(url, ARN).then(function (data) {
                    $scope.dataARN = data;
                    $scope.configurePhysicalResource(data);
                    createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                });
                ngDialog.close();
            };

            $scope.deleteResource = function (resName) {
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration/" + resName);
                MqNaaSResourceService.remove(url).then(function (data) {
                });
            };

            $scope.addCPE = function (data) {
                console.log(data);
                var CPE = getResource("CPE", data.endpoint);
                console.log(CPE);
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                cpeService.setUrl(data.endpoint);
                MqNaaSResourceService.put(url, CPE).then(function (data) {
                    $scope.dataCPE = data;
                    $scope.configurePhysicalResource(data);
                    createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                });
                ngDialog.close();
            };

            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                MqNaaSResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = MqNaaSResourceService.query();
                });
            };

            var getMqNaaSResource = function (root, url) {
                console.log("GET MQNAAS RESOURCE. SET RESOURCES " + root);
                var url = generateUrl("IRootResourceAdministration", root, "IRootResourceProvider");
                MqNaaSResourceService.list(url).then(function (data) {
                    console.log(data);
                    if (data === undefined)
                        return;
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.networkElements = data;
                    data.forEach(function (resource) {
                        $scope.getRealPorts(resource);
                    });

                    localStorageService.set("networkElements", data);
                    console.log("GEt and store ports");

                }, function (error) {
                    console.log(error);
                });
            };

            $scope.configurePhysicalResource = function (resourceName) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/slice";
                console.log(url);
                MqNaaSResourceService.getText(url).then(function (data) {
                    console.log("Slice: " + data);
                    var sliceId = data;
                    var unitType = "port";
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement?arg0=" + unitType;
                    MqNaaSResourceService.put(url).then(function (data) {
                        console.log("SET unit" + data);
                        var unitId = data;
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                        var range = getRangeUnit(1, 2);
                        MqNaaSResourceService.put(url, range).then(function () {
                            console.log("Set Range1");
                            var unitType = "vlan";
                            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement?arg0=" + unitType;
                            MqNaaSResourceService.put(url).then(function (data) {
                                var unitId = data;
                                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                                var range = getRangeUnit(1, 2);
                                MqNaaSResourceService.put(url, range).then(function () {
                                    console.log("Set Range1");
                                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
                                    var cubes = getCubeforTSON(1, 1, 2, 2);
                                    MqNaaSResourceService.put(url, cubes).then(function () {
                                    });
                                });
                            });
                        });
                    });

                });
            };

            $scope.configureResourceSlices = function (resName) {
//                var sliceId = $scope.getSlice(resName);
//                var unitId = $scope.createUnit(resName, sliceId, "port");
//                var unitId = $scope.setRangeUnit(resName, sliceId);
//                var unitId = $scope.setCubes(resName, sliceId);
            };
            $scope.getSlice = function (resourceName) {//get
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/slice");
                MqNaaSResourceService.get(url).then(function (data) {
                    return data;
                });
            };
            $scope.createUnit = function (resourceName, sliceId, content) {//put
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement");
                var content = "port";
                MqNaaSResourceService.put(url, content).then(function (data) {
                    return data;
                });
            };
            $scope.setRangeUnit = function (resourceName, sliceId, unitId, range) {
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId);
                var range = getRangeUnit(1, 2);
                MqNaaSResourceService.put(url, range).then(function (data) {
                    return data;
                });
            };
            $scope.setCubes = function (resourceName, sliceId, cubes) {
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes");
                var cubes = getCubeforTSON(1, 2, 3, 4);
                MqNaaSResourceService.put(url, cubes).then(function (data) {
                    return data;
                });
            };
            $scope.createLink = function () {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement";
                MqNaaSResourceService.put(url).then(function (data) {
                    $scope.createdLink = data;
                    $scope.createdLinkInfo = [{s: $scope.source, t: $scope.dest}];
                    localStorageService.set("link", [{s: $scope.source, t: $scope.dest}]);
                    return data;
                });
            };

            $scope.getRealPorts = function (resourceName) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    console.log(result);
                    console.log(result.IResource.IResourceId);
                    var ports = [];
                    result.IResource.IResourceId.forEach(function (entry) {
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement/" + entry + "/IAttributeStore/attribute/?arg0=portInternalId";
                        MqNaaSResourceService.getText(url).then(function (realPort) {
                            console.log("GET physical port");
                            console.log(realPort);
                            console.log(entry);
                            var p = entry+"("+realPort+")";
                            if(realPort > 99) ports.push({"_id": p});
                            console.log(ports);
                            localStorageService.set(resourceName, {name: resourceName, ports: {port: ports}});
                        });

                    });
                    
                    console.log("Set ports");
                    console.log(localStorageService.get(resourceName));
                });
            };

            $scope.createLinkDialog = function (source, dest) {
                console.log("Create Link dialog");
                console.log(source);
                console.log(dest);
                $scope.source = source;
                $scope.dest = dest;
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + source + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts1 = result;
                });
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + dest + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts2 = result;
                });

                ngDialog.open({
                    template: 'partials/sodales/createLinkDialog.html',
                    scope: $scope
                });
            };
            $scope.attachPortsToLink = function (type, portId) {
                var linkId = $scope.createdLink;
                var url;
                if (type === "source") {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/srcPort?arg0=" + portId;
                    $scope.srcPortAttahed = "Source port Attached";
                } else if (type === "dest") {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/destPort?arg0=" + portId;
                    $scope.dstPortAttahed = "Source port Attached";
                }
                MqNaaSResourceService.put(url).then(function (response) {
                });//empty

            };

            $scope.getLinks = function () {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
                MqNaaSResourceService.get(url).then(function (response) {
                    console.log(response.unit);
                    $scope.links = response.unit;
                });
            };

            $scope.mappingPortsToLink = function (res1, port1, portInternalId, portEth) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + res1 + "/IPortManagement/" + port1 + "/IAttributeStore/attribute/?arg0=" + portInternalId + "&arg1=" + portEth;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                    $scope.mappedPort = "Mapped";
                    $scope.mappedPorts.push({virt: virtualPort, real: realPort});
                });
            };
        });