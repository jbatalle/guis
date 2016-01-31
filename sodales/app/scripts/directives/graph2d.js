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
                console.log("AAA")
                console.log(ngModel);
                console.log(ngModel.packetsData2);
                $scope.packetsData2 = ngModel.packetsData2;
                $scope.$watch('packetsData2', function (newValue, oldValue) {
                    console.log("New model3")
                });

                $scope.$watch('ngModel', function (newValue, oldValue) {
                    console.log("New model2")
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
                                        max: 100
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
