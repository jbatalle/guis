var drag = d3.behavior.drag()
    .on("drag", function (d, i) {

        var link = graph.vis.selectAll("line.link")
                    .data(graph.getLinks());
        
        if(multiSelectMode){
console.log("drag");
            if (startState) {
                //return;
            }

            var selection = d3.selectAll('.selected');

            // if dragged state is not in current selection
            // mark it selected and deselect all others
            if (selection[0].indexOf(this) == -1) {
                selection.classed("selected", false);
                selection = d3.select(this);
                selection.classed("selected", true);
            }
            // move states
            selection.attr("transform", function (d, i) {
                

                //                console.log(link.filter(function(l) { return l.source === this; }));
                link.filter(function (l) { return l.source === d;}).attr("x1", d.x).attr("y1", d.y);
                link.filter(function (l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);

                d.x += d3.event.dx;
                d.y += d3.event.dy;
                if (d.x < 0) {
                    d.x = 20;
                }
                if (d.y < 0) {
                    d.y = 20;
                }
                if (d.x > graph.getWidth()) {
                    d.x = graph.getWidth();
                }
                if (d.y > graph.getHeight()) {
                    d.y = graph.getHeight();
                }
                return "translate(" + [d.x, d.y] + ")";
            });
            // move transistion points of each transition where transition target is also in selection
            var selectedStates = d3.selectAll('g.node.selected').data();
            var affectedTransitions = selectedStates.reduce(function (array, state) {
                return array.concat(state.transitions);
            }, [])
                .filter(function (transition) {
                    return selectedStates.indexOf(transition.target) != -1;
                });
            affectedTransitions.forEach(function (transition) {
                for (var i = transition.points.length - 1; i >= 0; i--) {
                    var point = transition.points[i];
                    point.x += d3.event.dx;
                    point.y += d3.event.dy;
                    console.log(point);
                }
            });

            // reappend dragged element as last so that its stays on top 
            selection.each(function () {
                this.parentNode.appendChild(this);
            });


            d3.event.sourceEvent.stopPropagation();
        } else{

            if(ctrlKey){
                var selection = d3.selectAll('.selected');

                // if dragged state is not in current selection
                // mark it selected and deselect all others
                if (selection[0].indexOf(this) == -1) {
                    selection.classed("selected", false);
                    selection = d3.select(this);
                    selection.classed("selected", true);
                }
                // move states
                selection.attr("transform", function (d, i) {
                    d.px += d3.event.dx; d.py += d3.event.dy;
                    d.x = d3.event.x, d.y = d3.event.y;
                    if (d.x < 0) {
                        d.x = 20;
                    }
                    if (d.y < 0) {
                        d.y = 20;
                    }
                    if (d.x > graph.getWidth()) {
                        d.x = graph.getWidth();
                    }
                    if (d.y > graph.getHeight()) {
                        d.y = graph.getHeight();
                    }
console.log("Dragging Node - Look Ports");
                    console.log(d);

                    d.ports[0].x = d.ports[0].posx + d.x;
                    d.ports[0].y =  d.ports[0].posy + d.y;
                    d.ports[1].x =  d.ports[1].posx + d.x;
                    d.ports[1].y =  d.ports[1].posy + d.y;
                    for(var i=0; i<d.ports.length; i++){
//                        console.log(d.ports[i]);
                        transform(d.ports[i]);
console.log(link);
//                        link.filter(function (l) { return l.source === d.ports[i];}).attr("x1", d.ports[i].x).attr("y1", d.ports[i].y);  
//                        link.filter(function (l) { return l.target === d.ports[i]; }).attr("x2", d.ports[i].x).attr("y2", d.ports[i].y);
                    }
                    link.filter(function (l) { return l.source === d;}).attr("x1", d.x).attr("y1", d.y);
                    link.filter(function (l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
                    return "translate(" + [d.x, d.y] + ")";
                });
            }
        }
    })
    .on("dragend", function (d) {
        console.log("Dragend..........");
        //updateNode();
        // TODO : http://stackoverflow.com/questions/14667401/click-event-not-firing-after-drag-sometimes-in-d3-js

        // needed by FF
        /*    drag_line
        .classed('hidden', true)
        .style('marker-end', '')
    ;
*/

        if (startState && endState) {
            startState.transitions.push({
                label: "transition label 1",
                points: [],
                target: endState
            });
            //graph.update();
        }

        startState = undefined;
        d3.event.sourceEvent.stopPropagation();
    });


/*
 * Change selection mode
 */
function changeSelectMode() {
    if( multiSelectMode == true ) multiSelectMode = false;
    else  multiSelectMode = true;
    
    document.getElementById("selectModeButton").value="Multiselect: "+multiSelectMode;
}