'use strict';

angular.module('mqnaasApp')
    .directive('widgetgauge', function () {
        return {
            restrict: 'E',
            templateUrl:"views/widgets/gauge.html",
            scope: {
		        percent : "=percent",
		        state : "=state",
		        label : "=label"

		    }
        }
    });