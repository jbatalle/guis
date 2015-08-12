'use strict';

angular.module('mqnaasApp')
    .directive('widgetmetrics', function () {
        return {
            link: function (scope, element) {
                scope.$on("toggleAnimation", function (event, args) {
                    options = args;
                    scope.data = args.data;
                    //scope.options = args;

                    createGraph()
                });

                // default options
                var options = {
                    //baselines: [], // [{value: 160000000, label: 'a baseline'}];
                    //title: null,
                    //x_accessor: null,
                    //y_accessor: null
                };
                // override default options with values from the scope
                if (scope.options) {
                    Object.keys(scope.options).forEach(function (key) {
                        options[key] = scope.options[key];
                    });
                }
                // create a random identifier for the chart element
                // TODO replace this with a template that has a unique id
                function randomString(len) {
                    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    var s = '';
                    for (var i = 0; i < len; i++) {
                        var randomPoz = Math.floor(Math.random() * charSet.length);
                        s += charSet.substring(randomPoz, randomPoz + 1);
                    }
                    return 'mg-chart-' + s;
                }
                createGraph();

                function createGraph() {
                    element[0].id = element[0].id ? element[0].id : randomString(5);
                    // set the data and target configuration options

                    if(scope.data.length == 0){
                        options.chart_type = 'missing-data';
                        options.missing_text= 'No data available';
                    }
                    options.data = scope.data || [];
                    options.target = '#' + element[0].id;
                    // create the chart
                    MG.data_graphic(options);
                }
            },
            restrict: 'E',
            scope: {
                data: '=',
                options: '='
            }
        };
    });
