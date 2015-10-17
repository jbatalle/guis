getCards = function () {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="card"><card equipmentId="0" _id="0"/></operation></request>';
};

getCardInterfaces = function (cardId) {
    return '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="all"><interface equipmentId="0" cardId="' + cardId + '"/></operation></request>';
};
