'use strict';

angular.module('mqnaasApp')
    .directive('graph2d', function () {
        return {
            restrict: 'AE',
            scope: {
                ngModel: '=',
                onSelect: '&',
                options: '=',
                data: '=data',
                options: '=options'
            },
            link: function (scope, $element, $attrs, ngModel) {

                var container = $element[0];

                var graph = null;
                graph = new vis.Graph2d(container, scope.data, scope.options);

                scope.$watch(function () {
                    console.log("watch")
                    console.log(scope.data)
                    return scope.data;
                }, function (value) {
                    graph = new vis.Graph2d(container, scope.data, scope.options);
                });

                graph.on('select', function (properties) {
                    console.info('select.properties.nodes', properties.nodes);
                    console.info('select.properties.edges', properties.edges);
                });

                /*
                console.log("AAA")
                console.log(ngModel);
                console.log(ngModel.packetsData2);
                $scope.packetsData2 = ngModel.packetsData2;

                $scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (v) {
                    console.log("!!!!!");
                })
                $scope.$watch('ngModel', function (newValue, oldValue) {
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
                });*/
            }

        }
    }).directive('visGraph2d', function () {
        'use strict';
        return {
            restrict: 'EA',
            transclude: false,
            scope: {
                data: '=',
                options: '=',
                events: '='
            },
            link: function (scope, element, attr) {
                var graphEvents = [
                    'rangechange',
                    'rangechanged',
                    'timechange',
                    'timechanged',
                    'finishedRedraw'
                ];

                // Create the chart
                var graph = null;

                scope.$watch('data', function () {
                    console.log("Update data");
                    // Sanity check
                    if (scope.data == null) {
                        return;
                    }

                    // If we've actually changed the data set, then recreate the graph
                    // We can always update the data by adding more data to the existing data set
                    if (graph != null) {
                        graph.destroy();
                    }

                    // Create the graph2d object
                    graph = new vis.Graph2d(element[0], scope.data.items, scope.data.groups, scope.options);

                    // Attach an event handler if defined
                    angular.forEach(scope.events, function (callback, event) {
                        if (graphEvents.indexOf(String(event)) >= 0) {
                            graph.on(event, callback);
                        }
                    });

                    // onLoad callback
                    if (scope.events != null && scope.events.onload != null &&
                        angular.isFunction(scope.events.onload)) {
                        scope.events.onload(graph);
                    }
                });

                scope.$watchCollection('options', function (options) {
                    if (graph == null) {
                        return;
                    }
                    graph.setOptions(options);
                });
            }
        };
    });
