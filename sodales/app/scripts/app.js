'use strict';

/**
 * @ngdoc overview
 * @name mqnaasApp
 * @description
 * # mqnaasApp
 *
 * Main module of the application.
 */

angular.module('mqnaasApp', ['ui.router', 'ngSanitize', 'mqnaasApp.config', 'mqnaasApp.controllers', 'mqnaasApp.directives', 'mqnaasApp.services', 'smart-table', 'mgcrea.ngStrap', 'pascalprecht.translate', 'angularTranslateApp', 'ngTagsInput', 'cb.x2js', 'LocalStorageModule'])

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
                            templateUrl: 'views/sodales/0_home.html',
                            controller: 'SodalesHomeCtrl'
                        }
                    }
                })

            //sodales
            .state('root.monitoring', {
                    url: '/monitoring',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/1_statistics.html',
                            controller: 'SodalesMonitoringController'
                        }
                    }
                }).state('root.cfm', {
                    url: '/cfm',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/CFM-OAM.html',
                            controller: 'SodalesMonitoringController'
                        }
                    }
                }).state('root.history', {
                    url: '/openaccess/history',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/2_1_openAccess_history.html',
                            controller: 'SodalesHistoryController'
                        }
                    }
                }).state('root.vimgt', {
                    url: '/openaccess/vimgt',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/2_0_openAccess.html',
                            controller: 'SodalesOpenaccessDashCtrl'
                        }
                    }
                }).state('root.vicreation', {
                    url: '/openaccess/vicreation',
                    views: {
                        'master@root': {
                            templateUrl: 'views/createVI/index.html',
                            controller: 'listVIController'
                        }
                    }
                }).state('root.mgt', {
                    url: '/mgt',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/0_1_mgt_pi.html',
                            controller: 'sodalesPiMgtCtrl'
                        }
                    }
                }).state('root.resources', {
                    url: '/mgt/resources',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/0_2_mgt_res.html',
                            controller: 'sodalesPiResourcesCtrl'
                        }
                    }
                }).state('root.viList', {
                    url: '/viList',
                    views: {
                        'master@root': {
                            templateUrl: 'views/createVI/index.html',
                            controller: 'listVIController'
                        }
                    }
                }).state('root.editVIRequest', {
                    url: '/editVIRequest/:id',
                    views: {
                        'master@root': {
                            templateUrl: 'views/createVI/editor.html',
                            controller: 'editVIController'
                        }
                    }
                })
                //SP
                .state('root.spInfo', {
                    url: '/spInfo',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/sp/spInfo.html',
                            controller: 'spController'
                        }
                    }
                }).state('root.spVIInfo', {
                    url: '/spVIInfo/:id',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/sp/spVIInfo.html',
                            controller: 'spVIController'
                        }
                    }
                }).state('root.spStats', {
                    url: '/spStats/:id',
                    views: {
                        'master@root': {
                            //templateUrl: 'views/sodales/sp/spStats.html',
                            templateUrl: 'views/sodales/sp/spStats.html',
                            controller: 'spStatsController'
                        }
                    }
                }).state('root.settings', {
                    url: '/settings',
                    views: {
                        'master@root': {
                            templateUrl: 'views/sodales/settings.html',
                            controller: 'settingsController'
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

                        if (Math.floor(Date.now() / 1000) > $window.localStorage.expiration)
                            $rootScope.logout();
                        else if (status === 401 && $window.localStorage.token !== null && $window.localStorage.token !== undefined) {
                            $location.path('/dashboard');
                        } else if (status === 401) {
                            $location.path('/login');
                        } else {
                            $rootScope.error = method + ' on ' + url + ' failed with status ' + status;
                        }

                        return $q.reject(rejection);
                    }
                };
            });


}
]
).run(function ($window, $rootScope, $location, $state, $translate, AuthService, UserStatisticsService, $alert) {
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
