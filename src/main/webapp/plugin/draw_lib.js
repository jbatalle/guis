/**
* Draw library. This library creates the SVG and allows to add/remove nodes...
*
* · on_lib/globalPluginFunctions contains the Global variables (graph, pushed keys...)
* · Multiselection is handled by on_lib/multiselect file and the vis.on function in this file.
* · Link management (create links, see link info, remove links...) in on_lib/link_mgt
*
*/

addJSFile(plugin_path+'models/elements.js');

var startState, endState, drag_line;

function myGraph(el) {

    // Add and remove elements on the graph object
    this.addNode = function (id) {
        nodes.push({id: id, fixed: true, type: "helpImage", transitions: [], x: 200, y:200, width: "20px", height: "20px"});
        update();
    };

    this.addNodewithPos = function (id, x, y) {
        console.log("Add node");
        nodes.push({id: id, fixed: true, type: "helpImage", transitions: [], x: x, y: y, width: "20px", height: "20px"});
        update();
    };

    this.addNodewithData = function (data) {
        data.fixed = true;
        data.transitions = [];
        nodes.push(data);
        update();
    };

    this.addPortsToNode = function (nodeId, data) {
        n = findNode(nodeId);
            n.ports = data;
        ports.push = data;
        update();
    };
    
    this.addPortToNode = function (nodeId, port) {
console.log("Add ports to node");
        n = findNode(nodeId);
        n.ports.push(port);
        nodes.filter(function (d) { return d.id == nodeId})[0].ports = n.ports;
console.log(nodes);        
        update();
    }

    this.removeNode = function (id) {
        var i = 0,
            n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n)||(links[i]['target'] == n)) links.splice(i,1);
            else i++;
        }
        nodes.splice(findNodeIndex(id),1);
        update();
    };

    this.addLink = function (source, target) {
console.log("add link");
        console.log(findNode(source));
update();
        links.push({id: source+"-"+target, source:findNode(source), target:findNode(target)});
        console.log(links);
        update();
    };

    this.addLinkBetweenPorts = function (source, target) {
        console.log(nodes);
        update();
console.log("add link between ports");
        console.log(findPortNode(source));
//        links.push({id: source+"-"+target, source:findNode(source), target:findNode(target)});
        links.push({id: source+"-"+target, source:findPortNode(source), target:findPortNode(target)});
        console.log(links);
        update();
    };

    this.removeLink = function (id) {
        links.splice(findLinkIndex(id),1);
        update();
    }

    var findNode = function(id) {
        for (var i in nodes) {if (nodes[i]["id"] === id) return nodes[i]};
    }

    var findNodeGivenPort = function(id) {
        for (var i in nodes) {
            for (var j in nodes[i].ports) {
                console.log(nodes[i].ports[j]);
                if (nodes[i].ports[j]["id"] === id) return nodes[i];
            };
        }
    }

    var findPortNode = function(id) {
        for (var i in nodes) {
            for (var j in nodes[i].ports) {
                if (nodes[i].ports[j]["id"] === id) return nodes[i].ports[j];
            };
        }
    }

    var findLink = function(id) {
        for (var i in links) {if (link[i]["id"] === id) return link[i]};
    }

    var findNodeIndex = function(id) {
        for (var i in nodes) {if (nodes[i]["id"] === id) return i};
    }

    var findLinkIndex = function(id) {
        for (var i in links) {if (links[i]["id"] === id) return i};
    };

    this.getNodes = function() {
        return nodes;
    }
    
    this.setNodes = function(newNodes) {
        nodes = newNodes;
    }

    this.getNode = function(nodeId) {
        return findNode(nodeId);
    }

    this.setNode = function(node) {
        nodes[node.id] = node;
    }

    this.getLinks = function() {
        return links;
    }

    // set up the D3 visualisation in the specified element
    var w = $(el).innerWidth(),
        h = $(el).innerHeight();

    this.getWidth = function() {
        return w;
    }
    this.getHeight = function() {
        return h;
    }

    var vis = this.vis = d3.select(el)
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("pointer-events", "all") // Might need to come back to this
//        .append('g')
//        .call(d3.behavior.zoom().on("zoom", redraw))
    ;

    var containerSVG = vis.append("g")
        .attr("id", "svgContainer")
        .call(d3.behavior.zoom().on("zoom", redraw));
    
    var force = d3.layout.force()
        .linkDistance(30)
        .size([w, h]);
