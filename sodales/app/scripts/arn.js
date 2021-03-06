getCards = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="card"><card equipmentId="0" _id="0"/></operation></request>';
};

getCard = function (cardId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showStatus" entity="card"><card equipmentId="0" _id="2" cardId="' + cardId + '"/></operation></request>';
};

getEquipment = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request ><operation token="58" type="show" entity="equipment"><equipment id="0"></equipment></operation></request>';
}

getAllInterfaces = function () {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="show" entity="interface"><interface equipmentId="0"/></operation></request>';
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

getInterfaceOpticalInfo = function (cardId, interfaceId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showStatus" entity="interface/ethernet"><ethernet equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation><operation token="2" type="showStatus" entity="interfaceOptical"><interfaceOptical equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation></request>';
};

//operations
createLAG = function (cardId, interfaceId, loadBalanceMode, attachedPorts, description) {
    return '<?xml version="1.0" encoding="UTF-8"?>\
	<request>\
		<operation token="1" type="create" entity="interface/lag"><lag equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '" loadBalanceMode="' + loadBalanceMode + '"/></operation>\
		<operation token="2" type="config" entity="interface"><interface equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '" description="' + description + '"></interface></operation>' + attachedPorts + '</request>';
};

attachPortsToLag = function (lagIfIndex, ethIfIndex) {
    return '<operation token="1" type="attach" entity="interface/lag"><lag equipmentId="0"><attach><lagMemberPort lagIfIndex="' + lagIfIndex + '" ethIfIndex="' + ethIfIndex + '" lacpTimeout="1"/></attach></lag></operation>';
};

changeStatusLAG = function (interfaceId, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="200222" type="config" entity="interface"><interface equipmentId="0" interfaceId="' + interfaceId + '" admin="' + admin + '"></interface></operation></request>';
};

createNetworkService = function (admin, name, type, uplinkVlanId, uniVlanId, igmp, mcastProxyEnable, stackEnable, dhcpv4Enable, dhcpv6Enable, multicastFlood) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="create" entity="networkService"><networkService equipmentId="0" admin="' + admin + '" name="' + name + '" type="' + type + '" uplinkVlanId="' + uplinkVlanId + '" uniVlanId="' + uniVlanId + '" igmpEnable="' + igmp + '" mcastProxyEnable="' + mcastProxyEnable + '" stackEnable="' + stackEnable + '" dhcpv4Enable="' + dhcpv4Enable + '" dhcpv6Enable="' + dhcpv6Enable + '" multicastFlood="' + multicastFlood + '" ></networkService></operation></request>';
};

addPortsToNetworkService = function (id, cardId, interfaceId, role) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="attach" entity="networkService"><networkService equipmentId="0" id="' + id + '"><attach><interface cardId="' + cardId + '" interfaceId="' + interfaceId + '" role="' + role + '"/></attach></networkService></operation></request>';
};

changeStatusNetworkService = function (id, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="networkService"><networkService equipmentId="0" id="' + id + '" admin="' + admin + '"></networkService></operation></request>';
};

createClientService = function (networkServiceId, admin, name, uniVlan) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="create" entity="clientService"><clientService equipmentId="0" admin="2" name="' + name + '" networkServiceId="' + networkServiceId + '" uniVlan="' + uniVlan + '" upStreamId="1"><igmp useGlobalIgmp="0" igmpEnable="1"/></clientService></operation></request>';
    //<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="create" entity="clientService"><clientService equipmentId="0" admin="2" name="test_client_s" networkServiceId="2" uniVlan="6"><igmp useGlobalIgmp="0" igmpEnable="1"/></clientService></operation></request>
    //<?xml version="1.0" encoding="utf-8"?><request><operation type="create" entity="clientService"><clientService equipmentId="0"><create><clientService networkServiceId="2" admin="2" name="test_ui" uniVlan="6"></clientService></create</clientService></operation></request>
    //return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="create" entity="clientService"><clientService equipmentId="0"><create><clientService networkServiceId="' + networkServiceId + '" admin="' + admin + '" name="' + name + '" uniVlan="' + uniVlan + '"></clientService></create</clientService></operation></request>';
};

addPortsToClientService = function (id, cardId, interfaceId, role) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="3" type="attach" entity="clientService"><clientService equipmentId="0" cardId="' + cardId + '" id="' + id + '"><attach><port portIfIndex="' + interfaceId + '"/></attach></clientService></operation></request>';
};
//

changeStatusClientService = function (id, admin) {
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="config" entity="clientService"><clientService equipmentId="0" id="' + id + '" admin="' + admin + '"></clientService></operation></request>';
};

//remove
removeLag = function (interfaceId, cardId, deattachPorts) {
    return '<?xml version="1.0" encoding="UTF-8"?><request>' + deattachPorts + '\
        <operation token="2" type="remove" entity="interface/lag"><lag equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation></request>';
};

detachLagPort = function (interfaceId, ethIfIndex) {
    return '<operation token="1" type="detach" entity="interface/lag"><lag equipmentId="0"><attach><lagMemberPort lagIfIndex="' + interfaceId + '" ethIfIndex="' + ethIfIndex + '"/></attach></lag></operation>';
};

removeNetworkService = function (nsId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="10" type="config" entity="networkService"><networkService equipmentId="0" id="' + nsId + '" admin="2"></networkService></operation><operation token="1" type="config" entity="networkService/port"><networkService equipmentId="0" id="' + nsId + '"><replace/></networkService></operation><operation token="1" type="remove" entity="networkService"><networkService equipmentId="0" id="' + nsId + '"/></operation></request>';
};

removeClientService = function (csId, cardId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="config" entity="clientService/port"><clientService equipmentId="0" cardId="' + cardId + '" id="' + csId + '"><replace/></clientService></operation><operation token="1" type="remove" entity="clientService"><clientService equipmentId="0" cardId = "' + cardId + '" id="' + csId + '"/></operation></request>';
};

getNetworkServices = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="networkService"><networkService equipmentId="0"/></operation></request>';
};

getClientServices = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="clientService"><clientService equipmentId="0"/></operation></request>';
};
