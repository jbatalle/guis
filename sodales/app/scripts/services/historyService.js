'use strict';

services.factory('HistoryService', function ($resource, AUTHENTICATION) {
    return $resource(AUTHENTICATION + 'history/:id', {
        id: '@id'
    });
});
