'use strict';

angular.module('mqnaasApp')
    .controller('viewNetwork', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, arnService, cpeService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log('Clean localStorage networkElements due network is not created.');
                localStorageService.set('networkElements', []);
                localStorageService.set('link', []);
                console.log($rootScope.networkId);
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            //mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IResourceModelReader/resourceModel  
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $scope.generateNodeData(data.resource.resources.resource);
            });
        };

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en'
        };

        $scope.onNodeSelect = function (properties) {
            var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selected);
        };

        $scope.edges.add([
            {
                id: 1,
                from: 1,
                to: 2
            },
        ]);
        $scope.generateNodeData = function (data) {
            //$scope.nodes = new vis.DataSet();
            data.forEach(function (node) {
                console.log(node);
                if (node.type !== undefined)
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image'
                    });
            });
        };
    }).controller('editNetwork', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, arnService, cpeService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log('Clean localStorage networkElements due network is not created.');
                localStorageService.set('networkElements', []);
                localStorageService.set('link', []);
                console.log($rootScope.networkId);
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            //mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IResourceModelReader/resourceModel  
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $scope.generateNodeData(data.resource.resources.resource);
            });
        };

        $scope.deleteResource = function (resName) {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
        };

        $scope.addResource = function (data) {
            console.log(data);
            if (data.type === 'arn') var resource = getResource('ARN', data.endpoint + '/cgi-bin/xml-parser.cgi');
            else if (data.type === 'cpe') var resource = getResource('CPE', data.endpoint);
            console.log(resource);
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration');
            //arnService.setUrl(data.endpoint);
            MqNaaSResourceService.put(url, resource).then(function (res) {
                console.log(res);
                $scope.dataARN = res;
                //$scope.configurePhysicalResource(data);
                //createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                $scope.nodes.add({
                    id: $scope.nodes.length,
                    label: res,
                    image: 'images/SODALES_' + data.type.toUpperCase() + '.png',
                    shape: 'image'
                });
            });
            this.$hide();
        };

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en',
            manipulation: {
                addNode: function (data, callback) {
                    //loadModal
                    console.log(data);
                    console.log(callback);
                    data.id = data.id;
                    data.label = data.id;
                    clearPopUp();
                    callback(data);
                },
                editNode: function (data, callback) {
                    // filling in the popup DOM elements
                },
                addEdge: function (data, callback) {
                    if (data.from == data.to) {
                        var r = confirm('Do you want to connect the node to itself?');
                        if (r == true) {
                            callback(data);
                        }
                    } else {
                        callback(data);
                    }
                }
            }
        };

        $scope.onNodeSelect = function (properties) {
            var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selected);
        };

        $scope.edges.add([
            {
                id: 1,
                from: 1,
                to: 2
            },
        ]);
        $scope.generateNodeData = function (data) {
            //$scope.nodes = new vis.DataSet();
            data.forEach(function (node) {
                console.log(node);
                if (node.type !== undefined)
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image'
                    });
            });
        };
    });;


function clearPopUp() {
    //document.getElementById('saveButton').onclick = null;
    //document.getElementById('cancelButton').onclick = null;
    //document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data, callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}
