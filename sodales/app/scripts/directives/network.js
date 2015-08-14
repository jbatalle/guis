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

            }

        }
    }).directive('droppable2', ['$window', '$rootScope', 'localStorageService', '$modal', function ($window, $rootScope, localStorageService, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            controller: function ($scope, $modal) {
                $scope.openAddResourceDialog = function (nodeType, divPos) {
                    $scope.arn = {
                        network: "Network-Internal-1.0-2",
                        endpoint: "http://fibratv.dtdns.net:41080"
                    };
                    $scope.cpe = {
                        network: "Network-Internal-1.0-2",
                        endpoint: "http://fibra2222tv.dtdns.net:41081"
                    };
                    $scope.resource = {};
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
                console.log("DROPPABLE");
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
}]);
