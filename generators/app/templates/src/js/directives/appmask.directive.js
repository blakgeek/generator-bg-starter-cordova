(function(window) {

    'use strict';

    window.<%= module %>.directive('appmask', function() {

        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'templates/components/appmask.html',
            controller: ['$element', '$attrs', '$scope', '$rootScope', '$timeout', controller]
        };

        function controller($element, $attrs, $scope, $rootScope, $timeout) {

            var element = $element[0];
            var contentEl = element.querySelector('.mask-content');
            var currentId;

            $rootScope.$on('mask', function(e, options) {
                options = options || {};

                currentId = options.id;
                if(options.modal === false) {
                    element.classList.remove('modal');
                } else {
                    element.classList.add('modal');
                }
                if(options.opaque) {
                    element.classList.add('mask-opaque');
                } else {
                    element.classList.remove('mask-opaque');
                }
                contentEl.innerHTML = options.message || '';
                element.classList.add('active');
            });

            $rootScope.$on('unmask', function(e, id) {

                if(currentId === id) {
                    element.classList.remove('active');
                    element.classList.remove('modal');
                    element.classList.remove('mask-opaque');
                }
            });
        }
    });
})(window);
