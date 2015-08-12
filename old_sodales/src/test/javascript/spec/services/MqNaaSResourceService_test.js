describe("Testing MqNaaSResourceService Service ", function () {

    beforeEach(module('openNaaSApp.services'));

    var service, $httpBackend, response, x2js;
    var url = 'rest/mqnaas';

    beforeEach(module('cb.x2js'));

    beforeEach(inject(function (_$httpBackend_, _x2js_, MqNaaSResourceService) {
        $httpBackend = _$httpBackend_;
        service = MqNaaSResourceService;
        x2js = _x2js_;

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    //tests
    it("test this test", function () {
        expect(true).toBeTruthy();
    });
    it("service is defined", function () {
        expect(service).toBeDefined();
    });

    it('x2js is injected', function () {
        expect(x2js instanceof X2JS).toBeTruthy();
    });
/*
    it('should return the correct status', (function () {
        res = service.get({
            id: 1
        });
        $httpBackend.whenGET(url + "/1", "test").respond({status: 200});
        //explicitly flushes pending requests
        $httpBackend.flush();
        expect(res.status).toEqual(200);

    }));
    /*
     it('should send history POST',(function () {
     $httpBackend.when('POST', url, {
     id: 1,
     content: "Pro Spring",
     type: "INFO"
     }).respond({success: true, history:{"id":1,"date":1418737428783,"content":"Pro Spring","type":"INFO"}});
     
     $httpBackend.whenPOST(url).respond({status: 200});
     //explicitly flushes pending requests
     //        $httpBackend.flush();
     expect(res.status).toEqual(200);
     
     }));
     */
});

