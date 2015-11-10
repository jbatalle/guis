'use strict';

angular.module('mqnaasApp')
    .factory('VirtualService', function ($q, $rootScope, MqNaaSResourceService) {
        var getSlice = function (resourceName, viId) { //get
            var deferred = $q.defer();
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (data) {
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.slicing = {};
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };
                getUnits(resourceName, data);
                getCubes(resourceName, data);
                deferred.resolve(data.data);
            });
            return deferred.promise;
        };
        var getUnits = function (resourceName, sliceId) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement";
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };
        var getRangeUnit = function (resourceName, sliceId, unitId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + '/IRequestResourceManagement/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };
        var getCubes = function (resourceName, sliceId) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };

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
            }
        };
    });
