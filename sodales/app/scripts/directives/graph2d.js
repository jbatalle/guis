'use strict';

angular.module('mqnaasApp')
    .directive('graph2d', function () {
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
                    console.log(newValue);
                    console.log(oldValue);
                    if (newValue) {
                        var items = [];
                        console.log($scope.ngModel);
                        console.log($scope.ngModel);

                        var options = {
                            start: vis.moment().add(-30, 'seconds'), // changed so its faster
                            end: vis.moment(),
                            dataAxis: {
                                left: {
                                    range: {
                                        min: 0,
                                        max: 100 u
                                    }
                                }
                            },
                            drawPoints: {
                                style: 'circle' // square, circle
                            },
                            shaded: {
                                orientation: 'bottom' // top, bottom
                            }
                        };
                        var dataset = new vis.DataSet($scope.ngModel);
                        var timeline = new vis.Graph2d($element[0], $scope.ngModel, options);
                    }
                });
            }
        }
    });