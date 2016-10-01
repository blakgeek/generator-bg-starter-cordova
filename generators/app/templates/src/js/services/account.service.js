(function(window) {

    'use strict';

    window.<%= module %>.factory('Account', [
        '$http', '$rootScope', '$q', function($http, $rootScope, $q) {

            var prefix = '<%= module %>-';
            var idField = 'username';
            var currentUser = null;
            var authKey = prefix + 'auth-' + config.env;
            var loggedInKey = prefix + 'loggedIn-' + config.env;
            $rootScope.authToken = localStorage.getItem(authKey);
            $rootScope.loggedIn = localStorage.getItem(loggedInKey) === 'true';
            if($rootScope.loggedIn) {
                getUserData();
            }

            return {

                login: login,
                getUser: getUser,
                logout: logout,
                signUp: signUp,
                isLoggedIn: isLoggedIn,
                getId: getId,
                needsTip: needsTip,
                disableTip: disableTip,
                updateUserData: updateUserData
            };

            function updateUserData() {

                if($rootScope.loggedIn) {
                    return getUserData()
                } else {
                    return $q.resolve();
                }
            }

            function needsTip(id) {
                return localStorage.getItem(prefix + 'hint-' + getId() + id) !== 'false';
            }

            function disableTip(id) {
                return localStorage.setItem(prefix + 'hint-' + getId() + id, false);
            }

            function getId() {

                return currentUser ? currentUser[idField] : null;
            }

            function isLoggedIn() {
                return $rootScope.loggedIn;
            }

            function signUp(user) {

                return $http.post(config.api.baseUrl + '/users', user).then(function(resp) {

                    $rootScope.loggedIn = true;
                    $rootScope.authToken = 'Bearer ' + resp.data.token;
                    localStorage.setItem(prefix + 'username', user.username);
                    localStorage.setItem(authKey, $rootScope.authToken);
                    localStorage.setItem(loggedInKey, true);

                    return getUserData();
                });
            }

            function logout() {

                currentUser = null;
                $rootScope.loggedIn = false;
                localStorage.removeItem(authKey);
                localStorage.setItem(loggedInKey, false);
            }

            function login(credentials) {

                return $http.post(config.auth.baseUrl + '/local', credentials).then(function(resp) {

                    $rootScope.loggedIn = true;
                    $rootScope.authToken = 'Bearer ' + resp.data.token;
                    localStorage.setItem(prefix + 'username', credentials.username);
                    localStorage.setItem(authKey, $rootScope.authToken);
                    localStorage.setItem(loggedInKey, true);

                    return getUserData();
                });
            }

            function getUserData() {
                return $http.get(config.api.baseUrl + '/users/me').then(function(resp) {
                    currentUser = resp.data;
                    return currentUser;
                });
            }

            function getUser() {
                if(!currentUser) {

                    return getUserData()
                } else {
                    return $q.resolve(currentUser);
                }
            }
        }
    ]);
})(window);
