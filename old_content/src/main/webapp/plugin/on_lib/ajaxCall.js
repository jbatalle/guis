//Ajax call to OpenNaaS

function getTopology(){
    $.ajax({
        type: 'GET',
        url : "ajax/"+url,
        async: false,
        success : function (data) {
            $("#"+return_to_id).html(data);
            result = data;
        }
    });
}

function getCircuit(){
       
}
/**
 * method_type -> GET/POST/PUT
 * element_type -> id/class
 */
function requestDataToElement(method_type, url, element_type, return_to_id){
    $.ajax({
        type: method_type,
        url : "ajax/"+url,
        async: false,
        success : function (data) {
            if( element_type == "id" )
                $("#"+return_to_id).html(data);
            else if( element_type == "class" )
                $("."+return_to_id).html(data);
            result = data;
        }
    });
}

function requestData(method_type, url){
    var result;
    $.ajax({
        type: method_type,
        url : "ajax/"+url,
        async: false,
        success : function (data) {
            result = data;
        }
    });
    return result;
}


function sendPostData(url, data, return_to_id){
    $.ajax({
        type: 'POST',
        url : "ajax/deleteRoute/"+id+"?type="+getURLParameter("type"),
        data: data,
        async: false,
        success : function (data) {
            $("#"+return_to_id).html(data);
            result = data;
        }
    });
}