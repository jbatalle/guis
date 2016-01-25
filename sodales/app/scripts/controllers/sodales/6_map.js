'use strict';

angular.module('mqnaasApp')
    .controller('mapController', function ($scope, $rootScope, uiGmapGoogleMapApi, $alert, $modal, IMLService) {
        
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
        resources_list.resources.push({id: "test", type: "ARN", lat: "41.8", long: "2.21"});
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function () {
            return $scope.map.bounds;
        }, function (nv, ov) {
            // Only need to regenerate once
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                angular.forEach(resources_list.resources, function (res, index) {
                    console.log(res);
                    var ret = {
                        id: index,
                        latitude: res.lat,
                        longitude: res.long,
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
            }
        }, true);
        

        $scope.windowOptions = {
            visible: false
        };
        $scope.onClick = function(marker, eventName, model) {
            console.log("Clicked!");
            model.show = !model.show;
        };

    });
