'use strict';

/**
 * @ngdoc overview
 * @name mqnaasApp
 * @description
 * # mqnaasApp
 *
 * Main module of the application.
 */

angular.module('mqnaasApp', ['ui.router', 'ngSanitize', 'mqnaasApp.config', 'mqnaasApp.controllers', 'mqnaasApp.services', 'smart-table', 'mgcrea.ngStrap', 'ngTagsInput', 'cb.x2js', 'LocalStorageModule'])

.run(
  ['$rootScope', '$state', '$stateParams', '$timeout',
    function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $state.transitionTo('root.dashboard');
    }
  ]
)

.config(
  ['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $stateProvider
            // Root state to master all
                .state('root', {
                    abstract: true,
                    controller: 'rootCtrl',
                    views: {
                        '@': {
                            templateUrl: 'views/layout/tpl.common.html',
                            controller: ''
                        },
                        'header@root': {
                            templateUrl: 'views/layout/header.html',
                            controller: 'RootCtrl'
                        },
                        'sidebar@root': {
                            templateUrl: 'views/layout/sidebar.html',
                            controller: 'RootCtrl'
                        },
                        'main@root': {
                            template: '<div ui-view="master"></div>',
                            controller: 'RootCtrl'
                        },
                        'footer@root': {
                            templateUrl: 'views/layout/footer.html',
                            controller: 'RootCtrl'
                        },
                    }
                })
                // login
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/user/login.html',
                    controller: 'AuthCtrl'
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'views/user/register.html',
                    controller: 'AuthCtrl'
                })
                .state('recover_pass', {
                    url: '/recover_pass',
                    templateUrl: 'views/user/recover_pass.html',
                    controller: 'AuthCtrl'
                })
                .state('root.users', {
                    url: '/users',
                    views: {
                        'master@root': {
                            templateUrl: 'views/users.html',
                            controller: 'UsersCtrl'
                        }
                    }
                })
                .state('root.users.profile', {
                    url: '/user/:id',
                    views: {
                        'master@root': {
                            templateUrl: 'views/users_profile.html',
                            controller: 'UsersProfileCtrl'
                        }
                    }
                })
                // register
                .state('root.register', {
                    url: '/registerUser',
                    views: {
                        'master@root': {
                            templateUrl: 'views/user/register.html',
                            controller: 'RegisterCtrl'
                        }
                    }
                })
                //profile
                .state('root.profile', {
                    url: '/profile',
                    views: {
                        'master@root': {
                            templateUrl: 'views/user/profile.html',
                            controller: 'ProfileCtrl'
                        }
                    }
                }).state('root.tenants.users', {
                    url: '/users',
                    views: {
                        'master@root': {
                            templateUrl: 'views/users.html',
                            controller: 'UsersCtrl'
                        }
                    }
                })
                // Dashboard
                .state('root.dashboard', {
                    url: '/dashboard',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/1_home.html',
                            controller: 'HomeCtrl'
                        }
                    }
                }).state('root.resourcesMgt', {
                    url: '/resourcesMgt',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/2_1_resource.html',
                            controller: 'PIMgtCtrl'
                        }
                    }
                }).state('root.resourcesList', {
                    url: '/resourcesList',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/2_2_resources_list.html',
                            controller: 'resourcesListCtrl'
                        }
                    }
                }).state('root.createVI', {
                    url: '/createVI',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/3_1_vi_req.html',
                            controller: 'listVIController'
                        }
                    }
                }).state('root.editVIRequest', {
                    url: '/editVIRequest/:id',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/3_1_vi_req_editor.html',
                            controller: 'editVIController'
                        }
                    }
                }).state('root.createdVIs', {
                    url: '/createdVIs',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/3_2_vi.html',
                            controller: 'createdVIController'
                        }
                    }
                }).state('root.viewVirtualNetwork', {
                    url: '/viewVirtualNetwork/:id',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/3_2_vi_view.html',
                            controller: 'viewVIController'
                        }
                    }
                }).state('root.mgt', {
                    url: '/mgt',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/mgt.html',
                            controller: 'MgtCtrl'
                        }
                    }
                }).state('root.statistics', {
                    url: '/statistics',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/statistics.html',
                            controller: 'StatisticsCtrl'
                        }
                    }
                }).state('root.settings', {
                    url: '/settings',
                    views: {
                        'master@root': {
                            templateUrl: 'views/content/options.html',
                            controller: 'optionsCtrl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/login');

            /* Registers auth token interceptor, auth token is either passed by header or by query parameter
             * as soon as there is an authenticated user */
            $httpProvider.interceptors.push(function ($q, $rootScope, $location, $window) {
                return {
                    'request': function (config) {
                        var isRestCall = config.url.indexOf('rest') === 0;
                        var isRestCall = config.url.indexOf('login') !== -1;
                        if (!isRestCall && angular.isDefined($window.localStorage.token)) {
                            //  if (angular.isDefined($window.localStorage.token)) {
                            var authToken = $window.localStorage.token;
                            if (mqnaasAppConfig.useAuthTokenHeader) {
                                config.headers['X-Auth-Token'] = authToken;
                            } else {
                                config.url = config.url + '?token=' + authToken;
                            }
                            //return config || $q.when(config);
                        }
                        return config || $q.when(config);
                    }
                };
            });
            $httpProvider.interceptors.push(function ($q, $rootScope, $location, $window) {
                return {
                    'responseError': function (rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = config.method;
                        var url = config.url;
                        console.log("APP INTERCEPTOR ERROR");
                        $rootScope.rejection = rejection;
                        console.log(status);

                        if (Math.floor(Date.now() / 1000) > $window.localStorage.expiration)
                            $rootScope.logout();
                        else if (status === 401 && $window.localStorage.token !== null && $window.localStorage.token !== undefined) {
                            $location.path('/dashboard');
                        } else if (status === 401) {
                            $location.path('/login');
                        } else {
                            $rootScope.error = method + ' on ' + url + ' failed with status ' + status;
                            //$location.path('/login');
                        }

                        return $q.reject(rejection);
                    }
                };
            });
    }
]
).run(function ($window, $rootScope, $location, $state, AuthService, $alert) {
    if ($window.localStorage.userId) $rootScope.username = $window.localStorage.username;
    if ($window.localStorage.userImg) $rootScope.user_img = $window.localStorage.userImg;
    if ($window.localStorage.user) $rootScope.user = JSON.parse($window.localStorage.user);
    if ($window.localStorage.networkId) $rootScope.networkId = $window.localStorage.networkId;
    console.log($window.localStorage.networkId);

    $rootScope.logout = function () {
        console.log('logout');
        if ($window.localStorage.user) $rootScope.user = JSON.parse($window.localStorage.user);
        console.log($rootScope.user.id);

        AuthService.logout($rootScope.user.id).then(
            function () {
                $window.localStorage.clear();
                $location.path('/login');
            },
            function (error) {
                $rootScope.error = error;
            }
        );
    };

    $rootScope
        .$on('$viewContentLoaded', function (event) {
            if (!$window.localStorage.token) {
                //$location.path('/login');
            }
        });
});

var services = angular.module('mqnaasApp.services', ['ngResource']);
var genericUrl = "rest/mqnaas/";
var graph;
