'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
  .controller('CreateVICtrl', function ($scope) {
  console.log("CreateVI controller");
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

