/* Router Model
 * Specific parameters: name, ports, ip
 */

function Router(name) {
    this.id = name;
    this.name = name;
    this.data = {};
    this.ip;
    this.type = "router";
    this.width = "60px";
    this.height = "60px";
    this.text_x = 0;
    this.text_y = 40;
    this.ports = [{"id": this.id+"1", "name": "ge-0/1", x: -23, y: 0, posx: -23, posy: 0, parent: this.id},
                  {"id": this.id+"2", "name": "ge-0/2", x: -23, y: 20, posx: -23, posy: 20, parent: this.id},
                  {"id": this.id+"3", "name": "ge-0/3", x: 45, y: 0, posx: 45, posy: 0, parent: this.id},
	             {"id": this.id+"4", "name": "ge-0/4", x: 45, y: 20, posx: 45, posy: 20, parent: this.id}];

    NetworkElement.call(this, name, this.data, this.ports);
}

Router.prototype = {
    getPorts: function(){
        return this.ports;
    },
    setPorts: function(ports){
	   this.ports = ports;
    }
};