'use strict';

angular.module('mqnaasApp')
    .factory('PhysicalService', function ($q, $rootScope, MqNaaSResourceService, arnService) {
        var getSlice = function (resourceName) { //get
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/slice';
            MqNaaSResourceService.getText(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };
                getUnits(resourceName, data);
                getCubes(resourceName, data);
            });
        };
        var getUnits = function (resourceName, sliceId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement';
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };
        var getRangeUnit = function (resourceName, sliceId, unitId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };
        var getCubes = function (resourceName, sliceId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/ISliceAdministration/cubes';
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };
        var getResource = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.id = data.resource.id;
                $rootScope.resourceInfo.type = data.resource.type;
                if (data.resource.type === 'Network' && data.resource.type === 'link' && data.resource.type === undefined) {
                    ///nothing
                } else if (data.resource.type === 'CPE') {
                    $rootScope.resourceInfo.ports = [];
                    var cpePorts = checkIfIsArray(data.resource.resources.resource);
                    angular.forEach(cpePorts, function (port) {
                        //if (port > 99 && porrt < 112) port.type = "external";
                        //else port.type = "internal";
                        if (parseInt(port.attributes.entry[0].value) > 99 && parseInt(port.attributes.entry[0].value) < 112) $rootScope.resourceInfo.ports.push(port);
                    });
                } else {
                    //if is ARN, get Card, and type of port
                    arnService.put(getAllInterfaces()).then(function (data) {
                        $rootScope.resourceInfo.ports = checkIfIsArray(data.response.operation.interfaceList.interface);
                    })
                }
                $rootScope.resourceInfo.slicing = {};
                getSlice(resourceName);
            });
        }

        return {
            getSlice: function (resourceName) {
                return getSlice(resourceName);
            },
            getUnits: function (resourceName, sliceId) {
                return getUnits(resourceName, sliceId);
            },
            getRangeUnit: function (resourceName, sliceId, unitId) {
                return getRangeUnit(resourceName, sliceId, unitId);
            },
            getCubes: function (resourceName, sliceId) {
                return getCubes(resourceName, sliceId);
            },
            getResource: function (resourceName) {
                return getResource(resourceName);
            }
        };
    });
