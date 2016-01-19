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
            areaLng = -100.2471641,
            areaZoom = 3;

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
                    draggable: true
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
            /*
                        $scope.map = {
                            center: {
                                latitude: areaLat,
                                longitude: areaLng
                            },
                            zoom: areaZoom
                        };*/
            $scope.options = {
                scrollwheel: false
            };
        });

    });
