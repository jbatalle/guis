'use strict';

angular.module('openNaaSApp')
        .controller('CrawlerResourceController', function ($scope, RootResourceService, MqNaaSResourceService, localStorageService) {
            console.log("CRAWLER");
            var url = "";
            var childNode;
            var tree;
localStorageService.set("mqNaaSElements", "");
            var getRootResources = function () {
                RootResourceService.list().then(function (data) {
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                        data = data.IRootResource.IRootResourceId;
                    } else {
                        data = [data.IRootResource.IRootResourceId];
                    }

                    console.log(data);
                    tree = new TreeModel();
                    var root = tree.parse({name: 'rootResource', children: [{}]});
                    console.log(data.length);
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        childNode = root.addChild(tree.parse({name: data[i]}));
                        url = generateUrl("IRootResourceAdministration", data[i], "IRootResourceProvider");
                        getMqNaaSResource(url);
                    }
                    console.log(root);
                    //                var url = generateUrl("IRootResourceAdministration", $routeParams.id, "IRootResourceProvider");

                    $scope.data = data;
                    localStorageService.set("mqNaaSElements", root);
                });
            };


            var getMqNaaSResource = function (url) {
                console.log("MQNAAS FUNCTION");
                MqNaaSResourceService.list(url).then(function (data) {
                    if(data === undefined) return;
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                        data = data.IRootResource.IRootResourceId;
                    } else {
                        data = [data.IRootResource.IRootResourceId];
                    }
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        childNode.addChild(tree.parse({name: data[i]}));
                        url = generateUrl("IRootResourceAdministration", data[i], "IRootResourceProvider");
                        getMqNaaSResource(url);
                    }
                }, function(error){
                    console.log(error);
                });
            };
            getRootResources();
        })
        .controller('InfoRootResourceController', function ($scope, RootResourceService, $routeParams, localStorageService) {
            RootResourceService.get($routeParams.id).then(function (data) {
                console.log(data);
                console.log("mqEl-" + $routeParams.id);
                $scope.data = data;
                localStorageService.set("mqEl-" + $routeParams.id, data);
                console.log($scope.data);
            });
        });