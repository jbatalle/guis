/* Network Element Model
* Other network elements are based on this.
*/

addJSFile('../plugin/models/ports.js');
addJSFile('../plugin/models/OfSwitch.js');
addJSFile('../plugin/models/Router.js');
addJSFile('../plugin/models/arn.js');
addJSFile('../plugin/models/cpe.js');

function NetworkElement(name, data, ports) {
    this.name = name;
    this.type;
    this.data = data;
    this.ports = ports;//[]
    this.x;
    this.y;
    this.posx;
    this.posy;
}

NetworkElement.prototype = {
    getName: function(){
        return this.name;
    },
    getType: function(){
        return this.type;
    },
    getData: function(){
        return this.data;
    },
    setX: function(x){
        this.x = x;
    },
    setY: function(y){
        this.y = y;
    },
    setPorts: function(ports, parentId){
       ports = definePortPositions(ports, parentId);
	   this.ports = ports;
    },
    getPorts: function(){
	   return this.ports;
    },
    addPort: function(port){
        this.ports.push(port);
    }
};


function definePortPositions(ports, parentId){
    console.log("define port positions");
    if( ports.length === 1){
        ports[0].id = ports[0]._id;
        ports[0].name = "ge-"+0+"/1";
        ports[0].x = 45;
        ports[0].y = 12;
        ports[0].posx = 45;
        ports[0].posy = 12;
        ports[0].parent = parentId;
    }
    if( ports.length > 1){
        for(var i= 0; i<ports.length; i++){
        //{"id": this.id+"1", "name": "ge-0/1", x: -23, y: 12, posx: -23, posy: 12, parent: this.id},
            ports[i].id = ports[i]._id;
            ports[i].name = "ge-"+i+"/1";
            ports[i].parent = parentId;
        }
        if( ports.length == 2){
                ports[0].posx = -23;
                ports[0].posy = 12;
            }else if( ports.length == 3){
                ports[0].posx = -23;
                ports[0].posy = 12;
                ports[1].posx = 45;
                ports[1].posy = 12;
                ports[2].posx = 11;
                ports[2].posy = 27;
            }else if( ports.length == 4){
                ports[0].posx = -23;
                ports[0].posy = 12;
                ports[1].posx = 45;
                ports[1].posy = 12;
                ports[2].posx = 11;
                ports[2].posy = 27;
                ports[3].posx = 11;
                ports[3].posy = -10;
            }
    }
return ports;

}

