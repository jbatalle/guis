getLAGs = function(){
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="showStatus" entity="interface/lagPort"><lagPort equipmentId="0" /></operation></request>';
};

getLACP = function(){
    return '<?xml version="1.0" encoding="utf-8"?><request><operation type="showCounters" entity="interface/lagPort"><lagPort equipmentId="0" interfaceId="8781824" ethIfIndex="285278211"/></operation></request>';
};

getLinkStatus = function(){
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="showStatus" entity="interface/ethernet"><ethernet equipmentId="0" cardId="4"/></operation></request>';
};

getCounter = function(interfaceId){
    return '<?xml version="1.0" encoding="utf-8"?><request><operation token="33" type="showCounters" entity="interface/ethernet"><ethernet equipmentId="0" interfaceId="'+interfaceId+'"/></operation></request>';
};

getSFPSlot = function(slot){
  return '<?xml version="1.0" encoding="utf-8"?><request><operation type="showStatus" entity="interfaceOptical"><interfaceOptical equipmentId="0" interfaceId="'+slot+'" /></operation></request>';  
};

getSFP = function(){
return '<?xml version="1.0" encoding="utf-8"?><request><operation token="1" type="showStatus" entity="interface/xsfp"><interfaceXsfp equipmentId="0" interfaceId="67174400"/></operation></request>';
};