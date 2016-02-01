'use strict';

angular.module('mqnaasApp')
    .directive('graph2d', function () {
        return {
            restrict: 'AE',
            scope: {
                ngModel: '=',
                onSelect: '&',
                options: '=',
                data: '=data'
            },
            link: function (scope, $element, $attrs, ngModel) {
                console.log("initial Directive");
                var container = $element[0];
                var graph = null;

                var options = {
                    start: vis.moment().add(-30, 'seconds'), // changed so its faster
                    end: vis.moment(),
                    dataAxis: {
                        customRange: {
                            left: {
                                min: -10,
                                max: 10
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


                scope.options = {
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

                //graph = new vis.Graph2d(container, scope.data, scope.options);
                scope.data = new vis.DataSet(scope.ngModel);

                scope.$watch('packetsData2', function () {
                    console.log("UPDATE PACKETS2")
                });

                scope.$watch(function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            console.log("UPDATE");
                        }
                        console.log("watch");
                        console.log(scope.data);
                        console.log(scope.data.get());
                        console.log(scope.data.get().length);
                        console.log(scope.data.get().length - 1);

                        if (scope.data.get().length > 0) {
                            var lastId = scope.data.get()[scope.data.get().length - 1];
                            var last = scope.data.get()[scope.data.get().length - 1].y;
                            console.log(last);
                            var current = parseInt(scope.ngModel.tx._packets) - last;
                            console.log(scope.ngModel);
                            if (scope.ngModel === undefined || scope.ngModel.length === 0) return;
                            scope.data.add({
                                x: new Date(),
                                y: current
                            });
                        } else {
                            scope.data.add({
                                x: new Date(),
                                y: 0
                            });
                        }
                    },
                    function (value) {
                        graph = new vis.Graph2d(container, scope.data, scope.options);
                    });
            }
        }
    }).directive('visGraph2d', function () {
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
