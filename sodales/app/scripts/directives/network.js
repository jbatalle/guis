'use strict';

angular.module('mqnaasApp')
    .directive('visNetwork', function () {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                onSelect: '&',
                options: '='
            },
            link: function ($scope, $element, $attrs, ngModel) {
                console.log($element[0]);
                var network = new vis.Network($element[0], $scope.ngModel, $scope.options || {});

                var onSelect = $scope.onSelect() || function (prop) {};
                network.on('select', function (properties) {
                    onSelect(properties);
                });

                network.on("initRedraw", function () {
                    // do something like move some custom elements?
                });
                network.on("beforeDrawing", function (ctx) {
                    for (var nodeId in $scope.ngModel.nodes._data) {
                        if ($scope.ngModel.nodes._data[nodeId].group === 'physical') {
                            var nodeType = $scope.ngModel.nodes._data[nodeId];
                            var nodePosition = network.getPositions([nodeId]);

                            ctx.strokeStyle = '#A6D5F7';
                            ctx.fillStyle = '#A6D5F7';
                            ctx.square(nodePosition[nodeId].x, nodePosition[nodeId].y, 50, 40);
                            ctx.fill();
                            ctx.stroke();
                        }
                    };
                    //

                });

                network.on("click", function (params) {
                    console.log("Click");
                    console.log(params);
                    //$rootSscope.resourceInfo = "test"
                    //$scope.
                });

            }

        }
    })
    .directive('phydroppable', ['$window', '$rootScope', 'localStorageService', '$modal', function ($window, $rootScope, localStorageService, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            controller: function ($scope, $modal) {
                $scope.openAddResourceDialog = function (nodeType, divPos) {
                    $scope.resource = {};
                    if (nodeType == 'arn') $scope.resource.endpoint = "http://fibratv.dtdns.net:41080";
                    else if (nodeType == 'cpe') $scope.resource.endpoint = "http://fibra2222tv.dtdns.net:41081";
                    $scope.resource.type = nodeType;
                    $modal({
                        title: 'Adding a new ' + nodeType,
                        template: 'views/sodales/resourceDialog.html',
                        show: true,
                        scope: $scope,
                        data: {
                            "nodeType": nodeType,
                            "divPos": divPos
                        }
                    });
                };
            },
            link: function (scope, element, attrs) {
                element.droppable({
                    drop: function (e, ui) {
                        var $newPosX = ui.offset.left - $(this).offset().left;
                        var $newPosY = ui.offset.top - $(this).offset().top;
                        var nodeType = angular.element(ui.draggable).parent().context.id;
                        var divPos = {};
                        var $div = $("#graph");
                        //    var e = window.event;
                        divPos = { //position where the element is dropped
                            x: $newPosX,
                            y: $newPosY
                        };
                        console.log(divPos);
                        scope.openAddResourceDialog(nodeType, divPos);
                        /*                        if (nodeType === "arn") {
                                                    scope.openARNDialog(nodeType, divPos);
                                                } else if (nodeType === "cpe") {
                                                    scope.openCPEDialog(nodeType, divPos);
                                                }*/
                        console.log("Create with draw");
                        console.log(graph.getNodes());
                        //                                createElement(nodeType, divPos);

                        var dragIndex = angular.element(ui.draggable).data('index'),
                            reject = angular.element(ui.draggable).data('reject'),
                            dragEl = angular.element(ui.draggable).parent(),
                            dropEl = angular.element(this);
                        if (dragEl.hasClass('list1') && !dropEl.hasClass('list1') && reject !== true) {
                            scope.list2.push(scope.list1[dragIndex]);
                            scope.list1.splice(dragIndex, 1);
                        } else if (dragEl.hasClass('list2') && !dropEl.hasClass('list2') && reject !== true) {
                            scope.list1.push(scope.list2[dragIndex]);
                            scope.list2.splice(dragIndex, 1);
                        }
                        scope.$apply();
                    }
                });
            }
        };
}])
    .directive('vidroppable', ['$window', '$rootScope', 'localStorageService', '$modal', function ($window, $rootScope, localStorageService, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            controller: function ($scope, $modal) {
                $scope.openAddResourceDialog = function (nodeType, divPos) {
                    $scope.resource = {};
                    if (nodeType == 'arn') $scope.resource.endpoint = "http://fibratv.dtdns.net:41080";
                    else if (nodeType == 'arn') $scope.resource.endpoint = "http://fibra2222tv.dtdns.net:41081";
                    $scope.resource.type = nodeType;
                    $modal({
                        title: 'Adding a virtual ' + nodeType,
                        template: 'views/addResInVIDialog.html',
                        show: true,
                        scope: $scope,
                        data: {
                            "nodeType": nodeType,
                            "divPos": divPos
                        }
                    });
                };
            },
            link: function (scope, element, attrs) {
                element.droppable({
                    drop: function (e, ui) {
                        var $newPosX = ui.offset.left - $(this).offset().left;
                        var $newPosY = ui.offset.top - $(this).offset().top;
                        var nodeType = angular.element(ui.draggable).parent().context.id;
                        var divPos = {};
                        var $div = $("#graph");
                        //    var e = window.event;
                        divPos = { //position where the element is dropped
                            x: $newPosX,
                            y: $newPosY
                        };
                        console.log(divPos);
                        scope.openAddResourceDialog(nodeType, divPos);
                        /*                        if (nodeType === "arn") {
                                                    scope.openARNDialog(nodeType, divPos);
                                                } else if (nodeType === "cpe") {
                                                    scope.openCPEDialog(nodeType, divPos);
                                                }*/
                        console.log("Create with draw");
                        //console.log(graph.getNodes());
                        //                                createElement(nodeType, divPos);

                        var dragIndex = angular.element(ui.draggable).data('index'),
                            reject = angular.element(ui.draggable).data('reject'),
                            dragEl = angular.element(ui.draggable).parent(),
                            dropEl = angular.element(this);
                        if (dragEl.hasClass('list1') && !dropEl.hasClass('list1') && reject !== true) {
                            scope.list2.push(scope.list1[dragIndex]);
                            scope.list1.splice(dragIndex, 1);
                        } else if (dragEl.hasClass('list2') && !dropEl.hasClass('list2') && reject !== true) {
                            scope.list1.push(scope.list2[dragIndex]);
                            scope.list2.splice(dragIndex, 1);
                        }
                        scope.$apply();
                    }
                });
            }
        };
}]);
