describe('Test Controller: listVIController', function () {
    var scope, $location, MqNaaSResourceService, x2js;
    var mockRestService = {};
    
    beforeEach(function () {
        module('openNaaSApp', function ($provide) {
            $provide.value('MqNaaSResourceService', mockRestService);
        });
    });

    beforeEach(module('cb.x2js'));
    beforeEach(inject(function (_x2js_) {
        x2js = _x2js_;
    }));

    beforeEach(function () {

        inject(function ($q) {
            var xmlData = "<IResource><IResourceId>req-1</IResourceId></IResource>";
            mockRestService.data = x2js.xml_str2json(xmlData);
            mockRestService.data.IResource.IResourceId = checkIfIsArray(mockRestService.data.IResource.IResourceId);
            mockRestService.list = function () {
                var defer = $q.defer();
                defer.resolve(this.data);
                return defer.promise;
            };

            mockRestService.put = function () {
                var defer = $q.defer();
                var id = this.data.IResource.IResourceId.length;
                var name = "req-" + (id + 1);
                var item = name;
                this.data.IResource.IResourceId.push(item);
                defer.resolve(item);
                return defer.promise;
            };
        });
    });

    beforeEach(inject(function ($controller, $rootScope, _$location_, _MqNaaSResourceService_) {
        scope = $rootScope.$new();
        $location = _$location_;
        MqNaaSResourceService = _MqNaaSResourceService_;
        $controller('listVIController', {$scope: scope, $location: $location, MqNaaSResourceService: MqNaaSResourceService});
        scope.tableParams.settings().$scope = scope;
        scope.$digest();
    }));
    it('should test the VI list', function () {
        expect(scope.data).toEqual(['req-1']);
    });

    it('should make a VI request and test the VI list', function () {
        response = scope.createVIRequest();
        expect(scope.data).toEqual(['req-1', 'req-2']);
    });
});
