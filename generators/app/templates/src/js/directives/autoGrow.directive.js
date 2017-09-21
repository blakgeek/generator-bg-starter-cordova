(function (window) {

    'use strict';

    window.bgComps.directive('autoGrow', function () {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $element, $attrs) {

                var element = $element[0];
                var singleLine = element.getAttribute('ag-single-line') === null ? false : element.getAttribute('ag-single-line') !== 'false';

                element.setAttribute('rows', '1');

                element.addEventListener('input', function () {
                    // this.style.padding = 0;
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                    // this.style.padding = '';
                });

                if (singleLine) {
                    element.addEventListener('keypress', function (e) {

                        if (e.keyCode === 13) {
                            e.preventDefault();
                            return false;
                        }
                    }, false);
                }
            }
        };
    });
})(window);