var zoom = d3.behavior.zoom()
    				.scaleExtent(1,10)
    				.on("zoom", zoomed);
                    
    function redraw() {
        var currentTranslateZoom = d3.event.translate;
        var currentZoom = d3.event.scale;
        console.log(currentZoom);
        console.log(currentTranslateZoom);
        console.log("Zoom");
          vis.attr("transform",
              "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
      }
    this.zoomIn = function () {
        var currentZoom = zoom.scale();
        console.log(currentZoom);
        console.log("Zoom");
        var newScale = zoom.scale() + 0.1;
        zoom.scale(newScale);
          containerSVG.attr("transform",
              "translate(" + zoom.translate() + ")" + " scale(" + newScale + ")");
      }
    this.zoomOut = function () {
        var currentZoom = zoom.scale();
        var newScale = zoom.scale() - 0.1;
        zoom.scale(newScale);
          containerSVG.attr("transform",
              "translate(" + zoom.translate() + ")" + " scale(" + newScale + ")");
      }
    function zoomed() { //handle the mousewheel zoom and mouse drag
        console.log("Zoomed");
    		var t = d3.event.translate;
    		var s = d3.event.scale;

    						 //those 2 values ajust the limits of the drag, so the map dont exit completly the visible zone.
    		var h = height / 1.3;
    		var w = width / 1.4;

    		//black magic to calculate the zoom and the limits the map can be dragged around.
    		t[0] = Math.min(width / 2 * (s - 1) + w * s, Math.max(width / 2 * (1 - s) - w * s, t[0]));
    		t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

    		//apply new zoom
    		g.attr("transform", "translate(" + t + ")scale(" + s + ")")
    			//keep the border line of element proportional to the new zoom level
    			.selectAll('path').style("stroke-width", 1 / d3.event.scale + "px");
    	}
    drag_line = containerSVG.append('svg:path')
        .attr({ 'class' : 'dragline hidden', 'd' : 'M0,0L0,0'});

    var nodes = force.nodes(),
        links = force.links();

    var node = containerSVG.append("svg:g").selectAll("g.node");
    var link = containerSVG.append("svg:g").selectAll("link.sw");
    var paths = containerSVG.append("svg:g").selectAll("paths.sw");

    var update = this.update = function () {
 console.log("Updated executed");
        link = link.data(links);

        link.enter().append("svg:line")
            .attr('id', function (d) {return d.id;})
            .attr("class", "link")
            .attr("stroke", "black")
            .on("mousedown", function(d){
                linkMouseDown(d);
            })
            .on('mouseover', function (d) {
            })
            .on('mouseup', function (d) {
                linkMouseUp(d);
            });
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes);

        var nodeEnter = this.nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("px", function (d) {return d.x;})
            .attr("py", function (d) {return d.y;})
            .on("mousedown", function(d){
                if (!ctrlKey) {
//                    startState =d, endState = undefined;
                    // reposition drag line
//                    nodeMouseDown(d);
                }
            })
            .on('mouseover', function (d) {

            })
            .on('mouseup', function (d) {
//                nodeMouseUp(d);
            })
            .call(drag);

        nodeEnter.append("image")
            .attr("xlink:href", function(d){return graphImage[d.type];})
            .attr("fixed", false)
            .attr("x", "-20px")//-8px
            .attr("y", "-20px")
            .attr("width", function(d){ return d.width;})
            .attr("height", function(d){ return d.height;});

        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", function(d){ return d.text_x})
            .attr("dy", function(d){ return d.text_y})
            .text(function(d) {return d.id});
        
        nodeEnter.on("mousedown", function(d){
            //if is a Virtual Resource
            if (!ctrlKey) {
                    console.log("Click on node "+d.name);
//                    var parentNode = graph.getNodes().filter(function (p) { return d.parent == p.id})[0];
                    var parentNode = graph.getNodes().filter(function (p) { return d.name == p.name})[0];;
console.log(parentNode);
                    startState = d, endState = undefined;
console.log(parentNode.x);
console.log(d);
console.log(d.x);
                    //startState = node;
console.log("Change X "+(parentNode.x+d.posx));
                    startState.x = (parentNode.x);
                    startState.y = (parentNode.y);
                    startState.testx = (parentNode.x);
                    startState.testy = (parentNode.y);
                    startState.transitions = [];
                    nodeMouseDown(startState);
                    console.log(startState);
                }
        });
        nodeEnter.on("mouseup", function(d){
            //if is a Virtual Resource
            if (!ctrlKey) {
            var parentNode = graph.getNodes().filter(function (p) { return d.name == p.name})[0];
            console.log(parentNode);
console.log(node);
                    endState = d;

                    //startState = node;
console.log("Change X "+(parentNode.x));
                    endState.x = (parentNode.x);
                    endState.y = (parentNode.y);
                    endState.transitions = [];
                    nodeMouseUpMapping(endState);
                }
        });
        nodeEnter.on("contextmenu", function(d, index) {
             if(contextMenuShowing) {
                d3.event.preventDefault();
                d3.select(".popup_context_menu").remove();
                contextMenuShowing = false;
            } else {
                console.log(d);
                d3_target = d3.select(d3.event.target);
                d3.event.preventDefault();
                contextMenuShowing = true;

                canvas = d3.select(el);
                mousePosition = d3.mouse(canvas.node());
                
                popup = canvas.append("div")
                    .attr("class", "popup_context_menu")
                    .style("left", mousePosition[0] + "px")
                    .style("top", mousePosition[1] + "px");
                popup.append("h4").text(d.name);
                
console.log(d);
if( window.location.hash.split("/")[1] === "spVIInfo"){
                if(d.type === "arn"){
                    popup.append("p").text("Available actions:");
                    popup.append("p").text("NetworkService:")
                            popup.append("a").text("Create ").on("mousedown", function(){/*callOperation(d.id, d.type, 0)*/;})
                            popup.append("a").text("Remove  ").on("mousedown", function(){/*callOperation(d.id, d.type, 1)*/;})
                            popup.append("a").text("List").on("mousedown", function(){/*callOperation(d.id, d.type, 2)*/;})
                    popup.append("p").text("ClientService:")
                            popup.append("a").text("Create ").on("mousedown", function(){/*callOperation(d.id, d.type, 0)*/;})
                            popup.append("a").text("Remove  ").on("mousedown", function(){/*callOperation(d.id, d.type, 1)*/;})
                            popup.append("a").text("List").on("mousedown", function(){/*callOperation(d.id, d.type, 2)*/;})
                    popup.append("p").text("Service:")
                            popup.append("a").text("Create ").on("mousedown", function(){callOperation(d.id, d.type, 0);})
                            popup.append("a").text("Remove  ").on("mousedown", function(){callOperation(d.id, d.type, 1);})
                            popup.append("a").text("List").on("mousedown", function(){/*callOperation(d.id, d.type, 2)*/;})
                } else if(d.type === "cpe"){
                    popup.append("p").text("Available actions:");
                    popup.append("p").text("VLANConnectivityService: ")
                            popup.append("a").text("Create ").on("mousedown", function(){callOperation(d.id, d.type, 0);})
                            popup.append("a").text("Remove  ").on("mousedown", function(){callOperation(d.id, d.type, 1);})
                            popup.append("a").text("List").on("mousedown", function(){/*callOperation(d.id, d.type, 2)*/;})
                    //.attr({"xlink:href": "", "ng-Click":"openOperationARNDialog()"});
                }
            }else{
                popup.append("p").text("Ports: "+d.ports.length)
            }
/*                    .append("p").append("a")
                    .attr({"xlink:href": "#"})
                    .on("mousedown", function(){
                        port_num = d.ports.length+1;
                            port = {"id": d.id+port_num, "name": "ge-0/"+port_num, x: -23, y: 12, posx: -23, posy: 12, parent: d.id};
                            graph.addPortToNode(d.id, port);
                        })
                    .text("Add port");
                */
/*                popup.append("p").append("a")
                    .attr({"xlink:href": "", "ng-Click":"openARNDialog()"})
                    .on("mousedown", function(){
                        console.log("Remove resource: "+d.id);
                        angular.element(document.getElementById('piMgt')).scope().deleteResource(d.id);
                        })
                    .text("Remove");
  */              d.ports.forEach(function(entry) {
                    popup.append("li").text("Id: "+entry.id +".");
                });
        }
        });

        var portsTest = nodeEnter.append("g")
            .attr("id", "ports").selectAll("g.ports")
            .data(function(d){ return d.ports;});
/*
        portsTest
            .enter().append("rect")
                .attr("id",function(d){ return d.id;})
                .attr("cx", function(d){ return d.posx;})
                .attr("cy", function(d){ return d.posy;})
                .attr("width", 12)
                .attr("height", 12)
            .on("mousedown", function(d){
                if (!ctrlKey) {
                    console.log("Click on port "+d.name);
                    var parentNode = graph.getNodes().filter(function (p) { return d.parent == p.id})[0];
console.log(node);
                    startState = d, endState = undefined;

                    //startState = node;
console.log("Change X "+(parentNode.x+d.posx));
                    startState.x = (parentNode.x+d.posx);
                    startState.y = (parentNode.y+d.posy);
                    startState.testx = (parentNode.x+d.posx);
                    startState.testy = (parentNode.y+d.posy);
                    startState.transitions = [];
                    nodeMouseDown(startState);
                    console.log(startState);
                }
            }).on("mouseup", function(d){
                var parentNode = graph.getNodes().filter(function (p) { return d.parent == p.id})[0];
console.log(node);
                    endState = d;

                    //startState = node;
console.log("Change X "+(parentNode.x+d.posx));
                    endState.x = (parentNode.x+d.posx);
                    endState.y = (parentNode.y+d.posy);
                    endState.transitions = [];
                    nodeMouseUp(endState);
            });
*/
        portsTest.exit().remove();
        nodeEnter.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        portsTest.attr('x', function(d) { return d.x; })
                .attr('y', function(d) { return d.y; });


        node.exit().remove();

        /****************** Multi selection - Rectangle that allows select ****************************/
            /************** Should need an activation. multiSelectMode var **************/
        var radius = 40;
        vis.on({
            mousedown: function () {
console.log("Selection enabled");
                if (d3.event.target.tagName == 'svg') {
                    drag_line
                        .classed('hidden', true)
                        .style('marker-end', '');
                    startState = undefined;
                    if (!d3.event.ctrlKey) {
                        d3.selectAll('g.selected').classed("selected", false);
                        
                        d3.select(".popup_context_menu").remove();//Close popup
                        contextMenuShowing = false;
                    }
                    if(multiSelectMode){
                        var p = d3.mouse(this);
                        vis.append("rect")
                            .attr({
                                rx: 6,
                                ry: 6,
                                class: "selection",
                                x: p[0],
                                y: p[1],
                                width: 0,
                                height: 0
                        });
                    }
                }
            },
            mousemove: function () {
                var p = d3.mouse(this),
                    s = vis.select("rect.selection");
                if (!s.empty()) {
                    var d = {
                        x: parseInt(s.attr("x"), 10),
                        y: parseInt(s.attr("y"), 10),
                        width: parseInt(s.attr("width"), 10),
                        height: parseInt(s.attr("height"), 10)
                    },
                        move = {
                            x: p[0] - d.x,
                            y: p[1] - d.y
                        };
                    if (move.x < 1 || (move.x * 2 < d.width)) {
                        d.x = p[0];
                        d.width -= move.x;
                    } else {
                        d.width = move.x;
                    }

                    if (move.y < 1 || (move.y * 2 < d.height)) {
                        d.y = p[1];
                        d.height -= move.y;
                    } else {
                        d.height = move.y;
                    }

                    s.attr(d);

                    // deselect all temporary selected state objects
                    d3.selectAll('g.node.selection.selected').classed("selected", false);
console.log("Select");
                    d3.selectAll('g.node').each(function (state_data, i) {
                        if (!d3.select(this).classed("selected") &&
                            // inner circle inside selection frame
                            state_data.x - radius >= d.x && state_data.x + radius <= d.x + d.width &&
                            state_data.y - radius >= d.y && state_data.y + radius <= d.y + d.height
                        ) {

                            d3.select(this)
                                .classed("selection", true)
                                .classed("selected", true);
                        }
                    });
                } else if (startState) {
                    // update drag line
                    drag_line.attr('d', 'M' + startState.x + ',' + startState.y + 'L' + p[0] + ',' + p[1]);

                    //                var state = d3.select( 'g.node .inner.hover');
                    var state = d3.select('g.node');

                    endState = (!state.empty() && state.data()[0]) || undefined;
                }
            },
            mouseup: function () {
console.log("Mouseup");
                // remove selection frame
                vis.selectAll("rect.selection").remove();

                // remove temporary selection marker class
                d3.selectAll('g.node.selection').classed("selection", false);
            },
            mouseout: function () {
                if (!d3.event.relatedTarget || d3.event.relatedTarget.tagName == 'HTML') {
                    // remove selection frame
                    vis.selectAll("rect.selection").remove();

                    // remove temporary selection marker class
                    d3.selectAll('g.node.selection').classed("selection", false);
                }
            }
        });

        /* END Multi selection */

        force.on("tick", function() {

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        // Restart the force layout.
        force.start();
    };

    // Make it all go
    update();
}

function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}

