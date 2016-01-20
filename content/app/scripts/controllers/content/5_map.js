'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('mapController', function ($scope, uiGmapGoogleMapApi) {
        // Define variables for our Map object
        var areaLat = 44.2126995,
            areaLng = -2.2471641,
            areaZoom = 3;


        $scope.map = {
            center: {
                latitude: areaLat,
                longitude: areaLng
            },
            zoom: 4,
            bounds: {}
        };
        $scope.options = {
            scrollwheel: false
        };
        var createRandomMarker = function (i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i
            };
            ret[idKey] = i;
            return ret;
        };
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
                        coords: {
                            latitude: res.lat,
                            longitude: res.long,
                        },
                        options: {
                            draggable: true,
                            icon: {
                                url: "plugin/img/CONTENT_EPC.png",
                                scaledSize: new google.maps.Size(50, 40)
                            }
                        }
                    };
                    markers.push(ret);
                });

                $scope.randomMarkers = markers;
            }
        }, true);


        /*
                uiGmapGoogleMapApi.then(function (maps) {
                    $scope.map = {
                        center: {
                            latitude: 46.55113517855131,
                            longitude: 12.063643676757806
                        },
                        zoom: 4
                    };
                    //38.04914648446548
                    //23.807448414683314
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: 51.46711493688214,
                            longitude: -2.5386133365631167
                        },
                        options: {
                            draggable: true,
                            icon: {
                                url: "plugin/img/CONTENT_EPC.png",
                                scaledSize: new google.maps.Size(50, 40)
                            }
                        },
                        events: {
                            dragend: function (marker, eventName, args) {
                                $log.log('marker dragend');
                                var lat = marker.getPosition().lat();
                                var lon = marker.getPosition().lng();
                                $log.log(lat);
                                $log.log(lon);

                                $scope.marker.options = {
                                    draggable: true,
                                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                    labelAnchor: "100 0",
                                    labelClass: "marker-labels"

                                };
                            }
                        }
                    };

                    $scope.map = {
                        center: {
                            latitude: areaLat,
                            longitude: areaLng
                        },
                        zoom: areaZoom
                    };
                    $scope.options = {
                        scrollwheel: false
                    };
                });*/

    });
