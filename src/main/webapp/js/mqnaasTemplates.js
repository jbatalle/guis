getTSON = function(endpoint){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>TSON</type><model>Internal</model><version>1.0</version></specification><endpoints><endpoint><uri>'+endpoint+'</uri></endpoint></endpoints></ns2:rootResourceDescriptor>';
};

getARN = function(endpoint){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>ARN</type><model>Internal</model><version>1.0</version></specification><endpoints><endpoint><uri>'+endpoint+'</uri></endpoint></endpoints></ns2:rootResourceDescriptor>';
};

getNETWORK = function(){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>NETWORK</type><model>Internal</model><version>1.0</version></specification></ns2:rootResourceDescriptor>';
};

getPeriod = function(start, end){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:period xmlns:ns2="org.mqnaas"><startDate>'+start+'</startDate><endDate>'+end+'</endDate></ns2:period>';
};

getCubeforTSON = function(lowRange1, uppRange1, lowRange2, uppRange2){
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:cubesList xmlns:ns2="org.mqnaas"><cubes><cube><ranges><range><lowerBound>'+lowRange1+'</lowerBound><upperBound>'+uppRange1+'</upperBound></range></ranges></cube><cube><ranges><range><lowerBound>'+lowRange2+'</lowerBound><upperBound>'+uppRange2+'</upperBound></range></ranges></cube></cubes></ns2:cubesList>';
};

getRangeUnit = function(lowerBound, upperBound){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:range xmlns:ns2="org.mqnaas"><lowerBound>'+lowerBound+'</lowerBound><upperBound>'+upperBound+'</upperBound></ns2:range>';
}