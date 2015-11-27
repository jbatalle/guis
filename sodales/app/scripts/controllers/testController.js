'use strict';

angular.module('mqnaasApp')
    .controller('testController', function ($rootScope, $scope) {

        $scope.virtualPorts = ["1", "2", "3", "4", "5", "6"];
        $scope.physicalPorts = ["100", "102", "103", "104", "105", "106"];
        $scope.selectedViPorts = [];
        $scope.selectedViVlans = [];
        $scope.selectedPhyVlans = [];


        $scope.selectedViPorts = ["1", "2"];
        $scope.selectedPhyPorts = ["100", "102", "104"];

        $scope.tasks1 = [];
        $scope.tasks1 = new Array(4096);

        var t = 4096;
        $scope.virtualVlans = [];
        for (var i = 0; i < 4096; i = i + 127) {
            $scope.virtualVlans.push({
                "lower": i,
                "upper": i + 127
            });
            //i = i + 127;
        };

        $scope.physicalVlans = [];
        for (var i = 0; i < 4096; i = i + 127) {
            $scope.physicalVlans.push({
                lower: i,
                upper: i + 127
            });
            //i = i + 127;
        };

        //$scope.virtualVlans = [];
        //$scope.physicalVlans = [];
        var vl = _.range(1, 4096);
        // $scope.virtualVlans = new Array(100);
        //$scope.physicalVlans = new Array(100);

        $scope.testPorts = ["1", "2", "4", "5", "6"];
        $scope.testVlans = ["1", "2", "100", "200", "201", "202"];

        $scope.updateTable = function (t) {
            //find this t in mapping and remove .phy
            _.find($scope.mapping, function (n) {
                console.log(n.virt !== t.virt && t.phy === n.phy);
                return n.virt !== t.virt && t.phy === n.phy;
            }).phy = ""
        }

        //watch
        $scope.mapping = [];
        $scope.$watchGroup(['selectedViPorts', 'selectedPhyPorts'], function () {
            $scope.preMapping = [];
            for (var i = 0; i < $scope.selectedViPorts.length; i++) {
                $scope.preMapping.push({
                    virt: $scope.selectedViPorts[i],
                    phy: $scope.selectedPhyPorts[i]
                });
                angular.copy($scope.preMapping, $scope.mapping);
            };
        });

        $scope.mappingVlan = [];
        $scope.$watchGroup(['selectedViVlans', 'selectedPhyVlans'], function () {
            $scope.preMappingVlan = [];
            for (var i = 0; i < $scope.selectedViVlans.length; i++) {
                $scope.preMappingVlan.push({
                    virt: $scope.selectedViVlans[i],
                    phy: $scope.selectedPhyVlans[i]
                });
                angular.copy($scope.preMappingVlan, $scope.mappingVlan);
            };
        });


        $scope.map = function () {
            $scope.cubes = [];
            _.map($scope.mapping, function (o) {
                return _.values(_.pick(o, 'phy'));
            });

            var portRanges = generateCube(_.map($scope.mapping, function (o) {
                return _.values(_.pick(o, 'phy'));
            }));

            var preMapVlan = [];
            _.each($scope.mappingVlan, function (d) {
                preMapVlan = _.union(preMapVlan, _.range(d.virt.lower, d.virt.upper));
            });

            var vlanRanges = generateCube(preMapVlan);

            //create cube
            _.each(portRanges, function (r) {
                var portRanges = getRange(r.lowerBound, r.upperBound);
                _.each(vlanRanges, function (r) {
                    var vlanRanges = getRange(r.lowerBound, r.upperBound);
                    $scope.cubes.push(getCube(getRanges(portRanges + vlanRanges)));
                });
            })
            console.log(getCubes($scope.cubes));
        };


        $scope.cubes = [];
        $scope.ranges = "";
    })
    .controller('TasksCtrl', function ($scope) {
        $scope.tasks = [];
        $scope.tasks = new Array(4096);
    });

function generateCube(cube) {
    var cube = cube.map(function (e) {
        return parseInt(e)
    });
    //cube.sort();
    cube.sort(function (a, b) {
        return a - b
    });
    var arr = cube;
    var ranges = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj = {};
        obj.lowerBound = arr[i];
        obj.upperBound = arr[i];
        if (arr[i + 1] == arr[i] + 1) {
            obj.upperBound = arr[i + 1];
            // loop through next numbers, to prevent repeating longer sequences
            while (arr[i] + 1 == arr[i + 1]) {
                obj.upperBound = arr[i + 1];
                i++;
            }
        }
        ranges.push(obj);
    }
    return ranges;
    var cubes = [];
    ranges.forEach(function (range) {
        var ranges = getRange(range.lowerBound, range.upperBound);
        ranges = ranges + getRange(100, 200);
        cubes.push(getCube(getRanges(ranges)));
        //cubes.push(getCubeVirtual(range.lowerBound, range.upperBound));
    });
    return getCubes(cubes);
};
