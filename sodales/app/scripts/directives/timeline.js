'use strict';

angular.module('mqnaasApp')
    .directive('timeLine', function () {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                onSelect: '&',
                options: '='
            },
            link: function ($scope, $element, $attrs, ngModel) {
                $scope.$watch('ngModel', function (newValue, oldValue) {
                    if (newValue) {
                        var items = [];
                        _.each($scope.ngModel, function (element, index) {
                            items.push({
                                id: element.id,
                                content: element._code,
                                start: element._timeStamp * 1000
                            });
                        })

                        var options = {
                            start: $scope.ngModel[$scope.ngModel.length - 1]._timeStamp * 1000,
                            zoomMin: 1000 * 60 * 60 * 24, // a day
                            zoomMax: 1000 * 60 * 60 * 24 * 30 * 3 // three months
                        };
                        var timeline = new vis.Timeline($element[0], items, options);
                    }
                });
            }
        }
    });
