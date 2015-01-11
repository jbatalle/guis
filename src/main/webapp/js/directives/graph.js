'use strict';
angular.module('openNaaSApp')
        .directive('grapheditor', ['localStorageService', '$timeout', function (localStorageService, timer) {
                return {
                    restrict: 'EA',
                    scope: {},
                    templateUrl: 'partials/d3/editor.html',
                    link: function (scope, element, attrs) {
                        graph = new myGraph("#graph");
//                        graph.setNodes(localStorageService.get("graphNodes"));
                        scope.graph = graph;
                        timer(console.log("TIMER HEUEHE"), 0);
                        console.log(localStorageService.get("graphNodes"));
                        console.log(localStorageService.get("networkElements"));
                        console.log(localStorageService.get("arnPorts"));
                        //var xmlTopology = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <ns2:topology xmlns:ns2="opennaas.api"> <networkElements> <networkElement xsi:type="switch" id="openflowswitch:s1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s1.1"> <state> <congested>false</congested> </state> </port> <port id="s1.2"> <state> <congested>false</congested> </state> </port> <port id="s1.3"> <state> <congested>false</congested> </state> </port> <port id="s1.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> <networkElement xsi:type="switch" id="openflowswitch:s2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s2.1"> <state> <congested>false</congested> </state> </port> <port id="s2.2"> <state> <congested>false</congested> </state> </port> <port id="s2.3"> <state> <congested>false</congested> </state> </port> </ports> </networkElement><networkElement xsi:type="switch" id="openflowswitch:s3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s3.1"> <state> <congested>false</congested> </state> </port> <port id="s3.2"> <state> <congested>false</congested> </state> </port> <port id="s3.3"> <state> <congested>false</congested> </state> </port> <port id="s3.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> </networkElements> <links> <link> <state> <congested>false</congested> </state> <srcPort>s1.1</srcPort> <dstPort>s2.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s1.2</srcPort> <dstPort>s3.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s2.2</srcPort> <dstPort>s3.2</dstPort> </link> </links> <networkDevicePortIdsMap> <entry> <key>s1.1</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s1.2</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s1.3</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s1.4</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>4</devicePortId> </value> </entry> <entry> <key>s2.1</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s2.2</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s2.3</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s3.1</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s3.2</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s3.3</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s3.4</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>4</devicePortId> </value> </entry> </networkDevicePortIdsMap> </ns2:topology>';
                        var xmlTopology = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <ns2:topology xmlns:ns2="opennaas.api"> <networkElements> <networkElement xsi:type="switch" id="openflowswitch:s1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s1.1"> <state> <congested>false</congested> </state> </port> <port id="s1.2"> <state> <congested>false</congested> </state> </port> <port id="s1.3"> <state> <congested>false</congested> </state> </port> <port id="s1.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> <networkElement xsi:type="switch" id="openflowswitch:s2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s2.1"> <state> <congested>false</congested> </state> </port> <port id="s2.2"> <state> <congested>false</congested> </state> </port> <port id="s2.3"> <state> <congested>false</congested> </state> </port> </ports> </networkElement><networkElement xsi:type="switch" id="openflowswitch:s3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s3.1"> <state> <congested>false</congested> </state> </port> <port id="s3.2"> <state> <congested>false</congested> </state> </port> <port id="s3.3"> <state> <congested>false</congested> </state> </port> <port id="s3.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> </networkElements> <links> <link> <state> <congested>false</congested> </state> <srcPort>s1.1</srcPort> <dstPort>s2.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s1.2</srcPort> <dstPort>s3.1</dstPort> </link>  <link> <state> <congested>false</congested> </state> <srcPort>s2.2</srcPort> <dstPort>s3.2</dstPort> </link>  </links>  </ns2:topology>';
                        var networkElements = [
                            {x:350, y:300, "_id": "openflowswitch:OFSwitch-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port: [{"_id":"OF11"}, {"_id":"OF12"}, {"_id":"OF13"}]}},
                            {x:250, y:200, "_id": "openflowswitch:OFSwitch-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port:[{"_id":"OF21"}, {"_id":"OF22"}]}},
                            {x:250, y:400, "_id": "openflowswitch:OFSwitch-6", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port:[{"_id":"OF31"}, {"_id":"OF32"}]}},
                            {x:550, y:300, "_id": "tson:Tson-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T11"}, {"_id":"T12"}, {"_id":"T13"}]}},
                            {x:650, y:200, "_id": "tson:Tson-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T21"}, {"_id":"T22"}]}},
                            {x:650, y:400, "_id": "tson:Tson-6", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T31"}, {"_id":"T32"}]}},
                            {x:100, y:200, "_id": "tson:wireless-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "wifi", ports: {port:[{"_id":"CHANNEL-1"}, {"_id":"CHANNEL-1"},{"_id":"CHANNEL-2"}, {"_id":"CHANNEL-3"},{"_id":"CHANNEL-4"}, {"_id":"CHANNEL-5"},{"_id":"CHANNEL-6"}, {"_id":"CHANNEL-7"}]}},
                            {x:100, y:250, "_id": "tson:wireless-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "wifi", ports: {port:[{"_id":"T31"}, {"_id":"T32"}]}},
                        ];
                        var links = [{srcPort:"T11", dstPort:"OF11"},
                            {srcPort:"OF12", dstPort:"OF21"},{srcPort:"OF22", dstPort:"OF31"},{srcPort:"OF32", dstPort:"OF13"},
                            {srcPort:"T12", dstPort:"T21"},{srcPort:"T22", dstPort:"T31"},{srcPort:"T32", dstPort:"T13"}
                        ];
                        var json = convertXml2JSonObject(xmlTopology);
                        console.log(json);

//                        var networkElements = json.topology.networkElements.networkElement;
                        console.log(networkElements);
//                        var links = json.topology.links.link;
                        console.log(links);
                        var nodes = [];
                        //for each network element
                        for (var i = 0; i < networkElements.length; i++) {
                            console.log(networkElements[i]);
                            var type = networkElements[i]["_xsi:type"];
                            if(type === "switch") type = "ofSwitch";
                            var id = networkElements[i]._id.split(":")[1];
                            var ports = networkElements[i].ports.port;
                            //var ports = [];
console.log(networkElements[i].ports);
console.log(ports);
                            var node = {};
                            node.id = id;
                            node.type = type;
                            node.ports = ports;
//                            node.x = Math.floor((Math.random() * 400) + 1);
//                            node.y = Math.floor((Math.random() * 400) + 1);
                            node.x = networkElements[i].x;
                            node.y = networkElements[i].y;
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
//                        nodes = StaticForcealgorithm(nodes, matrix);
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
                            var divPos = {x: nodes[i].x, y: nodes[i].y};
                            var data = {id: nodes[i].id, ports: nodes[i].ports};
                            console.log(nodes);
                            createElement(nodes[i].id, nodes[i].type, divPos, data);
//                            localStorageService.set("graphNodes", graph.getNodes());
                        }
                        console.log(links);

                                      graph.addLink("OFSwitch-4", "OFSwitch-5");
                                      graph.addLink("OFSwitch-5", "OFSwitch-6");
                                      graph.addLink("OFSwitch-6", "OFSwitch-4");
                                      graph.addLink("Tson-4", "Tson-5");
                                      graph.addLink("Tson-5", "Tson-6");
                                      graph.addLink("Tson-6", "Tson-4");
                                      graph.addLink("Tson-4", "OFSwitch-4");
                        
                        links.forEach(function(e){
                            console.log(e);
                            console.log(e.srcPort);
//                            graph.addLinkBetweenPorts(e.srcPort, e.dstPort);
                        });
                        graph.update();
                    }};
                        
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
//                        graph.setNodes(localStorageService.get("graphNodes"));
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
            }])
        .directive('droppablevi', ['$window', '$rootScope', 'localStorageService', '$timeout', function ($window, $rootScope, localStorageService, timer) {
                return {
                    // A = attribute, E = Element, C = Class and M = HTML Comment
                    restrict: 'AE',
                    controller: function ($scope, ngDialog) {
                        console.log($scope);
                        
                        $scope.openaddVIResDialog = function (nodeType, divPos) {
                            ngDialog.open({
                                template: 'partials/addResInVIDialog.html',
                                data : {"nodeType": nodeType, "divPos": divPos}});
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

                                console.log("Create with draw");
                                console.log(graph.getNodes());
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
                    restrict: 'EA',
                    scope: {},
                    templateUrl: 'partials/d3/editorVI.html',
                    link: function (scope, element, attrs) {
                        graph = new myGraph("#graph");
//                        graph.setNodes(localStorageService.get("graphNodes"));
                        scope.graph = graph;
                        timer(console.log("TIMER"), 0);
                        console.log(localStorageService.get("graphNodes"));
                        console.log(localStorageService.get("virtualElements"));

                        var xmlTopology = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <ns2:topology xmlns:ns2="opennaas.api"> <networkElements> <networkElement xsi:type="switch" id="openflowswitch:s1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s1.1"> <state> <congested>false</congested> </state> </port> <port id="s1.2"> <state> <congested>false</congested> </state> </port> <port id="s1.3"> <state> <congested>false</congested> </state> </port> <port id="s1.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> <networkElement xsi:type="switch" id="openflowswitch:s2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s2.1"> <state> <congested>false</congested> </state> </port> <port id="s2.2"> <state> <congested>false</congested> </state> </port> <port id="s2.3"> <state> <congested>false</congested> </state> </port> </ports> </networkElement><networkElement xsi:type="switch" id="openflowswitch:s3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s3.1"> <state> <congested>false</congested> </state> </port> <port id="s3.2"> <state> <congested>false</congested> </state> </port> <port id="s3.3"> <state> <congested>false</congested> </state> </port> <port id="s3.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> </networkElements> <links> <link> <state> <congested>false</congested> </state> <srcPort>s1.1</srcPort> <dstPort>s2.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s1.2</srcPort> <dstPort>s3.1</dstPort> </link>  <link> <state> <congested>false</congested> </state> <srcPort>s2.2</srcPort> <dstPort>s3.2</dstPort> </link>  </links>  </ns2:topology>';
                        var json = convertXml2JSonObject(xmlTopology);
                        console.log(json);

                        var networkElements = json.topology.networkElements.networkElement;
                        var links = json.topology.links.link;
                        var networkElements = [
                            {x:350, y:300, "_id": "openflowswitch:OFSwitch-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port: [{"_id":"OF11"}, {"_id":"OF12"}, {"_id":"OF13"}]}},
                            {x:250, y:200, "_id": "openflowswitch:OFSwitch-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port:[{"_id":"OF21"}, {"_id":"OF22"}]}},
                            {x:250, y:400, "_id": "openflowswitch:OFSwitch-6", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "switch", ports: {port:[{"_id":"OF31"}, {"_id":"OF32"}]}},
                            {x:550, y:300, "_id": "tson:Tson-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T11"}, {"_id":"T12"}, {"_id":"T13"}]}},
                            {x:650, y:200, "_id": "tson:Tson-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T21"}, {"_id":"T22"}]}},
                            {x:650, y:400, "_id": "tson:Tson-6", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "tson", ports: {port:[{"_id":"T31"}, {"_id":"T32"}]}},
                            {x:100, y:200, "_id": "tson:wireless-4", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "wifi", ports: {port:[]}},
                            {x:100, y:250, "_id": "tson:wireless-5", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "wifi", ports: {port:[]}},
                            {x:100, y:300, "_id": "tson:wireless-6", "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance","_xsi:type": "wifi", ports: {port:[]}}
                        ];
                        var links = [{srcPort:"T11", dstPort:"OF11"},
                            {srcPort:"OF12", dstPort:"OF21"},{srcPort:"OF22", dstPort:"OF31"},{srcPort:"OF32", dstPort:"OF13"},
                            {srcPort:"T12", dstPort:"T21"},{srcPort:"T22", dstPort:"T31"},{srcPort:"T32", dstPort:"T13"}
                        ];
                        var nodes = [];
                        //for each network element
                        for (var i = 0; i < networkElements.length; i++) {
                            console.log(networkElements[i]);
                            var type = networkElements[i]["_xsi:type"];
                            if(type === "switch") type = "ofSwitch";
                            var id = networkElements[i]._id.split(":")[1];
                            var ports = networkElements[i].ports.port;
//                            ports = [];

                            var node = {};
                            node.id = id;
                            node.type = type;
                            node.ports = ports;
                            node.x = networkElements[i].x;
                            node.y = networkElements[i].y;
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
//                                nodes[i].x = 400;
                            }
                            if (nodes[i].y > 400) {
//                                nodes[i].y = 400;
                            }
//        createSwitch(nodes[i].id, nodes[i].ports, nodes[i].x, nodes[i].y);
                            var divPos = {x: nodes[i].x, y: nodes[i].y};
                            var data = {id: nodes[i].id, ports: nodes[i].ports};
                            createElement(nodes[i].id, nodes[i].type, divPos, data);
//                            localStorageService.set("graphNodes", graph.getNodes());
                        }
                        graph.addLink("OFSwitch-4", "OFSwitch-5");
                                      graph.addLink("OFSwitch-5", "OFSwitch-6");
                                      graph.addLink("OFSwitch-6", "OFSwitch-4");
                                      graph.addLink("Tson-4", "Tson-5");
                                      graph.addLink("Tson-5", "Tson-6");
                                      graph.addLink("Tson-6", "Tson-4");
                                      graph.addLink("Tson-4", "OFSwitch-4");
                    }};
            }])
        ;