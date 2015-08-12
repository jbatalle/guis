var stencil_image_width = 60;//px

$(function () {
    /* Information message */
    $(".ui-widget").hide();
    console.log("SCRIPT");
    /* END Information message */

    /* Stencil - Images draggables to d3js */
    $(".netEl-drag").draggable({
        helper: "clone"
    }); //Network elements draggable
    $("#graph").droppable({
        drop: function (event, ui) {
            console.log("Create");
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
            console.log("Create");
            var nodeType = ui.draggable.attr("id"), //select the id of the element
                    divPos = {},
                    $div = $("#graph"),
                    e = window.event;

            divPos = {//position where the element is dropped
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
    console.log("Create element " + type + " " + divPos);
    switch (type) {
        case "ofSwitch":
            if (jQuery.isEmptyObject(data))
                createofSwitch(divPos);
            else
                createofSwitchwithData(divPos, data);
            showInfoMessage("Element added");
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
        case "laptop":
            console.log("Element not defined yet");
            createLaptop(divPos);
            break;
        case "arn":
        case "varn":
            if (jQuery.isEmptyObject(data))
                createARN(name, divPos);
            else
                createARN(name, divPos, data);
            //showInfoMessage("Element added");
            break;
        case "cpe":
        case "vcpe":
            if (jQuery.isEmptyObject(data))
                createCPE(name, divPos);
            else
                createCPE(name, divPos, data);
            break;
        default:
            console.log("Element not defined");
            return;
    }

}

function createARN(name, divPos, data) {
    console.log(data);
    ARN.prototype = new NetworkElement();
    ARN.prototype.constructor = ARN;
//    var name = "arn" + graph.getNodes().length;
    var arn = new ARN(name);
    console.log(arn);
    console.log(arn.getPorts());
    arn.id = name;
    arn.setX(divPos.x);
    arn.setY(divPos.y);
     if (!jQuery.isEmptyObject(data)) arn.setPorts(data.ports, arn.id);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    console.log(arn);
    graph.addNodewithData(arn);
}

function createCPE(name, divPos, data) {
    console.log(data);
    CPE.prototype = new NetworkElement();
    CPE.prototype.constructor = CPE;
//    var name = "cpe" + graph.getNodes().length;
    var cpe = new CPE(name);
    console.log(cpe);
    console.log(cpe instanceof NetworkElement);
    console.log(cpe.getPorts());
    cpe.id = name;
    cpe.setX(divPos.x);
    cpe.setY(divPos.y);
    if (!jQuery.isEmptyObject(data)) cpe.setPorts(data.ports, cpe.id);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    console.log(cpe);
    graph.addNodewithData(cpe);
}

function createofSwitch(divPos) {
    OfSwitch.prototype = new NetworkElement();
    OfSwitch.prototype.constructor = OfSwitch;
    var name = "ofSw" + graph.getNodes().length;
    var ofSw = new OfSwitch(name);
    console.log(ofSw);
    console.log(ofSw instanceof NetworkElement);
    console.log(ofSw.getPorts());
    ofSw.id = name;
    ofSw.setX(divPos.x);
    ofSw.setY(divPos.y);
    //var ports = [{"id": ofSw.id+"1", "name": "ge-0/1", x: (ofSw.x-23), y: (ofSw.x+12), posx: -23, posy: 12, parent: ofSw.id},
    //          {"id": ofSw.id+"2", "name": "ge-2/1", x: (ofSw.x+45), y: (ofSw.y+12), posx: 45, posy: 12, parent: ofSw.id}];
    //ofSw.setPorts(ports);
    console.log(ofSw);
    graph.addNodewithData(ofSw);
}
function createofSwitchwithData(divPos, data) {
    OfSwitch.prototype = new NetworkElement();
    OfSwitch.prototype.constructor = OfSwitch;
    var name = data.id;
    var ofSw = new OfSwitch(name);
    console.log(ofSw);
    console.log(ofSw instanceof NetworkElement);
    console.log(ofSw.getPorts());
    ofSw.id = data.id;
    ofSw.setX(divPos.x);
    ofSw.setY(divPos.y);
    ofSw.setPorts(data.ports, ofSw.id);
    console.log(ofSw);
    graph.addNodewithData(ofSw);
}

function createRouter(divPos) {
    Router.prototype = new NetworkElement();
    Router.prototype.constructor = Router;
    var name = "ofSw" + graph.getNodes().length;
    var router = new Router(name);
    console.log(router);
    console.log(router instanceof NetworkElement);
    console.log(router.getPorts());
    router.id = name;
    router.setX(divPos.x);
    router.setY(divPos.y);
    console.log(router);
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
    console.log(graphImage);
    var stencilDiv = document.getElementById("stencil");
    for (key in graphImage) {
        console.log(key);
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

