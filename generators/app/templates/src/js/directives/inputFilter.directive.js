(function (window) {

    window.bgComps.directive('filterInput', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {

                    var regex = new RegExp(attrs.filterInput.replace(/\\/g, '\\'), 'g');
                    var transformedInput = inputValue.replace(regex, '');

                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });

})(window);
