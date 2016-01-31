'use strict';

angular.module('mqnaasApp')
    .directive('graph2dbar', function () {
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
                    console.log("New model")
                    if (newValue) {
                        var items = [];
                        console.log($scope.ngModel);

                        var options = {
                            style: 'bar',
                            barChart: {
                                width: 50,
                                align: 'center',
                                sideBySide: true
                            }, // align: left, center, right
                            drawPoints: true,
                            dataAxis: {
                                left: {
                                    range: {
                                        min: -5,
                                        max: 30
                                    }
                                },
                                right: {
                                    range: {
                                        min: -5
                                    }
                                },
                                icons: true
                            },
                            orientation: 'top',
                            start: '2016-01-10',
                            end: '2016-02-18'

                        };
                        var dataset = new vis.DataSet($scope.ngModel.items);
                        var timeline = new vis.Graph2d($element[0], $scope.ngModel.items, $scope.ngModel.groups, options);
                    }
                });
            }
        }
    });
