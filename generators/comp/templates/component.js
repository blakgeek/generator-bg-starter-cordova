(function(window) {

    'use strict';

    window.<%= module %>.directive('<%= component %>', function() {

        return {
            restrict: 'E',
            scope: true,
            bindToController: {
            },
            templateUrl: 'templates/components/<%= component %>.html',
            controller: controller,
            controllerAs: 'comp'
        };

        function controller($element) {

            var self = this;
            var element = $element[0];
        }
    });
})(window);
