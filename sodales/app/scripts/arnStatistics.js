getCCMStats = function (resourceType, endpoint) {
    return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaCcmCounter xmlns="http://www.ethernity-net.com/enet/CcmCounter"><CcmDefectCount><unit>0</unit><LastSequenc>1832557</LastSequenc><Unexpected_MEG_ID>0</Unexpected_MEG_ID><Unexpected_MEP_ID>0</Unexpected_MEP_ID><reorder>4</reorder><eventLoss>0</eventLoss></CcmDefectCount></meaCcmCounter>';
};

getLBMStats = function (resourceType, endpoint) {
    return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>0</AVG_latency><Bytes>1735000</Bytes><MAX_jitter>0</MAX_jitter><MIN_jitter>4294967295</MIN_jitter><Pkts>1735</Pkts><drop>0</drop><lastseqID>1754</lastseqID><num_Of_Bits_Error>6695669</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
};
getDMMStats = function (resourceType, endpoint) {
    return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>5408</AVG_latency><Bytes>0</Bytes><MAX_jitter>6240</MAX_jitter><MIN_jitter>5312</MIN_jitter><Pkts>0</Pkts><drop>0</drop><lastseqID>0</lastseqID><num_Of_Bits_Error>0</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
};

equipmentBoardsStats = function (resourceType, endpoint) {
    return "<?xml version='1.0' encoding='utf-8'?><response timestamp='1421071666' localDate='2015/01/12' localTime='14:07:46' version='3.5.0-r' ><operation type='show' entity='alarmRegister' ><alarmRegisterList><alarmRegister id='0' code='36866' accessType='0' startOrEnd='1' timeStamp='1421071626' localTimeStamp='1421071666' interfaceId='83951616' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='1' code='99901' accessType='0' startOrEnd='1' timeStamp='1421071627' localTimeStamp='1421071666' interfaceId='83951616' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='2' code='36866' accessType='0' startOrEnd='1' timeStamp='1421071628' localTimeStamp='1421071666' interfaceId='83951617' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='3' code='99901' accessType='0' startOrEnd='1' timeStamp='1421071629' localTimeStamp='1421071666' interfaceId='83951617' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /></alarmRegisterList><result error='00000000' errorStr='OK'/></operation></response>";
};

getLBMStats = function (resourceType, endpoint) {
    return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaCcmCounter xmlns="http://www.ethernity-net.com/enet/CcmCounter"><CcmDefectCount><unit>0</unit><LastSequenc>1832557</LastSequenc><Unexpected_MEG_ID>0</Unexpected_MEG_ID><Unexpected_MEP_ID>0</Unexpected_MEP_ID><reorder>4</reorder><eventLoss>0</eventLoss></CcmDefectCount></meaCcmCounter>';
};
