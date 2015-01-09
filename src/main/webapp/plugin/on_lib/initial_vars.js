var plugin_path = "../plugin/";

var info_message, error_message;
var graph,
    selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null,
    ctrlKey = false;//ctrl key is pressed?;

//Node images. The key option of the map is the node type defined in each model of data
var graphImage = {};

graphImage["ofSwitch"] =        plugin_path+"img/ofSwitch.png";
graphImage["router"] =        plugin_path+"img/router.png";
graphImage["ofController"] =    plugin_path+"img/ofController.png";
graphImage["laptop"] =    plugin_path+"img/laptop.png";
graphImage["arn"] =    plugin_path+"img/SODALES_ARN.png";
graphImage["cpe"] =    plugin_path+"img/SODALES_CPE.png";

var genericImages = {};
genericImages["helpImage"] = plugin_path+"img/helpImage.png";

//Editor options
var multiSelectMode = false, 
    contextMenuShowing = false;

d3.select(window)
    .on('keydown', keydown)
    .on('keyup', keyup);

