'use strict';

describe('VI Duplicates Filter test', function () {
    var filter;

    // load the controller's module
    beforeEach(module('openNaaSApp'));

    beforeEach(function ($filter, $rootScope) {
        filter = $filter('viDuplicates', {
        });
    });
    describe('reverse', function () {
        it('should return the no duplicated elements a string', inject(function (viDuplicatesFilter) {
            expect(viDuplicatesFilter(["vi-1","vi-2","vi-3"], ["vi-1","vi-2"])).toEqual(['vi-3']);
        }));
    });
});