function updateNodes(){

}

function StaticForcealgorithm(nodes, edges){
console.log(nodes);
    var n = nodes.length;
    for(i=0; i < nodes.length; i++){ // loop through vertices
        var v = nodes[i];
        var u;
        v.net_force.x = 0;
        v.net_force.y = 0;
        for(j=0; j < n; j++){ // loop through other vertices
             if(i==j)continue;
             u = nodes[j];
             // squared distance between "u" and "v" in 2D space
             var rsq = ((v.x-u.x)*(v.x-u.x)+(v.y-u.y)*(v.y-u.y));
             // counting the repulsion between two vertices
             v.net_force.x += 200 * (v.x-u.x) /rsq;
             v.net_force.y += 100 * (v.y-u.y) /rsq;
        }
        for(j=0; j < n; j++){ // loop through edges
             //if(!edges[i][j])continue;

             u = nodes[j];
             // countin the attraction
             v.net_force.x += 0.06*(u.x - v.x);
             v.net_force.y += 0.06*(u.y - v.y);
        }
        // counting the velocity (with damping 0.85)
        v.velocity.x = (v.velocity.x + v.net_force.x)*0.85;
        v.velocity.y = (v.velocity.y + v.net_force.y)*0.85;
   }
   for(i=0; i < n; i++){ // set new positions
        v = nodes[i];
        if(v.isDragged){
            v.x = mouseX; v.y = mouseY;
        }
        else {
            v.x += v.velocity.x;
            v.y += v.velocity.y;
       }
   }
return nodes;
}


function callOperation(nodeId, resType, type){
    console.log("CALL OPERATION "+type);
    if(resType === "arn") angular.element(document.getElementById('viNetMgt')).scope().openOperationARNDialog(nodeId, type);
    else if(resType === "cpe") angular.element(document.getElementById('viNetMgt')).scope().openOperationCPEDialog(nodeId, type);
}