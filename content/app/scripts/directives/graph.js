'use strict';
angular.module('mqnaasApp')
    .directive('grapheditor', ['localStorageService', '$timeout', function (localStorageService, timer) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'views/d3/editor.html',
            link: function (scope, element, attrs) {
                graph = new myGraph("#graph", {
                    mode: "view"
                });
                //                        graph.setNodes(localStorageService.get("graphNodes"));
                scope.graph = graph;
                timer(console.log("TIMER"), 0);
                var networkElements = resources.resources;
                var links = resources.links;
                console.log(resources.resources);
                var nodes = [];
                for (var i = 0; i < networkElements.length; i++) {
                    console.log(networkElements[i]);
                    var type = networkElements[i]["type"].toLowerCase();
                    if (type === "switch") type = "ofswitch";
                    var node = {};
                    node.id = networkElements[i].id;
                    node.type = type;
                    node.ports = networkElements[i].ports;
                    node.x = networkElements[i].x;
                    node.y = networkElements[i].y;
                    node.net_force = {};
                    node.velocity = {
                        x: 0,
                        y: 0
                    };
                    nodes.push(node);
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
                    edge = {
                        s: srcP,
                        t: dstP
                    };
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
                for (i = 0; i < nodes.length; i++) {
                    if (nodes[i].x < 0) {
                        nodes[i].x = nodes[i].x + 400 / 2;
                    }
                    if (nodes[i].y < 0) {
                        nodes[i].y = nodes[i].y + 400 / 2;
                    }
                    if (nodes[i].x > 400) {
                        //                                nodes[i].x = 400;
                    }
                    if (nodes[i].y > 400) {
                        //                                nodes[i].y = 400;
                    }
                    var divPos = {
                        x: nodes[i].x,
                        y: nodes[i].y
                    };
                    var data = {
                        id: nodes[i].id,
                        ports: nodes[i].ports
                    };
                    createElement(nodes[i].id, nodes[i].type, divPos, data);
                }
                graph.addLink("OFSwitch-23", "Tson-24");
                graph.addLink("Tson-24", "Tson-25");
                graph.addLink("Tson-24", "Tson-26");
                graph.addLink("Tson-25", "Tson-26");
                graph.addLink("OFSwitch-23", "EPC-20");

                graph.addLink("OFSwitch-23", "WNODE-14");
                graph.addLink("OFSwitch-23", "WNODE-17");

                //   graph.update();
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
                    helper: 'clone',
                    start: function (event, ui) {
                        console.log("Start dragging");
                    },
                    stop: function (event, ui) {
                        console.log("Stop dragging");
                    }
                });
            }
        };
    }])
    .directive('graphview', ['localStorageService', '$timeout', function (localStorageService, timer) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'views/d3/view.html',
            link: function (scope, element, attrs) {
                graph = new myGraph("#graph", {
                    mode: "view"
                });
                //                        graph.setNodes(localStorageService.get("graphNodes"));
                scope.graph = graph;
                timer(console.log("TIMER"), 0);
                console.log(localStorageService.get("graphNodes"));
                console.log(localStorageService.get("networkElements"));

                var networkElements = resources.resources;
                var links = resources.links;

                var nodes = [];
                //for each network element
                for (var i = 0; i < networkElements.length; i++) {
                    console.log(networkElements[i]);
                    var type = networkElements[i].type.toLowerCase();
                    var id = networkElements[i];
                    var ports = [];
                    var node = {};
                    node.id = id;
                    node.type = type;
                    node.ports = networkElements[i].ports;
                    node.x = networkElements[i].x;
                    node.y = networkElements[i].y;
                    node.net_force = {};
                    node.velocity = {
                        x: 0,
                        y: 0
                    };
                    nodes.push(node);
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
                    edge = {
                        s: srcP,
                        t: dstP
                    };
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
                    var divPos = {
                        x: nodes[i].x,
                        y: nodes[i].y
                    };
                    var data = {
                        id: nodes[i].id,
                        ports: nodes[i].ports
                    };
                    console.log("NODE TYPE: " + nodes[i].type);
                    createElement(nodes[i].id, nodes[i].type, divPos, data);
                }
            }
        };
            }])
    .directive('droppablevi', ['$window', '$rootScope', 'localStorageService', '$timeout', '$modal', function ($window, $rootScope, localStorageService, timer, $modal) {
        return {
            // A = attribute, E = Element, C = Class and M = HTML Comment
            restrict: 'AE',
            scope: '&',
            controller: function ($scope, $modal) {
                console.log($scope);
                /*
                $scope.openaddVIResDialog = function (nodeType, divPos) {
    console.log("MODAL");
    $scope.nodeType = nodeType;
    $scope.divPos = divPos;
    $modal({
        title: 'Are you sure you want to add this item?',
        template: 'views/content/addResInVIDialog.html',
        show: true,
        scope: $scope
    });
};*/
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

                        console.log("Create with draw");
                        //console.log(graph.getNodes());
                        scope.openaddVIResDialog(nodeType, divPos);
                        //                                createElement("randomName", nodeType, divPos);

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
    .directive('grapheditorvi', ['localStorageService', '$timeout', function (localStorageService, timer) {
        return {
            restrict: 'A',
            templateUrl: 'views/d3/editorVI.html',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    // observe changes in attribute - could also be scope.$watch
                    $attrs.$observe('grapheditorvi', function (value) {
                        if (value) {
                            console.log(value);
                            // pass value to app controller
                            //$scope.virtualElements = value;
                        }
                    });
                }
            ],
            link: function (scope, element, attrs) {

                graph = new myGraph("#graph", {
                    mode: "edit"
                });

                attrs.$observe('grapheditorvi', function (value) {
                    if (value) {
                        console.log(value);
                        // pass value to app controller
                        scope.virtualElements = value;

                        //     }
                        //});
                        console.log(scope.virtualElements);

                        //                        graph.setNodes(localStorageService.get("graphNodes"));
                        scope.graph = graph;
                        timer(console.log("TIMER"), 2);
                        console.log(localStorageService.get("graphNodes"));
                        console.log(localStorageService.get("virtualElements"));
                        console.log(scope);
                        console.log(scope.$parent);
                        //console.log(scope.virtualElements);
                        //console.log(scope.$parent.virtualElements);
                        //console.log(resources);
                        var networkElements = resources.resources;
                        var links = resources.links;

                        var nodes = [];
                        var virtualElements = scope.virtualElements;
                        console.log(scope.virtualElements);
                        console.log(virtualElements);
                        //networkElements = networkElements.concat(virtualElements).filter(function (el) {
                        if (scope.virtualRequest !== undefined) {
                            networkElements = networkElements.concat(scope.virtualRequest.vi_req_resources).filter(function (el) {
                                console.log(el);
                                return el !== null;
                            });
                        }
                        console.log(t);
                        //for each network element
                        for (var i = 0; i < networkElements.length; i++) {
                            var type = networkElements[i]["type"].toLowerCase();
                            if (type === "switch") type = "ofSwitch";
                            var node = {};
                            node.ports = [];
                            node.id = networkElements[i].id;
                            node.type = type;
                            if (networkElements[i].ports !== undefined) node.ports = networkElements[i].ports;
                            node.x = networkElements[i].x;
                            node.y = networkElements[i].y;
                            node.net_force = {};
                            node.velocity = {
                                x: 0,
                                y: 0
                            };
                            nodes.push(node);
                            //{id:1, x: 10, y: 20, net_force: {}, velocity: {}
                        }
                        var edges = [];
                        var edge = {};

                        for (var i = 0; i < links.length; i++) {
                            edge = {};
                            for (var j = 0; j < nodes.length; j++) {
                                if (nodes[j].ports !== undefined)
                                    for (var t = 0; t < nodes[j].ports.length; t++) {
                                        if (nodes[j].ports[t]._id === links[i].srcPort) {
                                            var srcP = j;
                                        }
                                        if (nodes[j].ports[t]._id === links[i].dstPort) {
                                            var dstP = j;
                                        }
                                    }
                            }
                            edge = {
                                s: srcP,
                                t: dstP
                            };
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
                        // nodes = StaticForcealgorithm(nodes, matrix);
                        for (i = 0; i < nodes.length; i++) {
                            //                            console.log(nodes[i].x + " " + nodes[i].y);
                            if (nodes[i].x < 0) {
                                nodes[i].x = nodes[i].x + 400 / 2;
                            }
                            if (nodes[i].y < 0) {
                                nodes[i].y = nodes[i].y + 400 / 2;
                            }
                            if (nodes[i].x > 400) {
                                //                                nodes[i].x = 400;
                            }
                            if (nodes[i].y > 400) {
                                //                                nodes[i].y = 400;
                            }
                            //        createSwitch(nodes[i].id, nodes[i].ports, nodes[i].x, nodes[i].y);
                            var divPos = {
                                x: nodes[i].x,
                                y: nodes[i].y
                            };
                            var data = {
                                id: nodes[i].id,
                                ports: nodes[i].ports
                            };
                            createElement(nodes[i].id, nodes[i].type, divPos, data);
                        }
                        graph.addLink("OFSwitch-23", "Tson-24");
                        graph.addLink("Tson-24", "Tson-25");
                        graph.addLink("Tson-24", "Tson-26");
                        graph.addLink("Tson-25", "Tson-26");
                        graph.addLink("OFSwitch-23", "EPC-20");

                        graph.addLink("OFSwitch-23", "WNODE-14");
                        graph.addLink("OFSwitch-23", "WNODE-17");
                    }
                });
                console.log(scope.virtualElements);
                /*scope.$watch('virtualElements', function (newValue, oldValue) {
                    if (newValue) {
                        console.log("I see a data change!");
                        console.log(newValue);
                        console.log(oldValue);
                        console.log(virtualElements);
                    }
                }, true);*/


            }
        };
    }]).directive('graphviewvi', ['localStorageService', '$timeout', function (localStorageService, timer) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'views/d3/view.html',
            link: function (scope, element, attrs) {
                graph = new myGraph("#graph", {
                    mode: "view"
                });
                //                        graph.setNodes(localStorageService.get("graphNodes"));
                scope.graph = graph;
                timer(console.log(""), 1000);
                //console.log(localStorageService.get("graphNodes"));
                console.log(localStorageService.get("networkElements"));

                var networkElements = localStorageService.get("networkElements").vi_resources;
                var links = [];
                var lin = {
                    s: 0,
                    t: 1
                };
                links.push(lin);
                var nodes = [];
                //for each network element
                for (var i = 0; i < networkElements.length; i++) {
                    var node = {};
                    node.id = networkElements[i].id;
                    node.type = networkElements[i].type.toLowerCase();
                    node.ports = [];
                    node.x = Math.floor((Math.random() * 400) + 1);
                    node.y = Math.floor((Math.random() * 400) + 1);
                    node.net_force = {};
                    node.velocity = {
                        x: 0,
                        y: 0
                    };
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
                    edge = {
                        s: srcP,
                        t: dstP
                    };
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
                    //console.log(nodes[i].x + " " + nodes[i].y);
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
                    var divPos = {
                        x: nodes[i].x,
                        y: nodes[i].y
                    };
                    var data = {
                        id: nodes[i].id,
                        ports: nodes[i].ports
                    };
                    createElement(nodes[i].id, nodes[i].type, divPos, data);
                }
            }
        };
}]);
