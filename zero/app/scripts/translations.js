'use strict';

angular.module('angularTranslateApp', ['pascalprecht.translate'])
    .config(function ($translateProvider, $translatePartialLoaderProvider) {

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'languages/{lang}/{part}.json'
        });

        $translatePartialLoaderProvider.addPart('common');
        $translatePartialLoaderProvider.addPart('login');
        $translatePartialLoaderProvider.addPart('nodes');
        $translatePartialLoaderProvider.addPart('profile');
        $translatePartialLoaderProvider.addPart('sidebar');
        $translatePartialLoaderProvider.addPart('tenants');

        $translateProvider.fallbackLanguage('en');
        $translateProvider
            .registerAvailableLanguageKeys(['en', 'ca'])
            .preferredLanguage('en');
    });