(function (window) {

    'use strict';

    window.bgComps.directive('selective', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                selective: "=",
                selectiveTitle: "@?",
                selectiveCloseText: "@?"
            },
            link: function ($scope, $element) {

                var self = this;
                var selectEl = $element[0];
                var parentEl = selectEl.parentNode;
                var popoverEl = document.createElement('div');
                var popoverContentEl = document.createElement('div');
                var wrapperEl = document.createElement('div');
                var cancelButton = document.createElement('div');
                var optionsEl = document.createElement('ul');
                var placeholder = selectEl.getAttribute('placeholder');
                var valuesToText = {};

                popoverEl.className = 'selective-popover';
                popoverEl.setAttribute('tabindex', '-1');

                popoverContentEl.className = 'selective-popover-content';
                popoverContentEl.setAttribute('tabindex', '-1');

                if ($scope.selectiveTitle) {
                    var popoverHeaderEl = document.createElement('div');
                    popoverHeaderEl.className = 'selective-header';
                    popoverHeaderEl.innerHTML = $scope.selectiveTitle;
                }

                cancelButton.className = 'selective-cancel';
                cancelButton.innerHTML = $scope.selectiveCloseText || 'Close';

                optionsEl.className = 'selective-options';

                wrapperEl.className = selectEl.className;
                wrapperEl.classList.add('selective');
                wrapperEl.dataset.display = placeholder;

                wrapperEl.setAttribute('tabindex', '0');

                [].forEach.call(selectEl.querySelectorAll('option'), function (opt) {

                    valuesToText[opt.value] = opt.text;
                    if (opt.hasAttribute('selected')) {
                        wrapperEl.dataset.value = opt.value;
                        wrapperEl.dataset.display = opt.text;
                    }
                    optionsEl.appendChild(makeOption(opt.text, opt.value));
                });

                if (popoverHeaderEl) {
                    popoverContentEl.appendChild(popoverHeaderEl);
                }
                popoverContentEl.appendChild(optionsEl);
                popoverContentEl.appendChild(cancelButton);
                popoverEl.appendChild(popoverContentEl);
                wrapperEl.appendChild(popoverEl);
                parentEl.replaceChild(wrapperEl, selectEl);

                wrapperEl.addEventListener('keydown', function (e) {

                    switch (e.keyCode) {
                        case 9:
                            e.stopPropagation();
                            break;
                        case 13:
                            e.stopPropagation();
                            wrapperEl.blur();
                            break;
                    }
                });

                wrapperEl.addEventListener('click', function () {
                    wrapperEl.focus();
                });

                wrapperEl.addEventListener('focus', function () {

                    wrapperEl.classList.add('open');
                });

                wrapperEl.addEventListener('blur', function () {

                    wrapperEl.classList.remove('open');
                });

                popoverEl.addEventListener('click', function (e) {

                    var target = e.target;

                    e.stopPropagation();

                    if (target.classList.contains('selective-option')) {
                        $timeout(function () {
                            $scope.selective = e.target.dataset.value;
                        });
                        wrapperEl.blur();
                    }
                });

                function makeOption(display, value) {

                    var li = document.createElement('li');
                    li.className = 'selective-option';
                    li.dataset.value = value;
                    li.innerHTML = display;

                    return li;
                }

                $scope.$watch('selectiveTitle', function (value) {

                    if (value && popoverHeaderEl) {
                        popoverHeaderEl.innerHTML = $scope.selectiveTitle;
                    }
                });

                $scope.$watch('selective', function (value) {

                    $scope.selective = value;
                    var optionEl = popoverEl.querySelector('[data-value="' + value + '"]');
                    if (optionEl) {
                        wrapperEl.dataset.value = value;
                        wrapperEl.dataset.display = optionEl.innerHTML;
                    } else {
                        delete wrapperEl.dataset.value;
                        wrapperEl.dataset.display = placeholder;
                    }
                });
            }
        };
    });
})(window);
