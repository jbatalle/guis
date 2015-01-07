'use strict';
angular.module('openNaaSApp')
        .directive('grapheditor', ['localStorageService', '$timeout', function (localStorageService, timer) {
                return {
                    restrict: 'EA',
                    scope: {},
                    templateUrl: 'partials/d3/editor.html',
                    link: function (scope, element, attrs) {
                        graph = new myGraph("#graph");
                        graph.setNodes(localStorageService.get("graphNodes"));
                        scope.graph = graph;
                        timer(console.log("TIMER HEUEHE"), 0);
                        console.log(localStorageService.get("graphNodes"));
                        console.log(localStorageService.get("networkElements"));

                        var networkElements = localStorageService.get("networkElements");
                        var links = [];
                        var lin = {s: 0, t: 1};
                        links.push(lin);
                        var nodes = [];
                        //for each network element
                        for (var i = 0; i < networkElements.length; i++) {
                            console.log(networkElements[i]);
                            var type = networkElements[i].split("-")[0].toLowerCase();
                            var id = networkElements[i];
//                        var ports = networkElements[i].ports.port;
                            var ports = [];
//        createSwitch(id, ports);
                            var node = {};
                            node.id = id;
                            node.type = type;
                            node.ports = ports;
                            node.x = Math.floor((Math.random() * 400) + 1);
                            node.y = Math.floor((Math.random() * 400) + 1);
                            node.net_force = {};
                            node.velocity = {x: 0, y: 0};
                            nodes.push(node);
                            //{id:1, x: 10, y: 20, net_force: {}, velocity: {}
                        }
                        var edges = [];
                        var edge = {};
                        for (var i = 0; i < links.length; i++) {
                            edge = {};
                            for (var j = 0; j < nodes.length; j++) {
                                for (var t = 0; t < nodes[j].ports.length; t++) {
                                    if (nodes[j].ports[t]._id === links[i].srcPort) {
                                        var srcP = j;
                                    }
                                    if (nodes[j].ports[t]._id === links[i].dstPort) {
                                        var dstP = j;
                                    }
                                }
                            }
                            edge = {s: srcP, t: dstP};
                            edges.push(edge);
                        }

                        //create edges
                        var matrix = [];
                        for (var i = 0; i < nodes.length; i++) {
                            matrix[i] = [];
                            for (var j = 0; j < nodes.length; j++) {
                                matrix[i][j] = false;
                            }
                        }
                        /*                    for (var i = 0; i < edges.length; i++) {
                         matrix[edges[i].s][edges[i].t] = true;
                         matrix[edges[i].t][edges[i].s] = true;
                         }
                         */
                        nodes = StaticForcealgorithm(nodes, matrix);
                        for (i = 0; i < nodes.length; i++) {
//                            console.log(nodes[i].x + " " + nodes[i].y);
                            if (nodes[i].x < 0) {
                                nodes[i].x = nodes[i].x + 400 / 2;
                            }
                            if (nodes[i].y < 0) {
                                nodes[i].y = nodes[i].y + 400 / 2;
                            }
                            if (nodes[i].x > 400) {
                                nodes[i].x = 400;
                            }
                            if (nodes[i].y > 400) {
                                nodes[i].y = 400;
                            }
//        createSwitch(nodes[i].id, nodes[i].ports, nodes[i].x, nodes[i].y);
                            var divPos = {x: nodes[i].x, y: nodes[i].y};
                            var data = {id: nodes[i].id, ports: nodes[i].ports};
                            createElement(nodes[i].id, nodes[i].type, divPos, data);
//                            localStorageService.set("graphNodes", graph.getNodes());
                        }
                    }};
            }])
        .directive('droppable', ['$window', '$rootScope', 'localStorageService', '$timeout', function ($window, $rootScope, localStorageService, timer) {
                return {
                    // A = attribute, E = Element, C = Class and M = HTML Comment
                    restrict: 'AE',
                    controller: function ($scope, ngDialog) {
                        console.log($scope);
                        $scope.arn = {network: "Network-Internal-1.0-2", endpoint: "http://fibratv.dtdns.net:41080"};
                        $scope.cpe = {network: "Network-Internal-1.0-2", endpoint: "http://fibratv.dtdns.net:41081"};
                        $scope.openARNDialog = function (nodeType, divPos) {
//                            $scope.arn = {endpoint: "asdasdsa"};
                            ngDialog.open({
                                template: 'partials/sodales/arnDialog.html',
                                data: {"nodeType": nodeType, "divPos": divPos}})
                        };
                        $scope.openCPEDialog = function (nodeType, divPos) {
                            ngDialog.open({
                                template: 'partials/sodales/cpeDialog.html',
                                data: {"nodeType": nodeType, "divPos": divPos}});
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
                                divPos = {//position where the element is dropped
                                    x: $newPosX,
                                    y: $newPosY
                                };
                                console.log(divPos);
                                if (nodeType === "arn") {
                                    scope.openARNDialog(nodeType, divPos);
                                } else if (nodeType === "cpe") {
                                    scope.openCPEDialog(nodeType, divPos);
                                }
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

        .directive('draggable', ['$window', '$rootScope', function ($window, $rootScope) {
                return {
                    // A = attribute, E = Element, C = Class and M = HTML Comment
                    restrict: 'AE',
                    link: function (scope, element, attrs) {
                        var el = element[0];
                        var w = angular.element($window);
                        element.draggable({
                            revert: true,
                            start: function (event, ui) {
                                console.log("Start dragging");
                                console.log(event);
                                console.log(ui);
                                console.log(event.target.id);
                            },
                            stop: function (event, ui) {
                                console.log("Stop dragging");
                                console.log(event);
                                console.log(ui);
                            }
                        });
                    }
                };
            }])
        .directive('graphview', ['localStorageService', '$timeout', function (localStorageService, timer) {
                return {
                    restrict: 'EA',
                    scope: {},
                    templateUrl: 'partials/d3/view.html',
                    link: function (scope, element, attrs) {
                        graph = new myGraph("#graph");
                        graph.setNodes(localStorageService.get("graphNodes"));
                        scope.graph = graph;
                        timer(console.log("TIMER HEUEHE"), 0);
                        console.log(localStorageService.get("graphNodes"));
                        console.log(localStorageService.get("networkElements"));

                        var networkElements = localStorageService.get("networkElements");
                        var links = [];
                        var lin = {s: 0, t: 1};
                        links.push(lin);
                        var nodes = [];
                        //for each network element
                        for (var i = 0; i < networkElements.length; i++) {
                            console.log(networkElements[i]);
                            console.log(networkElements[i].split("-")[0].toLowerCase());
                            var type = networkElements[i].split("-")[0].toLowerCase();
                            var id = networkElements[i];
//                        var ports = networkElements[i].ports.port;
                            var ports = [];
//        createSwitch(id, ports);
                            var node = {};
                            node.id = id;
                            node.type = type;
                            node.ports = ports;
                            node.x = Math.floor((Math.random() * 400) + 1);
                            node.y = Math.floor((Math.random() * 400) + 1);
                            node.net_force = {};
                            node.velocity = {x: 0, y: 0};
                            nodes.push(node);
                            console.log(nodes);
                            //{id:1, x: 10, y: 20, net_force: {}, velocity: {}
                        }
                        var edges = [];
                        var edge = {};
                        for (var i = 0; i < links.length; i++) {
                            edge = {};
                            for (var j = 0; j < nodes.length; j++) {
                                for (var t = 0; t < nodes[j].ports.length; t++) {
                                    if (nodes[j].ports[t]._id === links[i].srcPort) {
                                        var srcP = j;
                                    }
                                    if (nodes[j].ports[t]._id === links[i].dstPort) {
                                        var dstP = j;
                                    }
                                }
                            }
                            edge = {s: srcP, t: dstP};
                            edges.push(edge);
                        }

                        //create edges
                        var matrix = [];
                        for (var i = 0; i < nodes.length; i++) {
                            matrix[i] = [];
                            for (var j = 0; j < nodes.length; j++) {
                                matrix[i][j] = false;
                            }
                        }
                        /*                    for (var i = 0; i < edges.length; i++) {
                         matrix[edges[i].s][edges[i].t] = true;
                         matrix[edges[i].t][edges[i].s] = true;
                         }
                         */
                        nodes = StaticForcealgorithm(nodes, matrix);
                        for (i = 0; i < nodes.length; i++) {
                            console.log(nodes[i].x + " " + nodes[i].y);
                            if (nodes[i].x < 0) {
                                nodes[i].x = nodes[i].x + 400 / 2;
                            }
                            if (nodes[i].y < 0) {
                                nodes[i].y = nodes[i].y + 400 / 2;
                            }
                            if (nodes[i].x > 400) {
                                nodes[i].x = 400;
                            }
                            if (nodes[i].y > 400) {
                                nodes[i].y = 400;
                            }
//        createSwitch(nodes[i].id, nodes[i].ports, nodes[i].x, nodes[i].y);
                            var divPos = {x: nodes[i].x, y: nodes[i].y};
                            var data = {id: nodes[i].id, ports: nodes[i].ports};
                            console.log("NODE TYPE: " + nodes[i].type);
                            createElement(nodes[i].id, nodes[i].type, divPos, data);
                        }
                    }};
            }]);