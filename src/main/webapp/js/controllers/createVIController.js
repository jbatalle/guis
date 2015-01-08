'use strict';

angular.module('openNaaSApp')
        .controller('listVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, ngTableParams, viService, localStorageService) {
            console.log("LIST VI");
    $rootScope.networkId = "Network-Internal-1.0-2";
            var urlListVI = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement";
            $scope.data = [];
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                $scope.data = result.IResource.IResourceId;
                $scope.tableParams.reload();
//                return result.IResource;
            });
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: $scope.data.length,
                getData: function ($defer, params) {
                    var data = checkIfIsArray($scope.data);
                    console.log(data);
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });

            $scope.createVIRequest = function () {
                var urlCreateVI = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement";
                MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                    $scope.data.push(result);
                    var vi = {"name": result};
                    console.log("CREATE VI AND save spring...");
                    viService.createVI(vi);
                    localStorageService.set("virtualElements", []);
                    $scope.tableParams.reload();
                });
            };
            $scope.deleteVIRequest = function (viReq) {
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+viReq;
                MqNaaSResourceService.remove(url).then(function (result) {
//                    viService.createVI(vi);
                    $scope.tableParams.reload();
                });
            };
            
            $scope.sendVIR = function (viReq){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestBasedNetworkManagement/?arg0="+viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            
        })
        .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, ngDialog, viService, localStorageService) {
            console.log("Edit VI : " + $routeParams.id);
            $scope.viId = $routeParams.id;
$scope.virtualPort = [];
            var urlPeriod = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
            MqNaaSResourceService.get(urlPeriod).then(function (result) {
                $scope.period = result;
                $scope.period.startDate = "1/8/15";
                console.log(result);
                var d = new Date(result.startDate+1000);
                console.log(d);
//                console.log(formatDate(d));
                console.log(customFormat( "#DD#/#MM#/#YYYY#", d));
            });

            $scope.setPeriod = function (period) {
                console.log(period);
                console.log(new Date(period.startDate).getTime());
                var urlPeriod = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
                var onPeriod = getPeriod(new Date(period.startDate).getTime()/1000, new Date(period.endDate).getTime()/1000);//xml
                MqNaaSResourceService.put(urlPeriod, onPeriod).then(function () {//the response is empty
                    
                });
            };
            $scope.addResourceToVI = function (resourceType){//resourceType TSON/ARN/CPE...
                console.log("ADD RESOURCE TO VI");
                resourceType = resourceType.toUpperCase();
                console.log(resourceType);
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+$scope.viId+"/IRequestResourceManagement/?arg0="+resourceType;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resourceRequest = result;
                    viService.addResourceToVI($scope.viId, result, resourceType);
                    var vEl = localStorageService.get("virtualElements");
                    vEl.push({name: result, type: resourceType});
                    localStorageService.set("virtualElements", vEl);
                });
            };
            $scope.addVirtualPortToResource = function (resourceRequest){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+$scope.viId+"/IRequestResourceManagement/"+resourceRequest+"/IPortManagement";
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.virtualPort.push(result);
                });
            };
            $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+$scope.viId+"/IRequestResourceManagement/"+resourceRequest+"/IRequestResourceMapping/defineMapping/?arg0="+resourceRequest+"&arg1="+realResource;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.mapVirtualPorts = function (virtualPort, realPort){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+$scope.viId+"/IRequestResourceMapping/defineMapping/?arg0="+virtualPort+"&arg1="+realPort;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.sendVIR = function (viReq){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestBasedNetworkManagement/?arg0="+viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.addResourceToGraph = function(name){
                console.log($scope.ngDialogData);
                console.log(name);
                createElement(name, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                ngDialog.close();
            };
            
            $scope.getVirtualPorts = function(virtualRes){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRequestManagement/"+$scope.viId+"/IRequestResourceManagement/"+virtualRes+"/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.virtualPorts = result;
                });
            };
            $scope.getPhysicalPorts = function(resourceName){
                var url = "IRootResourceAdministration/"+$rootScope.networkId+"/IRootResourceAdministration/"+resourceName+"/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts = result;
                });
            };

        });
        
        
        
        
function customFormat(formatString, d){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = d;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}