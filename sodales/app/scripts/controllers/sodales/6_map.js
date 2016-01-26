'use strict';

angular.module('mqnaasApp')
    .controller('mapController', function ($scope, $rootScope, uiGmapGoogleMapApi, $alert, $modal, IMLService) {

        var url = "phyNetworks"
        IMLService.get(url).then(function (data) {
            // RootResourceService.list().then(function (data) {
            if (!data) return;
            //data = checkIfIsArray(data.IRootResource.IRootResourceId);

            $scope.listNetworks = data;
            if ($scope.listNetworks.length === 1) {
                $rootScope.networkId = '';
            }
            if (!$rootScope.networkId) {
                $rootScope.networkId = data[0];
            }
            $scope.selectedNetwork = $rootScope.networkId.id;
        });


        // Define variables for our Map object
        var areaLat = 41.8,
            areaLng = 2.2167,
            areaZoom = 15;

        $scope.map = {
            center: {
                latitude: areaLat,
                longitude: areaLng
            },
            zoom: areaZoom,
            bounds: {}
        };
        $scope.options = {
            scrollwheel: true
        };

        var resources_list = {};
        resources_list.resources = [];
        resources_list.resources.push({
            id: "test",
            type: "ARN",
            lat: "41.8",
            long: "2.21"
        });
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function () {
            return $scope.map.bounds;
        }, function (nv, ov) {
            // Only need to regenerate once
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                var url = "phyNetworks/" + $rootScope.networkId.id;
                IMLService.get(url).then(function (data) {
                    angular.forEach(data.phy_resources, function (res, index) {
                        var ret = {
                            id: index,
                            latitude: res.coords.lat,
                            longitude: res.coords.lon,
                            title: res.id,
                            icon: {
                                url: "images/SODALES_" + res.type + ".png",
                                scaledSize: new google.maps.Size(50, 40)
                            },
                            showWindow: false,
                            show: false,
                            options: {
                                labelContent: 'Markers id 3',
                                labelAnchor: "26 0",
                                labelClass: "marker-labels"
                            }
                        };
                        markers.push(ret);
                    });
                    $scope.randomMarkers = markers;
                });


            }
        }, true);


        $scope.windowOptions = {
            visible: false
        };
        $scope.onClick = function (marker, eventName, model) {
            console.log("Clicked!");
            model.show = !model.show;
        };

    });
