/* OpenNaaS D3.js API
More generic functions
this script handle the topology information.

maintain the topolgy definition (json), allows to add, get or remove elements.

*/

/*
addJSFile('templates.js');
*/

/******* D3 JS Functions *******/
function keyup() {
  ctrlKey = false;
}

function keydown() {
  ctrlKey = d3.event.ctrlKey || d3.event.metaKey;
}

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

/***** Javascriot management  **/
/*
* Add a new Javascript file in the html
*/
function addJSFile(jsFileName){
    var x = document.createElement('script');
    x.src = jsFileName;
    document.getElementsByTagName("head")[0].appendChild(x);
}

function addJavascript(jsname, pos) {
    var th = document.getElementsByTagName(pos)[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);
}


/**
 * XML/Json management
 */
function convertXml2JSon(xml) {
    var x2js = new X2JS();
    return JSON.stringify(x2js.xml_str2json(xml));
}

function convertXml2JSonString(xml) {
    var x2js = new X2JS();
    return JSON.stringify(x2js.xml_str2json(xml));
}

function convertXml2JSonObject(xml) {
    var x2js = new X2JS();
    var json = JSON.stringify(x2js.xml_str2json(xml));
    return eval("(" + json + ")");
}

/**
 * Move element of array from src to dst.
 * @param {type} arr
 * @param {type} fromIndex
 * @param {type} toIndex
 * @returns {Array|arraymove.arr}
 */
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}



/******* Network functions ******/
function ip2long(ip){
    var components;
    var regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if(components = ip.match(regex)){
        var iplong = 0;
        var power  = 1;
        for(var i=4; i>=1; i-=1){
            iplong += power * parseInt(components[i]);
            power  *= 256;
        }
        return iplong;
    }
    else return -1;
}

function inSubNet(ip, subnet){
    var mask, base_ip, long_ip = ip2long(ip);
    var regex = /^(.*?)\/(\d{1,2})$/;
    if( (mask = subnet.match(regex)) && ((base_ip=ip2long(mask[1])) >= 0) ){
        var freedom = Math.pow(2, 32 - parseInt(mask[2]));
        return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
    }
    else return false;
}

function ValidateIPaddress(ipaddress){
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(ipaddress.match(ipformat)){
        return true;
    }
    return false;
}

