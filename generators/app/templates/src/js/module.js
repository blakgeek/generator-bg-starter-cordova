(function(window) {

    'use strict';

    (function(window) {

        'use strict';

        window.<%= module %> = angular.module('<%= module %>', []).factory('authInterceptor', [
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

                    history.pushState({
                        screen: 'home'
                    });
                }

                $rootScope.goBack = function() {
                    history.back();
                };

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
