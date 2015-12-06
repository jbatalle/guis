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
                });
                network.on("dragStart", function (properties) {
                    if (!properties.nodes.length) return;
                    $scope.setNodesMoveable(properties.nodes, true);
                });

                network.on("dragEnd", function (properties) {
                    if (!properties.nodes.length) return;
                    $scope.setNodesMoveable(properties.nodes, false);
                });

                $scope.setNodesMoveable = function (nodeIds, isMoveable) {
                    var updates = [];
                    var isFixed = !isMoveable;
                    for (var i = nodeIds.length; i--;) {
                        updates.push({
                            id: nodeIds[i],
                            fixed: {
                                x: isFixed,
                                y: isFixed
                            }
                        });
                    }
                    console.log(network);
                    $scope.ngModel.nodes.update(updates);
                };
            }
        }
    })
    .directive('phydroppable', ['$window', '$rootScope', '$modal', function ($window, $rootScope, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            scope: '&',
            /*controller: function ($scope, $modal) {
                
            },*/
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
                    }
                });
            }
        };
}])
    .directive('vidroppable', ['$window', '$rootScope', '$modal', function ($window, $rootScope, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            controller: function ($scope, $modal) {
                $scope.openAddResourceDialog = function (nodeType, divPos) {
                    $rootScope.resourceRequest = "";
                    $scope.resource = {};
                    $scope.resource.type = nodeType;
                    $modal({
                        title: 'Adding a virtual ' + nodeType,
                        template: 'views/modals/addResInVIDialog.html',
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
