'use strict';

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

function customDataNode(data) {

    /**Capabilities**/

    var arrayLengthCapabilities = data.fog_capabilities.length;
    var current_capabilities = {};
    for (var i = 0; i < arrayLengthCapabilities; i++) {
        var cap = data.fog_capabilities[i];

        if (cap.type == "network") {
            current_capabilities.network = true;
        } else if (cap.type == "videocamera") {
            current_capabilities.videocamera = true;
        } else if (cap.type == "temperature") {
            current_capabilities.temperature = true;
        } else if (cap.type == "humidity") {
            current_capabilities.humidity = true;
        } else if (cap.type == "door") {
            current_capabilities.door = true;
        } else if (cap.type == "energy") {
            current_capabilities.energy = true;

        } else if (cap.type == "noise") {
            current_capabilities.noise = true;

        }

        //Do something
    }

    data.current_capabilities = current_capabilities;

    return data;


}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

Date.prototype.minusHours = function (h) {
    this.setHours(this.getHours() - h);
    return this;
}

Date.prototype.addMinutes = function (m) {
    this.setMinutes(this.getMinutes() + m);
    return this;
}

Date.prototype.minusMinutes = function (m) {
    this.setMinutes(this.getMinutes() - m);
    return this;
}


Date.prototype.addSeconds = function (s) {
    this.setSeconds(this.getSeconds() + s);
    return this;
}

Date.prototype.minusSeconds = function (s) {
    this.setSeconds(this.getSeconds() - s);
    return this;
}

function containsObject(obj, list, key) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][key] == obj[key]) {
            return true;
        }
    }
    return false;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/*
 * Check if is array. If not, convert to array. 
 * Only used when is required an array and with one element is not recognized as an arrray.
 * @param {type} possibleArray
 * @returns {Array}
 */
function checkIfIsArray(possibleArray) {
    if (possibleArray == undefined) return [];
    if (possibleArray instanceof Array) {
        return possibleArray;
    } else {
        return [possibleArray];
    }
}

function generateUrl(action1, resource, action2) {
    var url;
    url = action1 + "/" + resource + "/" + action2;
    return url;
}

function transpose(items) {
    var results = {
        headers: [],
        values: []
    };
    angular.forEach(items, function (value, key) {
        results.headers.push(key);
        angular.forEach(value, function (inner, index) {
            results.values[index] = results.values[index] || [];
            results.values[index].push(inner);
        });
    });
    return results;
}
