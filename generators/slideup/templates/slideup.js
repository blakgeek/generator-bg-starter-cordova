(function(window) {

    'use strict';

    window.<%= module %>.directive('<%= slideup %>', function() {

        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'templates/slideups/<%= slideup %>.html',
            controller: controller,
            controllerAs: 'slideup'
        };

        function controller($element, $timeout) {

            var self = this;
            var element = $element[0];
            var SLIDEUP_ID = '<%= slideup %>';
            var active = false;


            if(history.state && history.state.slideup === SLIDEUP_ID) {

                activate(history.state);
            }

            window.addEventListener('statechange', function onStateChange(e) {

                var state = history.state;

                if(state && state.slideup) {

                    if(state.slideup === SLIDEUP_ID) {
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
