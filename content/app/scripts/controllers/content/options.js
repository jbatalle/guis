'use strict';

angular.module('mqnaasApp')
    .controller('optionsCtrl', function ($scope, $rootScope, AUTHENTICATION, BACKEND) {
        $rootScope.viewName = "Options";
        var url = "";
        $scope.options = {};
        $scope.options_auth = {};

        var t = AUTHENTICATION.split(":")
        $scope.options_auth.port = t.pop();
        $scope.options_auth.ip = t.pop();

        var t = BACKEND.split(":")
        $scope.options.port = t.pop();
        $scope.options.ip = t.pop();
    });
