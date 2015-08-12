function linkMouseDown(link) {
    console.log("Click down on Link: "+link.source.id+" "+link.target.id);
}

function linkMouseUp(link) {
    console.log("Click up on Link");
}

function nodeMouseDown(node) {
    console.log("Node Mouse down "+node.id);
    // select node
    mousedown_node = node;
    if (mousedown_node === selected_node) selected_node = null;
    else selected_node = mousedown_node;
    selected_link = null;
//    $(document).on("dragstart", function () { return false; }); //disable drag in Firefox 3.0 and later
    // reposition drag line
    console.log("Drag line to pos: "+mousedown_node.x + " y: "+mousedown_node.y);
    drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y+ 'L' + mousedown_node.x + ',' + mousedown_node.y);
}

/* End create Link */
function nodeMouseUp(d) {
    var links = graph.getLinks();
    var nodes = graph.getNodes();
    if (!mousedown_node) return;

    // needed by FF
    drag_line
        .classed('hidden', true)
        .style('marker-end', '');
    
    // check for drag-to-self
    mouseup_node = d;
console.log(d);    
    if (mouseup_node === mousedown_node) {
        resetMouseVars();
        return;
    }
    // add link to graph (update if exists)
    // NB: links are strictly source < target; arrows separately specified by booleans
    var source, target;
    source = mousedown_node;
    target = mouseup_node;
    console.log("Source " + source.id + " to Dest " + target.id);
//    console.log("Source " + source.x + " Source y " + source.y);
//    console.log("Dest " + target.x + " Dest y " + target.y);
    var link = links.filter(function (l) { return (l.source === source && l.target === target); })[0];
    
    d3.selectAll('.dragline').attr('d', 'M0,0L0,0'); //Remove the requested path
    
    // select new link
    selected_link = link;
    selected_node = null;
    
    if( links.filter(function (l) { return (l.source === source && l.target === target); }).length > 0) return;
//    graph.addLink(source.id, target.id);
    graph.addLinkBetweenPorts(source.id, target.id);

}

/* End create Link */
function nodeMouseUpMapping(d) {
    var links = graph.getLinks();
    var nodes = graph.getNodes();
    if (!mousedown_node) return;

    // needed by FF
    drag_line
        .classed('hidden', true)
        .style('marker-end', '');
    
    // check for drag-to-self
    mouseup_node = d;
console.log(d);    
    if (mouseup_node === mousedown_node) {
        resetMouseVars();
        return;
    }
    // add link to graph (update if exists)
    // NB: links are strictly source < target; arrows separately specified by booleans
    var source, target;
    source = mousedown_node;
    target = mouseup_node;
    console.log("Source " + source.id + " to Dest " + target.id);
//    console.log("Source " + source.x + " Source y " + source.y);
//    console.log("Dest " + target.x + " Dest y " + target.y);
    var link = links.filter(function (l) { return (l.source === source && l.target === target); })[0];
    
    d3.selectAll('.dragline').attr('d', 'M0,0L0,0'); //Remove the requested path
    
    // select new link
    selected_link = link;
    selected_node = null;
    
    if( links.filter(function (l) { return (l.source === source && l.target === target); }).length > 0) return;
//    graph.addLink(source.id, target.id);
    graph.addLink(source.id, target.id);
    //call Controller VI in order to do the mapping
console.log("CALL CONtroller vi - maPPing");
console.log(source);
console.log(target);
    try{
        angular.element(document.getElementById('viMgt')).scope().openMappingDialog(source.id, target.id);
    } catch(err){console.log("Error1 "+err);}
        angular.element(document.getElementById('piMgt')).scope().createLinkDialog(source.id, target.id);
    }