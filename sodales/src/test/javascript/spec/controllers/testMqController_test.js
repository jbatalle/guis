describe('TestMqController', function() {
    var scope, $location, createController;

    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        $location = _$location_;
        scope = $rootScope.$new();

        createController = function() {
            return $controller('TestMqController', {
                '$scope': scope
            });
        };
    }));

    it('should have a valid scope', function () {
    expect(!!scope).toBe(true);
  });
});

