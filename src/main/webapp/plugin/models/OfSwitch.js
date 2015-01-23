/* OpenFlow Switch Model
 * Specific parameters: name, dpid, ports
 */

function OfSwitch(dpid) {
    this.id = dpid;
    this.data = {"dpid": dpid};
    this.type = "ofSwitch";
    this.width = "60px";
    this.height = "60px";
    this.text_x = 0;
    this.text_y = 40;
    this.ports = [{"id": this.id+"1", "name": "ge-0/1", x: -23, y: 12, posx: -23, posy: 12, parent: this.id},
	             {"id": this.id+"2", "name": "ge-1/1", x: 45, y: 12, posx: 45, posy: 12, parent: this.id}];

    NetworkElement.call(this, dpid, this.data, this.ports);
}

OfSwitch.prototype = {
    getPorts: function(){
        return this.ports;
    },
    setPorts: function(ports){
	   this.ports = ports;
    }
};