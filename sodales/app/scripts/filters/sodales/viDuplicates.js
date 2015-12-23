'use strict';

angular.module('mqnaasApp')
    .filter('viDuplicates', function () {
        return function (items, filterOn) {
            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var newItems = [];

                angular.forEach(items, function (item) {
                    var isDuplicate = false;
                    for (var i = 0; i < filterOn.length; i++) {
                        if (angular.equals(item.id, filterOn[i].name)) {
                            isDuplicate = true;
                            break;
                        }
                    }

                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            //                console.log(items);
            return items;
        };
    });
