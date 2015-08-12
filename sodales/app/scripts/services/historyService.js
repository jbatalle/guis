'use strict';

services.factory('HistoryService', function ($resource) {
    return $resource('http://localhost:5000/history/:id', {
        id: '@id'
    });
});
