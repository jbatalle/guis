'use strict';

angular.module('mqnaasApp')
    .controller('DashboardCtrl', function ($scope, $rootScope, $window, $location, AuthService, ServicesService, FvdsService,
        ServicesInstancesService, NodesService, EventsService, CabinetsService, $modal, leafletEvents, leafletBoundsHelpers,
        leafletData, $timeout, TenantsService, MonitoringService, $q, VisDataSet) {

        $scope.node_tabs = [{
                title: 'Status',
                url: 'tab_status',
                templateUrl: 'views/dashboard/status.html'
        },
            {
                title: 'Metrics',
                url: 'tab_metrics',
                templateUrl: 'views/dashboard/metrics.html'
        },
            {
                title: 'Cabinet Energy Control',
                url: 'tab_power_control',
                templateUrl: 'views/dashboard/energy.html'
        },
            {
                title: 'Services',
                url: 'tab_services',
                templateUrl: 'views/dashboard/services.html'
        }
       ];

       var DELAY_UPDATE = 8000;

       var DELAY_UPDATE_LOGS = 3000;
       $scope.current_capabilities = {};


       $scope.power_timeout_id = 0
       $scope.current_timeout_id = 0;


        $scope.currentTab = 'tab_status';

        $scope.onClickTab = function (tab) {
            console.log(tab);
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $scope.currentTab;
        }
        $scope.prevent_modal = false;

        $scope.dataCollection = [];
        $scope.nodeCollection = [];

        if (!$window.localStorage.token) {
            $location.path('/');
            return;
        }

        $scope.fvds = 0;
        $scope.services = 0;
        $scope.servicesInstances = 0;
        $scope.nodes = 0;

        $scope.currrent_node;

        $scope.current_cabinet;

        $scope.selected_cabinet;

        $scope.fire = 0;

        $scope.collapsed = false;
        $scope.collpased_node_metrics = false;

        $scope.charts = {};

        if ($scope.current_cabinet) {
            console.log("COLAPSE2");
            $scope.collapsed = true;
            $scope.collpased_node_metrics = false;
        }

        angular.extend($scope, {
            center_map: {

                zoom: 18
            },
            bounds: [],
            maxbounds: [],

            defaults: {
                scrollWheelZoom: false
            },
            markers: {},
            events: {
                markers: {
                    enable: ['click', 'mouseover', 'mouseout']
                        //logic:'emit'
                }
            },
            bounds: {},
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {

                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> used by Cisco',
                            continuousWorld: true
                        }
                    }
                },
                overlays: {
                    cabinet: {
                        name: "cabinet",
                        type: "markercluster",
                        visible: true,
                        layerOptions: {

                            iconCreateFunction: function (cluster) {
                                var childCount = cluster.getChildCount();

                                var c = ' marker-cluster-';
                                /*if (childCount < 10) {
                                    c += 'small';
                                } else if (childCount < 100) {
                                    c += 'medium';
                                } else {*/
                                c += 'cisco';
                                //}

                                return new L.DivIcon({
                                    html: '<div><span>' + childCount + '</span></div>',
                                    className: 'marker-cluster' + c,
                                    iconSize: new L.Point(40, 40)
                                });
                            }
                        }
                    }
                }
            }

        });

        $scope.$on('leafletDirectiveMarker.mouseout', function (event, args) {

            // args.closePopup();
            console.log("mouseout");
        });

        $scope.$on('leafletDirectiveMarker.mouseover', function (event, args) {
            //args.openPopup();
            console.log("mouseover");
            $scope.eventDetected = event.name;
            //$scope.current_node=null;

            $scope.getCabinetInfo(args.model);

            args.leafletObject._popup.options.minWidth = "80px";
            //$scope.current_cabinet = args.model;
            $scope.selected_cabinet = args.model
            args.leafletEvent.target.openPopup();
        });

        $scope.$on('leafletDirectiveMap.click', function (event) {
            $scope.collpased_node_metrics = false;
            $scope.collapsed = false;
            $scope.current_node = null;
            $scope.current_cabinet = null;

            $timeout(function () {
                leafletData.getMap().then(function (map) {
                    console.log("center on click marker");
                    $scope.maxbounds = [];
                    $scope.center_map.lat = $scope.selected_cabinet.lat;
                    $scope.center_map.lng = $scope.selected_cabinet.lng;
                    map.invalidateSize();
                });
            }, 1);

        });

        $scope.$on('leafletDirectiveMarker.click', function (event, args) {
            $scope.eventDetected = event.name;
            $scope.current_node = null;
            console.log(args.model);
            console.log(args);
            args.leafletObject._popup.options.minWidth = "80px";
            args.leafletEvent.target.openPopup();

            $scope.current_cabinet = args.model;
            $scope.selected_cabinet = args.model


            $scope.collpased_node_metrics = false;
            $scope.collapsed = true;

            $scope.getCabinetInfo($scope.selected_cabinet);

            $timeout(function () {
                leafletData.getMap().then(function (map) {
                    console.log("center on click marker");
                    $scope.maxbounds = [];
                    $scope.center_map.lat = $scope.selected_cabinet.lat;
                    $scope.center_map.lng = $scope.selected_cabinet.lng;
                    map.invalidateSize();
                });
            }, 1);

        });

        $scope.getCabinetInfo = function (cabinet) {
            console.log(cabinet);

            $scope.servicesPerCabinet = 0;
            $scope.tenantsPerCabinet = 0;
            cabinet.nodes.forEach(function (node) {
                var nodeID = node.name
                NodesService.getTenants(nodeID).then(function (tenants) {
                    console.log(tenants);
                    var tenantInfo = {};

                    $scope.selected_cabinet.tenants = [];
                    $scope.servicesPerCabinet = 0;

                    tenants.TenantsIds.forEach(function (tenantId) {
                        TenantsService.get(tenantId).then(function (ten) {
                            tenantInfo = {};
                            tenantInfo.id = tenantId;
                            tenantInfo.name = ten.name;
                            ServicesInstancesService.getListperNode(nodeID, tenantId).then(function (instance) {
                                instance.SvcInstances.forEach(function (svcId) {
                                    $scope.servicesPerCabinet++;
                                });
                            });
                            if (!containsObject(tenantInfo, $scope.selected_cabinet.tenants)) {
                                $scope.selected_cabinet.tenants.push(tenantInfo);
                            }
                        });
                    });
                });
            });
        };

        function containsObject(obj, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == obj.id) {
                    return true;
                }
            }
            return false;
        }

        $scope.chooseClickTab = function (tab) {

            console.log("tab pressed:" + tab)
            if (tab.url == "tab_metrics") {
                $scope.getNodeStats($scope.current_node.name);
                $scope.getAgentNodeStats($scope.current_node.name);
                $scope.collpased_node_metrics = true;
                $scope.collapsed = false;

            } else if(tab.url == "tab_power_control"){

                //$scope.getCabinetEnergyStats($scope.current_node.name);
                $scope.collpased_node_metrics = true;
                $scope.collapsed = false;


            }else{
                $scope.collpased_node_metrics = false;
                $scope.collapsed = true;
            }

            $timeout(function () {
                leafletData.getMap().then(function (map) {
                    console.log("center on click marker");
                    $scope.maxbounds = [];
                    $scope.center_map.lat = $scope.selected_cabinet.lat;
                    $scope.center_map.lng = $scope.selected_cabinet.lng;
                    map.invalidateSize();
                });
            }, 1);
        };

        $scope.getAgentNodeStats = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusMinutes(15).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            /**get stats**/
            
            $scope.createAgentNodeCPU(nodeID,start_date,end_date);

            $scope.createAgentNodeRam(nodeID,start_date,end_date);

            $scope.createAgentNodeIO(nodeID,start_date,end_date);

            $scope.createAgentNodeDISK(nodeID,start_date,end_date);

            

        }


        $scope.createAgentNodeCPU = function(nodeID,start_date,end_date){

            MonitoringService.getResourceStats('agents', nodeID+'_agents', 'cpu', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_cpu = readDataCPUVis(_data.data);

                console.log(_data_Agentnode_cpu);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_Agentnode_cpu.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_Agentnode_cpu.data);
                    $scope.graphDataAgentCPU = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsAgentCPU={

                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                        
                    }

                    $timeout(function() {
                        $scope.updateGraphAgentCPU(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });

        }


        $scope.createAgentNodeRam = function(nodeID,start_date,end_date){



            MonitoringService.getResourceStats('agents', nodeID+'_agents', 'memory', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_ram = readDataRAMVis(_data.data);

                console.log(_data_Agentnode_ram);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_Agentnode_ram.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_Agentnode_ram.data);
                    $scope.graphDataAgentRAM = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsAgentRAM={

                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                    }

                    $timeout(function() {
                        $scope.updateGraphAgentRAM(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });

        }

        $scope.createAgentNodeIO = function(nodeID,start_date,end_date){
             MonitoringService.getResourceStats('agents', nodeID+'_agents', 'io', start_date, end_date).then(function (_data_io) {
                    var _data_Agentnode_io = readDataIOVis(_data_io.data);
                    
                



                console.log(_data_Agentnode_io);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_Agentnode_io.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_Agentnode_io.data);
                    $scope.graphDataAgentIO = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsAgentIO={

                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                    }

                    $timeout(function() {
                        $scope.updateGraphAgentIO(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));
                    });
        }


        $scope.createAgentNodeDISK = function(nodeID,start_date,end_date){
            MonitoringService.getResourceStats('agents', nodeID+'_agents', 'disk', start_date, end_date).then(function (_data_disk) {

                    var _data_agentnode_disk = readDataDiskVis(_data_disk.data);

                    



                console.log(_data_agentnode_disk);
                


                   var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_agentnode_disk.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_agentnode_disk.data);
                    $scope.graphDataAgentDISK = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsAgentDISK={
                       start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                        
                    }

                    $timeout(function() {
                        $scope.updateGraphAgentDISK(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));
                });

        }


        $scope.updateGraphAgentIO = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('agents', nodeID+'_agents', 'io', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_io = readDataIOVis(_data.data);

                console.log(_data_Agentnode_io);
                
                 $scope.graphDataAgentIO.items.add(_data_Agentnode_io.data);

                  $scope.graphOptionsAgentIO.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsAgentIO.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphAgentIO(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };

        $scope.updateGraphAgentDISK = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('agents', nodeID+'_agents', 'disk', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_disk = readDataDiskVis(_data.data);

                console.log(_data_Agentnode_disk);
                
                 $scope.graphDataAgentDISK.items.add(_data_Agentnode_disk.data);
                  $scope.graphOptionsAgentDISK.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsAgentDISK.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphAgentDISK(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };
        $scope.updateGraphAgentRAM = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('agents', nodeID+'_agents', 'memory', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_ram = readDataRAMVis(_data.data);

                console.log(_data_Agentnode_ram);
                
                 $scope.graphDataAgentRAM.items.add(_data_Agentnode_ram.data);

                  $scope.graphOptionsAgentRAM.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsAgentRAM.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphAgentRAM(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };

        $scope.updateGraphAgentCPU = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('agents', nodeID+'_agents', 'cpu', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_Agentnode_cpu = readDataCPUVis(_data.data);

                console.log(_data_Agentnode_cpu);
                
                 $scope.graphDataAgentCPU.items.add(_data_Agentnode_cpu.data);

                  $scope.graphOptionsAgentCPU.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsAgentCPU.end =  vis.moment().add(20,'seconds');


                       
                  
                    $timeout(function() {
                        $scope.updateGraphAgentCPU(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };

        /***********End FogNode Stats *********/



        $scope.createNodeCPU = function(nodeID,start_date,end_date){

            MonitoringService.getResourceStats('nodes', nodeID, 'cpu', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_cpu = readDataCPUVis(_data.data);

                console.log(_data_node_cpu);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_node_cpu.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_node_cpu.data);
                    $scope.graphDataCPU = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsCPU={

                       start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                        
                    }

                    $timeout(function() {
                        $scope.updateGraphCPU(nodeID);
                    }, DELAY_UPDATE);

            });

        }


        $scope.createNodeRam = function(nodeID,start_date,end_date){



            MonitoringService.getResourceStats('nodes', nodeID, 'memory', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_ram = readDataRAMVis(_data.data);

                console.log(_data_node_ram);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_node_ram.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_node_ram.data);
                    $scope.graphDataRAM = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsRAM={

                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                    }

                    $timeout(function() {
                        $scope.updateGraphRAM(nodeID);
                    }, DELAY_UPDATE);

            });

        }

        $scope.createNodeIO = function(nodeID,start_date,end_date){
             MonitoringService.getResourceStats('nodes', nodeID, 'io', start_date, end_date).then(function (_data_io) {
                    var _data_node_io = readDataIOVis(_data_io.data);
                    
                



                console.log(_data_node_io);
                


                    var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_node_io.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_node_io.data);
                    $scope.graphDataIO = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsIO={

                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                    }

                    $timeout(function() {
                        $scope.updateGraphIO(nodeID);
                    }, DELAY_UPDATE);
                    });
        }


        $scope.createNodeDISK = function(nodeID,start_date,end_date){
            MonitoringService.getResourceStats('nodes', nodeID, 'disk', start_date, end_date).then(function (_data_disk) {

                    var _data_node_disk = readDataDiskVis(_data_disk.data);

                    



                console.log(_data_node_disk);
                


                   var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_node_disk.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_node_disk.data);
                    $scope.graphDataDISK = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsDISK={
                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                        
                    }

                    $timeout(function() {
                        $scope.updateGraphDISK(nodeID);
                    }, DELAY_UPDATE);
                });

        }

        $scope.updateGraphIO = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(5).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);
            if($scope.currentTab == "tab_metrics"){

             MonitoringService.getResourceStats('nodes', nodeID, 'io', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_io = readDataIOVis(_data.data);

                console.log(_data_node_io);
                
                 $scope.graphDataIO.items.add(_data_node_io.data);

                  $scope.graphOptionsIO.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsIO.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphIO(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });

         }
        };

        $scope.updateGraphDISK = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(5).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('nodes', nodeID, 'disk', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_disk = readDataDiskVis(_data.data);

                console.log(_data_node_disk);
                
                 $scope.graphDataDISK.items.add(_data_node_disk.data);
                  $scope.graphOptionsDISK.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsDISK.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphDISK(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };
        $scope.updateGraphRAM = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('nodes', nodeID, 'memory', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_ram = readDataRAMVis(_data.data);

                console.log(_data_node_ram);
                
                 $scope.graphDataRAM.items.add(_data_node_ram.data);

                  $scope.graphOptionsRAM.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsRAM.end =  vis.moment().add(20,'seconds')

                    $timeout(function() {
                        $scope.updateGraphRAM(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };

        $scope.updateGraphCPU = function(nodeID){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

             if($scope.currentTab == "tab_metrics"){
             MonitoringService.getResourceStats('nodes', nodeID, 'cpu', start_date, end_date).then(function (_data) {
                console.log(_data);

                var _data_node_cpu = readDataCPUVis(_data.data);

                console.log(_data_node_cpu);
                
                 $scope.graphDataCPU.items.add(_data_node_cpu.data);

                  $scope.graphOptionsCPU.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsCPU.end =  vis.moment().add(20,'seconds');


                       

                    $timeout(function() {
                        $scope.updateGraphCPU(nodeID);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }


        };


        $scope.updateGraphPower = function(nodeID, capability){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            if($scope.currentTab == "tab_power_control"){
                MonitoringService.getPowerResourceStats(nodeID, 'power', capability.cap_id, start_date, end_date).then(function (_data) {
                    console.log(_data);

                  var _data_node_power = []

                   



                     if(capability.subtype == 'ice'){

                        _data_node_power = readDataPower(_data.data);

                       

                     }else if(capability.subtype == 'smartlink'){
                        _data_node_power = readDataPowerSmartlink(_data.data);

                       

                     }

                    console.log(_data_node_power);
                    
                     $scope.graphDataPOWER.items.add(_data_node_power.data);

                      $scope.graphOptionsPower.start = vis.moment().add(-15, 'minutes');
                      $scope.graphOptionsPower.end =  vis.moment().add(20,'seconds');


                         

                        $scope.power_timeout_id=$timeout(function() {
                            $scope.updateGraphPower(nodeID, capability);
                        }, DELAY_UPDATE+randomIntFromInterval(0,6000));

                });
            }


        };
        $scope.updateGraphCurrent = function(nodeID, capability){

            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusSeconds(10).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

             if($scope.currentTab == "tab_power_control"){
             MonitoringService.getPowerResourceStats(nodeID, 'power', capability.cap_id, start_date, end_date).then(function (_data) {
                console.log(_data);

                

                    var _data_node_current = [];



                     if(capability.subtype == 'ice'){

                      

                        _data_node_current = readDataCurrent(_data.data);

                     }else if(capability.subtype == 'smartlink'){
                       

                        _data_node_current = readDataConsumSmartlink(_data.data);

                     }

                console.log(_data_node_current);
                
                 $scope.graphDataCurrent.items.add(_data_node_current.data);

                  $scope.graphOptionsCurrent.start = vis.moment().add(-15, 'minutes');
                  $scope.graphOptionsCurrent.end =  vis.moment().add(20,'seconds');


                       

                    $scope.current_timeout_id = $timeout(function() {
                        $scope.updateGraphCurrent(nodeID, capability);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));

            });
         }

        };

        $scope.createNodePower = function(nodeID, capability, start_date, end_date){

            $scope.current_capabilities = capability;    
            $scope.current_capabilities.state = true;


            if($scope.current_timeout_id != 0){
                $timeout.cancel($scope.current_timeout_id);
            }

            if($scope.power_timeout_id != 0){
                $timeout.cancel($scope.power_timeout_id);
            }
           
                MonitoringService.getPowerResourceStats(nodeID, 'power', capability.cap_id, start_date, end_date).then(function (_data) {
                    

                    var _data_node_power = []

                    var _data_node_current = [];

                     $scope.graphDataPOWER ={};
                     $scope.graphOptionsPowe ={};


                      $scope.graphDataCurrent = {};
                     

                    $scope.graphOptionsCurrent={};

                     if(capability.subtype == 'ice'){

                        _data_node_power = readDataPower(_data.data);

                        _data_node_current = readDataCurrent(_data.data);

                        $scope.current_power_graph_name = "Active power (W)";
                        $scope.current_consumption_graph_name = "Current (A)";


                       

                     }else if(capability.subtype == 'smartlink'){
                        _data_node_power = readDataPowerSmartlink(_data.data);

                        _data_node_current = readDataConsumSmartlink(_data.data);

                        $scope.current_power_graph_name = "Power";
                        $scope.current_consumption_graph_name = "Consumption";

                     }

                

                   



                console.log("power"+_data_node_power);
                console.log("current"+_data_node_current);
               


                   var dataGroups = new VisDataSet();
                   
                    dataGroups.add(_data_node_power.groups);
                    var dataItems = new VisDataSet();
                    dataItems.add(_data_node_power.data);
                    $scope.graphDataPOWER = {
                      items: dataItems,
                      groups: dataGroups
                    };

                    $scope.graphOptionsPower={
                       start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250,
                        dataAxis:{left:{range:{min:0}}}
                        
                    }

                    $scope.power_timeout_id =  $timeout(function() {
                        $scope.updateGraphPower(nodeID,capability);
                    }, DELAY_UPDATE);


                    var dataCurrentGroups = new VisDataSet();
                   
                    dataCurrentGroups.add(_data_node_current.groups);
                    var dataCurrentItems = new VisDataSet();
                    dataCurrentItems.add(_data_node_current.data);
                    $scope.graphDataCurrent = {
                      items: dataCurrentItems,
                      groups: dataCurrentGroups
                    };

                    $scope.graphOptionsCurrent={
                        start: vis.moment().add(-15, 'minutes'), // changed so its faster
                        end: vis.moment().add(20,'seconds'),
                        height:250
                        
                    }



                    $scope.current_timeout_id = $timeout(function() {
                        $scope.updateGraphCurrent(nodeID,capability);
                    }, DELAY_UPDATE+randomIntFromInterval(0,6000));
                });

           


          
            






                    
               


        };


        $scope.getNodeStats = function(nodeID){
            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusMinutes(15).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);

            /**get stats**/
            
            $scope.createNodeCPU(nodeID,start_date,end_date);

            $scope.createNodeRam(nodeID,start_date,end_date);

            $scope.createNodeIO(nodeID,start_date,end_date);

            $scope.createNodeDISK(nodeID,start_date,end_date);

            //$scope.createNodePower(nodeID,start_date,end_date);


            

               

            



                //object_id, resource, resourceId, start, end
                


        };

       

        $scope.getCabinetEnergyStats = function(nodeID, selectedCapability){
            var end_date = parseInt(new Date().getTime() / 1000);

            var start_date = parseInt(new Date().minusMinutes(15).getTime() / 1000);
            console.log("start:" + start_date);
            console.log("end:" + end_date);
            console.log("capability"+selectedCapability);

            var json = JSON.parse(selectedCapability);


            $scope.createNodePower(nodeID,json,start_date,end_date);

        };

        $scope.updateNode = function (nodeID) {
            $scope.active = [];
            console.log("click on node:" + nodeID);
            $scope.current_cabinet = null;

            $scope.collpased_node_metrics = false;
            $scope.collapsed = true;


            $timeout(function () {
                leafletData.getMap().then(function (map) {
                    console.log("center on click marker");
                    $scope.maxbounds = [];
                    $scope.center_map.lat = $scope.selected_cabinet.lat;
                    $scope.center_map.lng = $scope.selected_cabinet.lng;
                    map.invalidateSize();
                });
            }, 1);

           

            NodesService.get(nodeID).then(function (data) {
                console.log(data);

                $scope.current_node = customDataNode(data);


                NodesService.getTenants(nodeID).then(function (tenants) {
                    var tenantInfo = {};

                    $scope.current_node.tenants_total = Object.keys(tenants.TenantsIds).length;
                    $scope.current_node.tenants = [];
                    $scope.servicesPerNode = 0;
                    //                    tenantInfo.id

                    tenants.TenantsIds.forEach(function (tenantId) {
                        var tenantCounter = 0;

                        TenantsService.get(tenantId).then(function (ten) {
                            //$scope.current_node.tenants[tenantCounter] = {};
                            tenantInfo = {};
                            tenantInfo.id = tenantId;
                            tenantInfo.name = ten.name;
                            tenantInfo.services = [];
                            $scope.current_node.tenants[tenantId] = tenantInfo;
                            $scope.current_node.tenants[tenantId].services = [];
                            console.log(nodeID);

                            ServicesInstancesService.getListperNode(nodeID, tenantId).then(function (instance) {
                                console.log(instance);
                                instance.SvcInstances.forEach(function (svcId) {
                                    ServicesInstancesService.getDefinition(svcId).then(function (svcDef) {
                                        ServicesService.get(svcDef.SvcId).then(function (svc) {
                                            console.log($scope.current_node.tenants);
                                            //console.log($scope.current_node.tenants[tenantCounter].services);
                                            var serviceInfo = {};
                                            serviceInfo = svc;
                                            serviceInfo.node = nodeID;
                                            //serviceInfo.Fognodes = svcDef.Fognodes;
                                            // tenantInfo.services.push(serviceInfo);

                                            $scope.current_node.tenants[tenantId].services.push(serviceInfo);
                                            $scope.servicesPerNode++;
                                        });
                                    });
                                });
                                console.log(tenantInfo);

                            });
                            console.log(tenantInfo);
                            //$scope.current_node.tenants.push(tenantInfo);
                        });
                    });
                });
            });
        }; //scope.updateNode()

        $scope.updateEvents = function(){

           
            if(typeof $scope.current_cabinet !== 'undefined'){
                 EventsService.update($scope.current_cabinet).then(function (data) {
                    console.log('data returned');
                    console.log(data);

                    
                    //$scope.dataCollection = data;

                    if($scope.dataCollection.length == 10){
                        $scope.dataCollection.pop();
                    }else{
                    $scope.dataCollection.unshift(data);
                    }
                });
             }
                $timeout(function() {
                    $scope.updateEvents();
                }, DELAY_UPDATE_LOGS+randomIntFromInterval(0,5000));



        };
        


        $scope.initNetwork = function (id_node) {

            console.log("init Network");

            /*EventsService.getList().then(function (data) {
                console.log('data returned');
                console.log(data);

               
                $scope.dataCollection = data;
            });*/

            $timeout(function() {
                        $scope.updateEvents();
                    }, DELAY_UPDATE_LOGS);
            


            var array_bounds = [];
            CabinetsService.getList().then(function (data) {
                console.log('data returned');
                console.log(data);
                //$scope.nodeCollection = data;

                data.forEach(function (_current_cab) {
                    //for (var index = data.length - 1; index >= 0; --index) {

                    var _cabinet = _current_cab


                    _cabinet.lat = _current_cab.lat;
                    _cabinet.lng = _current_cab.lng;

                    var coord = [];
                    coord.push(_current_cab.lat);
                    coord.push(_current_cab.lng);

                    array_bounds.push(coord);


                    _cabinet.layer = "cabinet",
                        _cabinet.icon = {
                            iconUrl: 'images/server-rack-cabinet-hi.png',
                            iconSize: [40, 60], // size of the icon
                            iconAnchor: [30, 40], // point of the icon which will correspond to marker's location
                            popupAnchor: [-26, -50] // point from which the popup should open relative to the iconAnchor
                        };

                    _cabinet.message = "<div ng-include src=\"'views/modals/cabinetMarker.html'\"></div>"

                    _cabinet.getMessageScope = function () {
                        return $scope;
                    };

                    $scope.markers[_cabinet.id] = _cabinet;

                    // }

                });
                leafletData.getMap().then(function (map) {
                    console.log("center on last cabinet");
                    //$scope.center_map.lat = _current_cab.lat;
                    //$scope.center_map.lng = _current_cab.lng;
                    $scope.center_map.zoom = 18;
                    if (array_bounds.length == 1) {
                        $scope.center_map.lat = array_bounds[0][0];
                        $scope.center_map.lng = array_bounds[0][1];
                    } else {
                        $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray(array_bounds)
                    }

                    map.invalidateSize();
                });
            });

        };
        //};

        $scope.initStats = function (id_node) {

        };

        $scope.active = [];
        $scope.showTenantDetail = function (id) {
            if ($scope.active[id]) {
                $scope.active[id] = false;
            } else {
                $scope.active[id] = true;
            }
        };


    });
