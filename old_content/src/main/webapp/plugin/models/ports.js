


function ports2() {
    return [{id: "0", name: "p0"}, {id: "1", name: "p1"}];
}

function ports2(numPorts, parentElement){
    var ports = new Object();
    for(i=0; i<numPorts; i++){
        var port = {};
        port.id = parentElement.id + i;
        port.name = "p"+port.id;
        ports.push(port);
    }
    console.log(ports);
    return ports;
}
