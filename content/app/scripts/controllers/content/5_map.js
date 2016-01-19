'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('mapController', function ($scope) {

        angular.module('myApplicationModule', ['uiGmapgoogle-maps']).config(
    ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
                GoogleMapApiProviders.configure({
                    china: true
                });
    }]
        );

    });
