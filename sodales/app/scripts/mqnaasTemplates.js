getResource = function (resourceType, endpoint) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>' + resourceType + '</type><model>Internal</model><version>1.0</version></specification><endpoints><endpoint><uri>' + endpoint + '</uri></endpoint></endpoints></ns2:rootResourceDescriptor>';
};

getNETWORK = function () {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>NETWORK</type><model>Internal</model><version>1.0</version></specification></ns2:rootResourceDescriptor>';
};

getPeriod = function (start, end) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:period xmlns:ns2="org.mqnaas"><startDate>' + start + '</startDate><endDate>' + end + '</endDate></ns2:period>';
};

getCube = function (lowRange1, uppRange1, lowRange2, uppRange2) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:cubesList xmlns:ns2="org.mqnaas"><cubes><cube><ranges><range><lowerBound>' + lowRange1 + '</lowerBound><upperBound>' + uppRange1 + '</upperBound></range><range><lowerBound>' + lowRange2 + '</lowerBound><upperBound>' + uppRange2 + '</upperBound></range></ranges></cube></cubes></ns2:cubesList>';
};

getCube2 = function (lowRange1, uppRange1, lowRange2, uppRange2) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:cubesList xmlns:ns2="org.mqnaas"><cubes><cube><ranges><range><lowerBound>' + lowRange1 + '</lowerBound><upperBound>' + uppRange1 + '</upperBound></range></ranges></cube><cube><range><lowerBound>' + lowRange2 + '</lowerBound><upperBound>' + uppRange2 + '</upperBound></range></cube></cubes></ns2:cubesList>';
};

getCube3 = function (lowRange1, uppRange1) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:cubesList xmlns:ns2="org.mqnaas"><cubes><cube><ranges><range><lowerBound>' + lowRange1 + '</lowerBound><upperBound>' + uppRange1 + '</upperBound></range></ranges></cube></cubes></ns2:cubesList>';
};

getCubeVirtual = function (lowRange1, uppRange1) {
    return '<cube><ranges><range><lowerBound>' + lowRange1 + '</lowerBound><upperBound>' + uppRange1 + '</upperBound></range></ranges></cube>';
};

getRange = function (lowerBound, upperBound) {
    return '<range><lowerBound>' + lowerBound + '</lowerBound><upperBound>' + upperBound + '</upperBound></range>';
};

getRanges = function (ranges) {
    return '<ranges>' + ranges + '</ranges>';
};

getRangeUnit = function (lowerBound, upperBound) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:range xmlns:ns2="org.mqnaas"><lowerBound>' + lowerBound + '</lowerBound><upperBound>' + upperBound + '</upperBound></ns2:range>';
};

getCube = function (ranges) {
    return '<cube>' + ranges + '</cube>';
};

getCubes = function (cubes) {
    /*if (cubes instanceof Array) {
        cubes.forEach(function (c) {
            var cubes = "<cubes>" + c + "</cubes>";

        })
    }*/
    var cub = "";
    if (cubes instanceof Array) {
        cubes.forEach(function (c) {
            cub = cub + c;
        });
    } else {
        cub = cubes;
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:cubesList xmlns:ns2="org.mqnaas"><cubes>' + cub + '</cubes></ns2:cubesList>';
};

getARNVlanConnectivity = function (upLinkIfaces1, upLinkIfaces2, downLinkIfaces1, downLinkIfaces2, upLinkVlan, downLinkVlan) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vlanConnectivityRequest xmlns="net.i2cat.dana.ptin_olt.capabilities.vlanconnectivity"><equipmentId>0</equipmentId><upLinkIfaces>16842752</upLinkIfaces><upLinkIfaces>83951616</upLinkIfaces><downLinkIfaces>50397184</downLinkIfaces><downLinkIfaces>67174400</downLinkIfaces><upLinkVlan>100</upLinkVlan><downLinkVlan>200</downLinkVlan></vlanConnectivityRequest>';
};

getCPEVlanConnectivity = function (egressPortId, egressVlan, ingressPortId, ingressVlan, unitId) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vlanConnectivityRequest xmlns="net.i2cat.enet.capabilities.vlanconnectivity"><egressPortId>104</egressPortId><egressVlan>300</egressVlan><ingressPortId>105</ingressPortId><ingressVlan>200</ingressVlan><unitId>0</unitId></vlanConnectivityRequest>';
};
