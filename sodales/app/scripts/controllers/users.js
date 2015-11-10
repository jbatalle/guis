'use strict';

angular.module('mqnaasApp')
    .controller('UsersCtrl', function ($rootScope, $scope, $window, $location, AuthService, UsersService, $modal, UserStatisticsService, TenantsService) {
        $scope.userCollection = [];
        $scope.currentPath = $location.path();
        $scope.getUsersList = function () {
            if ($rootScope.selectedTenant && $location.path() == '/tenants/users') {
                TenantsService.getUsers($rootScope.selectedTenant.id).then(function (data) {
                    $scope.userCollection = data;
                });
            } else {
                UsersService.getUsers().then(function (data) {
                    $scope.userCollection = data;
                });
            }
        };

        $scope.register = function () {
            var username = this.username;
            var password = this.password;
            var re_password = this.re_password;
            var tenant = this.tenant;
            var email = this.email;
            var fullname = this.fullname;

            this.userRegisterForm.usernameError = false;
            this.userRegisterForm.emailError = false;
            this.userRegisterForm.fullnameError = false;
            //$scope.userRegisterForm.orgError = false;
            this.userRegisterForm.passError = false;
            this.userRegisterForm.repassError = false;


            if (username && email && password && re_password) {
                if (password === re_password) {
                    UsersService.register(username, password, email, fullname, tenant).then(
                        //TODO: Close modal ?
                        function () {
                            $location.path('users');
                        },
                        function (error) {
                            $scope.registerError = error;
                        }
                    );
                } else {
                    $scope.userRegisterForm.repassError = true;
                    $scope.registerError = 'The repeat password is different from password.';
                }
            } else {
                if (!username) this.userRegisterForm.usernameError = true;
                if (!email) this.userRegisterForm.emailError = true;
                if (!password) this.userRegisterForm.passError = true;
                if (!re_password) this.userRegisterForm.repassError = true;
                //if(!fullname) $scope.userRegisterForm.fullnameError = true;
                //if(!org) $scope.userRegisterForm.usernameError = true;
                this.registerError = 'Username, email and password required.';
            }
        };

        $scope.getUsersList();
        $scope.active = function (user_id) {
            UsersService.activeUser(user_id).then(function () {
                $scope.getUsersList();
            });
        };
        $scope.disable = function (user_id) {
            UsersService.disableUser(user_id).then(function () {
                $scope.getUsersList();
            });
        };

        $scope.getProfile = function (user_id) {
            UsersService.getProfile(user_id).then(function (data) {
                $scope.userCollection = data;
            });
        };

        $scope.createDialog = function () {
            $modal({
                title: 'Create new User.',
                template: 'views/modals/ip_oa/modalUserCreation.html',
                show: true,
                scope: $scope
            });
        };

        $scope.deleteDialog = function (id) {
            $scope.itemToDeleteId = id;
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/modals/modalRemove.html',
                show: true,
                scope: $scope
            });
        };

        $scope.create = function (object) {
            //UsersService.post(object).then(function () {});
            $scope.getUsersList();
            this.$hide();
        };

        $scope.deleteItem = function (id) {
            UsersService.remove(id).then(function () {
                $scope.getUsersList();
            });
            this.$hide();
        };

        $scope.tabs = [{
            title: 'Information',
            url: 'tab_1'
        }, {
            title: 'Statistics',
            url: 'tab_2'
        }];

        $scope.currentTab = 'tab_1';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $scope.currentTab;
        };

        $scope.getLastVisitedPages = function (user_id) {
            $scope.lastLogin = undefined;
            UserStatisticsService.get(user_id).then(function (data) {
                $scope.lastVisitedPages = data;
                $scope.generatePagesData(data);
            });
        };

        $scope.generatePagesData = function (arr) {
            var a = [],
                b = [],
                prev = {},
                res = [];
            arr.sort(dynamicSort("view"));
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].view !== prev.view) {
                    a.push(arr[i].view);
                    b.push(1);
                } else {
                    b[b.length - 1]++;
                }
                prev = arr[i];
            }
            for (i = 0; i < a.length; i++) {
                var t = {};
                t.label = a[i];
                t.value = b[i];
                res.push(t);
            }
            if (res.length == 0) {
                $scope.charts = {};
            } else {
                $scope.charts = {
                    title: 'Last visited pages',
                    description: 'This graph shows the last 20 visited pages',
                    data: res,
                    chart_type: 'bar',
                    x_accessor: 'value',
                    y_accessor: 'label',
                    width: 295,
                    height: 150,
                    right: 10,
                    animate_on_load: true,
                    target: '#bar2',
                    left: 100
                };
                $scope.$broadcast("toggleAnimation", $scope.charts);
            }

        };

        $scope.getLastLogins = function (user_id) {
            $scope.lastVisitedPages = undefined;
            UserStatisticsService.getLastLogins(user_id).then(function (data) {
                $scope.lastLogin = data;
                $scope.hist = {};
                $scope.generateLoginData(data);
            });
        };

        $scope.generateLoginData = function (arr) {
            var resp = [],
                day = 0,
                obj = {};
            arr.sort(dynamicSort("created_at"));
            for (var i = 0; i < arr.length; i++) {
                var d = new Date(arr[i].created_at);
                if (day != d.getDate() || i == 0) {
                    day = d.getDate();
                    var newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
                    obj = {};
                    obj.date = newDate;
                    obj.value = 1;
                    resp.push(obj);
                } else {
                    resp[resp.length - 1].value++;
                }
            }
            d = new Date(arr[arr.length - 1].created_at);
            resp.push({
                date: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0),
                value: 0
            });

            if (resp.length == 0) {
                $scope.hist = {};
            } else {
                $scope.hist = {
                    title: 'Logins by day',
                    data: resp,
                    target: '#timehist',
                    chart_type: 'histogram',
                    width: 500,
                    height: 200,
                    binned: true,
                    right: 10,
                    y_extended_ticks: true,
                    x_accessor: 'date',
                    y_accessor: 'value'
                };
                $scope.$broadcast("toggleAnimation", $scope.hist);
            }
        };
    })
    .controller('UsersProfileCtrl', function ($scope, $stateParams, $window, AuthService, UsersService) {
        $scope.roles = [
            {
                id: 0,
                name: 'sysadmin',
                selected: false
            },
            {
                id: 1,
                name: 'tenantadmin',
                selected: false
            },
            {
                id: 2,
                name: 'tenantuser',
                selected: false
            },
            {
                id: 3,
                name: 'guest',
                selected: false
            }
        ];

        $scope.roleList = ['sysadmin', 'tenantadmin', 'tenantuser', 'guest'];
        UsersService.getProfile($stateParams.id).then(function (data) {
            $scope.profile = data;
            var i = 0;
            $scope.profile.roles.forEach(function (role) {
                for (i = 0; i < $scope.roles.length; i++) {
                    if ($scope.roles[i].name === role.name) $scope.roles[i].selected = true;
                }
            });
        });

        $scope.updateProfile = function (profile) {
            profile.roles = [];
            $scope.roles.forEach(function (role) {
                if (role.selected) profile.roles.push(role.name);
            });
            UsersService.updateProfile(profile).then(function () {});
        };
    });
