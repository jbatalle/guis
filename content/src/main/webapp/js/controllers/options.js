'use strict';

angular.module('openNaaSApp')
    .controller('optionsCtrl', function ($scope, $rootScope, endpointService) {
        $rootScope.viewName = "Options";
        var url = "";
        $scope.options = {};
        endpointService.get().then(function (data) {
            //http://admin:123456@84.88.41.171:9000
            var t = data.split(":")
            $scope.options.port = t.pop();
            //if string contains @, if not, split with //
            $scope.options.ip = t.pop().split("@")[1];
        });

        $scope.update = function (options) {
            endpointService.post(options.ip, options.port);
        };
    });