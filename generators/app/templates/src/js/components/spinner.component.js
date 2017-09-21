(function(window) {

    'use strict';

    window.bgComps.directive('spinner', function() {

        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                showIf: '=?'
            },
            templateUrl: 'templates/components/spinner.html',
            controller: controller,
            controllerAs: 'comp'
        };

        function controller($scope, $element) {

            var self = this;
            var element = $element[0];

            $scope.$watch(function() {
                return self.showIf
            }, function(show) {

                if(show) {
                    element.classList.add('open');
                } else {
                    element.classList.remove('open');
                }
            })
        }
    });
})(window);
