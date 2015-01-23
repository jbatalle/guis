'use strict';

describe('History controller test', function () {
    var controller, scope;
    var http;

    // load the controller's module
    beforeEach(module('openNaaSApp'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('HistoryListController', {
            $scope: scope
        });
    }));


    it('has correct initial values', function () {
//    var tree = localstorage;
        var tree = new TreeModel(),
                root = tree.parse({name: 'Net-1', children: [{name: 'TSON-1', children: [{name: 'port-1'}]}]});
        var nodeTSON = root.first(function (node) {
            return node.model.name === "TSON-1";
        });
        var node = tree.parse({name: 'port-2'});
        nodeTSON.addChild(node);
        var portNode = root.first(function (node) {
            return node.model.name === "port-2";
        });

        node = tree.parse({name: 'port-2'});
        nodeTSON.addChild(node);

        expect(scope.tableParams.data.length).toBe(0);
//            expect(scope.tableParams.data.length).toEqual(1);
    });

});
