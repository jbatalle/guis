getCards = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="card"><card equipmentId="0" _id="0"/></operation></request>';
};

getCardInterfaces = function (cardId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="all"><interface equipmentId="0" cardId="' + cardId + '"/></operation></request>';
};

getLAGsInService = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="2" type="showStatus" entity="lag/macLimiting"><lag equipmentId="0" cardId="0"/></operation></request>';
};

getInterface = function (interfaceId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showStatus" entity="interface"><interfaceXsfp equipmentId="0" interfaceId="' + interfaceId + '"/></operation></request>';
};

//operations
createLAG = function (cardId, interfaceId, lagIfIndex, ethIfIndex, description) {
    return '<?xml version="1.0" encoding="UTF-8"?>\
	<request>\
		<operation token="1" type="create" entity="interface/lag"><lag equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '" loadBalanceMode="1"/></operation>\
		<operation token="2" type="config" entity="interface"><interface equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '" description="' + description + '"></interface></operation>\
		<operation token="1" type="attach" entity="interface/lag"><lag equipmentId="0"><attach><lagMemberPort lagIfIndex="' + lagIfIndex + '" ethIfIndex="' + ethIfIndex + '" lacpTimeout="1"/></attach></lag></operation></request>';
};

changeStatusLAG = function (interfaceId, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="200222" type="config" entity="interface"><interface equipmentId="0" interfaceId="' + interfaceId + '" admin="' + admin + '"></interface></operation></request>';
};

createNetworkService = function (admin, name, type, uplinkVlanId, uniVlanId) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="create" entity="networkService"><networkService equipmentId="0" admin="' + admin + '" name="' + name + '" type="' + type + '" uplinkVlanId="' + uplinkVlanId + '" uniVlanId="' + uniVlanId + '"></networkService></operation></request>';
};

addPortsToNetworkService = function (id, cardId, interfaceId, role) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="attach" entity="networkService"><networkService equipmentId="0" id="' + id + '"><attach><interface cardId="' + cardId + '" interfaceId="' + interfaceId + '" role="' + role + '" /></attach></networkService></operation> < /request>';
};

changeStatusNetworkService = function (id, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="networkService"><networkService equipmentId="0" id="' + id + '" admin="' + admin + '"></networkService></operation></request>';
};

createClientService = function (networkServiceId, admin, name, uniVlan) {
    return '<?xml version="1.0" encoding="utf-8"?><request>\
        <operation type="create" entity="clientService"><clientService equipmentId="0"><create><clientService networkServiceId="' + networkServiceId + '" admin="' + admin + '" name="' + name + '" uniVlan="' + uniVlan + '" ></clientService></create</clientService></operation></request>';
};

changeStatusClientService = function (id, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="clientService"><clientService equipmentId="0" id="' + id + '" admin="' + admin + '"></clientService></operation></request>';
};

//remove
removeNetworkService = function (interfaceId) {
    return '';
};

getNetworkServices = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="networkService"><networkService equipmentId="0"/></operation></request>';
};

getClientServices = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="clientService"><clientService equipmentId="0"/></operation></request>';
};