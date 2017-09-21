(function(window) {

    'use strict';

    window.<%= module %>.directive('<%= overlay %>', function() {

        return {
            restrict: 'E',
            scope: true,
            bindToController: {
            },
            templateUrl: 'templates/overlays/<%= overlay %>.html',
            controller: controller,
            controllerAs: 'overlay'
        };


        function controller($element) {

            var self = this;
            var element = $element[0];
            const OVERLAY_ID = '<%= overlay %>';
            var deferred;

            self.cancel = function () {
                
                reject();
                history.back();
            };

            if (isMatch(history.state)) {

                open(history.state);
            }

            window.addEventListener('statechange', function onStateChange(e) {

                var state = history.state;

                if (isMatch(state)) {
                    open(state);
                } else {
                    self.crew = {};
                    element.classList.remove('open', 'saving');
                }
            });

            window.addEventListener('showOverlay', function (e) {

                var overlay = e.overlay;
                
                if (overlay.id === OVERLAY_ID) {
                    deferred = overlay.deferred;
                    // optionally use overlay.data
                }
            });

            function open(state) {

                element.classList.add('open');
            }

            function reject(value) {
                if(deferred) {
                    deferred.reject(value);
                }
            }

            function resolve(value) {
                if(deferred) {
                    deferred.resolve(value);
                }
            }

            function isMatch(state) {
                return state && state.$overlay && state.$overlay.id === OVERLAY_ID;
            }
        }
    });
})(window);
