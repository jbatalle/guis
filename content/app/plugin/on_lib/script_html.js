var stencil_image_width = 60; //px

$(function () {
    /* Information message */
    $(".ui-widget").hide();
    /* END Information message */

    /* Stencil - Images draggables to d3js */
    $(".netEl-drag").draggable({
        helper: "clone"
    }); //Network elements draggable
    $("#graph").droppable({
        drop: function (event, ui) {
            x = ui.helper.clone();
            ui.helper.remove();
            x.draggable({
                helper: 'original',
                cursor: 'move',
                //containment: '#droppable',
                tolerance: 'fit',
                drop: function (event, ui) {
                    $(ui.draggable).remove();
                }
            });
            var nodeType = ui.draggable.attr("id"), //select the id of the element
                divPos = {},
                $div = $("#graph"),
                e = window.event;

            divPos = { //position where the element is dropped
                x: e.pageX - $div.offset().left,
                y: e.pageY - $div.offset().top
            };

            createElement(nodeType, divPos);

            //$("#"+nodeType").remove();
        }
    });
    /* END Stencil - Images draggables to d3js */
});

function createElement(name, type, divPos, data) {
    switch (type) {
        case "ofSwitch":
        case "ofswitch":
            if (jQuery.isEmptyObject(data))
                createofSwitch(divPos);
            else
                createofSwitchwithData(divPos, data);
            //showInfoMessage("Element added");
            break;
        case "router":
            createRouter(divPos);
            showInfoMessage("Element added");
            break;
        case "ofController":
            createofController(divPos);
            break;
        case "host":
            createHost(divPos);
            break;
        case "arn":
            //            if (jQuery.isEmptyObject(data))
            createARN(name, divPos);
            //            else
            //                createARN(divPos, data);
            //showInfoMessage("Element added");
            break;
        case "cpe":
            createCPE(name, divPos);
            //            showInfoMessage("Element added");
            break;
        case "tson":
            if (jQuery.isEmptyObject(data))
                createTSON(name, divPos);
            else
                createTSONwithData(name, divPos, data);
            break;
        case "wifi":
            if (jQuery.isEmptyObject(data))
                createWIFI(name, divPos);
            else
                createWIFIwithData(name, divPos, data);
            break;
        case "wnode":
            if (jQuery.isEmptyObject(data))
                createWIFI(name, divPos);
            else
                createWIFIwithData(name, divPos, data);
            break;
        case "epc":
            if (jQuery.isEmptyObject(data))
                createEPC(name, divPos);
            else
                createEPCwithData(name, divPos, data);
            break;
        case "lte":
            if (jQuery.isEmptyObject(data))
                createLTE(name, divPos);
            else
                createLTEwithData(name, divPos, data);
            break;
        default:
            //            console.log("Element not defined");
            return;
    }
}

function createEPC(name, divPos) {
    EPC.prototype = new NetworkElement();
    EPC.prototype.constructor = EPC;
    var tson = new EPC(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    graph.addNodewithData(tson);
}

function createEPCwithData(name, divPos, data) {
    EPC.prototype = new NetworkElement();
    EPC.prototype.constructor = EPC;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new EPC(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    tson.setPorts(data.ports, tson.id);
    graph.addNodewithData(tson);
}

function createLTE(name, divPos) {
    LTE.prototype = new NetworkElement();
    LTE.prototype.constructor = LTE;
    var tson = new LTE(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    graph.addNodewithData(tson);
}

function createLTEwithData(name, divPos, data) {
    LTE.prototype = new NetworkElement();
    LTE.prototype.constructor = LTE;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new LTE(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    tson.setPorts(data.ports, tson.id);
    graph.addNodewithData(tson);
}

function createWIFI(name, divPos) {
    WIFI.prototype = new NetworkElement();
    WIFI.prototype.constructor = WIFI;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new WIFI(name);
    //console.log(tson instanceof NetworkElement);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    graph.addNodewithData(tson);
}

function createWIFIwithData(name, divPos, data) {
    WIFI.prototype = new NetworkElement();
    WIFI.prototype.constructor = WIFI;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new WIFI(name);
    //console.log(tson instanceof NetworkElement);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    tson.setPorts(data.ports, tson.id);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    graph.addNodewithData(tson);
}

function createTSON(name, divPos) {
    TSON.prototype = new NetworkElement();
    TSON.prototype.constructor = TSON;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new TSON(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    graph.addNodewithData(tson);
}

function createTSONwithData(name, divPos, data) {
    TSON.prototype = new NetworkElement();
    TSON.prototype.constructor = TSON;
    //    var name = "cpe" + graph.getNodes().length;
    var tson = new TSON(name);
    tson.id = name;
    tson.setX(divPos.x);
    tson.setY(divPos.y);
    tson.setPorts(data.ports, tson.id);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    graph.addNodewithData(tson);
}

function createofSwitch(divPos) {
    OfSwitch.prototype = new NetworkElement();
    OfSwitch.prototype.constructor = OfSwitch;
    //    var name = "ofSw" + graph.getNodes().length;
    var ofSw = new OfSwitch(name);
    ofSw.id = name;
    ofSw.setX(divPos.x);
    ofSw.setY(divPos.y);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    graph.addNodewithData(ofSw);
}

function createofSwitchwithData(divPos, data) {
    console.log("Creating Switch with data");
    OfSwitch.prototype = new NetworkElement();
    OfSwitch.prototype.constructor = OfSwitch;
    var name = data.id;
    var ofSw = new OfSwitch(name);
    ofSw.id = data.id;
    ofSw.setX(divPos.x);
    ofSw.setY(divPos.y);
    ofSw.setPorts(data.ports, ofSw.id);
    graph.addNodewithData(ofSw);
}

function createRouter(divPos) {
    Router.prototype = new NetworkElement();
    Router.prototype.constructor = Router;
    var name = "ofSw" + graph.getNodes().length;
    var router = new Router(name);
    router.id = name;
    router.setX(divPos.x);
    router.setY(divPos.y);
    graph.addNodewithData(router);
}

function showInfoMessage(message) {
    document.getElementById("info_message_text").innerHTML = message;
    $("#info_message").show();
    setInterval(function () {
        $("#info_message").hide();
    }, 3000);
}

function showErrorMessage(message) {
    document.getElementById("error_message_text").innerHTML = message;
    $("#error_message").show();
    setInterval(function () {
        $("#error_message").hide();
    }, 3000);
}

function createLaptop() {
    showErrorMessage("Element not defined");
}

function createStencil() {
    var stencilDiv = document.getElementById("stencil");
    for (key in graphImage) {
        el = generateHtmlDivElement(key);
        stencilDiv.appendChild(el);
    }
    /*	el = generateHtmlDivElement("ofSwitch");
    	stencilDiv.appendChild(el);
        el = generateHtmlDivElement("laptop");
    	stencilDiv.appendChild(el);
    */
}

function generateHtmlDivElement(type) {
    var imgEl = document.createElement("img");
    imgEl.src = graphImage[type];
    imgEl.width = stencil_image_width;
    imgEl.draggable = "true";
    var el = document.createElement("div");
    el.id = type;
    el.className = "ui-widget-content netEl-drag";
    el.appendChild(imgEl);
    return el;
}
