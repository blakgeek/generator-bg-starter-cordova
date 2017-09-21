(function(window) {

    'use strict';

    window.<%= module %>.directive('<%= screen %>', function() {

        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'templates/screens/<%= screen %>.html',
            controller: controller,
            controllerAs: 'screen'
        };

        function controller($element, $timeout) {

            var self = this;
            var element = $element[0];
            var SCREEN_NAME = '<%= screen %>';
            var active = false;

            if(history.state && history.state.screen === SCREEN_NAME) {

                activate(history.state);
            }

            window.addEventListener('statechange', function onStateChange(e) {

                var state = history.state;

                if(state && state.screen) {

                    if(state.screen === SCREEN_NAME) {
                        activate(state);
                    } else if(active) {
                        active = false;
                        element.classList.remove('active');
                    }
                }
            });

            function activate(state) {

                if(active) {
                    return;
                }

                element.classList.add('active');
                active = true;
            }
        }
    });
})(window);
