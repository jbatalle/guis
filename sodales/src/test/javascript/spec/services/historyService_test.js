describe("Testing History Service ", function() {

    beforeEach(module('openNaaSApp.services'));

    var service, $httpBackend, response;
    var url = 'rest/history'


     beforeEach(inject(function( _$httpBackend_, HistoryService) {
        $httpBackend = _$httpBackend_;
        service = HistoryService;

    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    //tests

    it("callAppsList should be defined", function () {
        expect(service).toBeDefined();
    });


    it('should return the correct status',(function () {
        res = service.get({
                    id: 1
                });
        $httpBackend.whenGET(url+"/1").respond({status: 200});
        //explicitly flushes pending requests
        $httpBackend.flush();
        expect(res.status).toEqual(200);

    }));

    it('should send history POST',(function () {
/*        res = service.post({
                    id: 1,
                    content: "Pro Spring",
                    type: "INFO"
                });
*/        $httpBackend.when('POST', url, {
                    id: 1,
                    content: "Pro Spring",
                    type: "INFO"
                }).respond({success: true, history:{"id":1,"date":1418737428783,"content":"Pro Spring","type":"INFO"}});

        $httpBackend.whenPOST(url).respond({status: 200});
        //explicitly flushes pending requests
//        $httpBackend.flush();
        expect(res.status).toEqual(200);

    }));

  });

