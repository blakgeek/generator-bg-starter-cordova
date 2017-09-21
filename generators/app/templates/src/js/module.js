(function(window) {

    'use strict';

    (function(window) {

        'use strict';

        window.bgComps = angular.module('bg-comps', []);
        window.<%= module %> = angular.module('<%= module %>', ['bg-comps']).constant('Config', _.defaults(window.config, {
            // add you default configuration values here
        })).constant('BuildInfo', _.defaults(window.buildInfo, {
            version: '0.0.0',
            sha: 'unknown'
        })).factory('authInterceptor', [
            '$rootScope', function($rootScope) {

                return {
                    // Add authorization token to headers
                    request: function(config) {
                        config.headers = config.headers || {};
                        if($rootScope.authToken) {
                            config.headers.Authorization = $rootScope.authToken;
                        }
                        return config;
                    }
                };
            }
        ]).filter('trust', [
            '$sce', function($sce) {
                return function(text) {
                    return $sce.trustAsHtml(text);
                };
            }
        ]).config([
            '$httpProvider', function($httpProvider) {

                $httpProvider.interceptors.push('authInterceptor');
            }
        ]).run([
            '$rootScope', 'Account', function($rootScope, Account) {

                if(!history.state || !history.state.screen) {

                    history.replaceState({
                        screen: 'home'
                    });
                }

                $rootScope.goBack = function() {
                    history.back();
                };

                document.addEventListener("backbutton", function () {

                    if (history.state && history.state.$r < 0) {
                        history.back();
                    } else {
                        navigator.Backbutton.goHome();
                    }
                    return true;
                }, false);

                $rootScope.logout = function() {

                    Account.logout();
                };

                $rootScope.toggleMenu = function() {

                    $rootScope.$emit('menu:open');
                };

                document.addEventListener("pause", function() {

                }, false);

                document.addEventListener("resume", function() {

                }, false);
            }
        ]);
    })(window);

})(window);
