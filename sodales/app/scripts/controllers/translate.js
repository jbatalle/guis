'use strict';

angular.module('mqnaasApp')
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) { //en/ca
            $translate.use(langKey);
        };
    });