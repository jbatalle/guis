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
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);

                    console.log(data);
                    tree = new TreeModel();
                    var root = tree.parse({name: 'rootResource', children: []});
                    console.log(root);
                    console.log(JSON.stringify(root, ["name", "children", "model"]));
//                    console.log(jsonify(root));
//                    localStorageService.set("mqNaaSElements", root);
//                    return;

                    console.log(data.length);
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        childNode = root.addChild(tree.parse({name: data[i]}));
                        console.log(childNode);
                        url = generateUrl("IRootResourceAdministration", data[i], "IRootResourceProvider");
                        getMqNaaSResource(root, data[i], url);
                    }
                    console.log(root);
//                    console.log(JSON.stringify(root, ["name", "children", "name", "children", "model"]));
//                    console.log(JSON.stringify(root, undefined, ""));
console.log(cloneSO(root));
console.log(JSON.stringify(root.model));
                    console.log(jsonify(root));
                    //                var url = generateUrl("IRootResourceAdministration", $routeParams.id, "IRootResourceProvider");

//                    $scope.data = data;
//                    localStorageService.set("mqNaaSElements", root);
                });
            };

            var getMqNaaSResource = function (root, parent, url) {
                console.log(root);
                console.log(parent);
                MqNaaSResourceService.list(url).then(function (data) {
                    console.log(data);
                    if (data === undefined)
                        return;
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        var n = root.first(function (node) {
                            return node.model.name === parent;
                        });
                        n.addChild(tree.parse({name: data[i]}));
                        url = generateUrl("IRootResourceAdministration", data[i], "IRootResourceProvider");
                        getMqNaaSResource(root, data[i], url);
                    }
                }, function (error) {
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
