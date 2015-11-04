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

activateLAG = function (interfaceId) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="200222" type="config" entity="interface"><interface equipmentId="0" interfaceId="8781826" admin="1"></interface></operation></request>';
};

createNetworkService = function (id, admin, name, uplinkVlanId, uniVlanId) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="create" entity="networkService"><networkService equipmentId="0" id="' + id + '" admin="' + admin + '" name="' + name + '" type="0" uplinkVlanId="' + uplinkVlanId + '" uniVlanId="' + uniVlanId + '"></networkService></operation></request>';
};

addPortsToNetworkService = function (id, cardId, interfaceId, role) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="attach" entity="networkService"><networkService equipmentId="0" id="' + id + '"><attach><interface cardId="' + cardId + '" interfaceId="' + interfaceId + '" role="' + role + '" /></attach></networkService></operation> < /request>';
};

activateNetworkService = function (interfaceId) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="networkService"><networkService equipmentId="0" id="' + id + '" admin="' + admin + '"></networkService></operation></request>';
};

createClientService = function (networkServiceId, admin, name, uniVlan) {
    return '<?xml version="1.0" encoding="utf-8"?><request>\
        <operation type="create" entity="clientService"><clientService equipmentId="0"><create><clientService networkServiceId="' + networkServiceId + '" admin="' + admin + '" name="' + name + '" uniVlan="' + uniVlan + '" ></clientService></create</clientService></operation></request>';
};

activateClientService = function (id, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="clientService"><clientService equipmentId="0" id="' + id + '" admin="' + admin + '"></clientService></operation></request>';
};

//remove
removeNetworkService = function (interfaceId) {
    return '';
};
