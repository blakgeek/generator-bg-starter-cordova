(function (window) {

    'use strict';

    window.bgComps.directive('popups', function () {

        return {
            restrict: 'E',
            scope: true,
            bindToController: {},
            templateUrl: 'templates/components/popups.html',
            controller: controller,
            controllerAs: 'popups'
        };

        function controller($element, $timeout, $sce) {

            var self = this;
            var element = $element[0];
            var notificationPopup = element.querySelector('.popup-notification');

            self.close = close;

            document.addEventListener('popupshow:notification', function (e) {

                element.classList.add('active');

                $timeout(function() {

                    self.notification = e.data;
                    self.notification.content = $sce.trustAsHtml(self.notification.content.replace(/\n/g, '<br>'));
                    $timeout(function() {
                        notificationPopup.classList.add('open');
                    });
                });
            });

            document.addEventListener('popuphide', close);

            window.addEventListener('statechange', close);

            function close() {

                notificationPopup.classList.remove('open');
                element.classList.remove('active');
            }
        }
    }).service('Popups', function () {


        return {
            show: show,
            notify: notify,
            error: error,
            danger: error,
            warning: warning,
            positive: positive,
            info: info
        };

        function error(data) {
            show('notification', _.defaults(_.merge(data, {
                type: 'error'
            }), {
                actions: [
                    {
                        text: data.actionText || 'Got It',
                        action: data.action || angular.noop
                    }
                ]
            }));
        }

        function warning(data) {
            show('notification', _.defaults(_.merge(data, {
                type: 'warning'
            }), {
                actions: [
                    {
                        text: data.actionText || 'Got It',
                        action: data.action || angular.noop
                    }
                ]
            }));
        }

        function info(data) {
            show('notification', _.defaults(_.merge(data, {
                type: 'info'
            }), {
                actions: [
                    {
                        text: data.actionText || 'Got It',
                        action: data.action || angular.noop
                    }
                ]
            }));
        }

        function positive(data) {
            show('notification', _.defaults(_.merge(data, {
                type: 'positive'
            }), {
                actions: [
                    {
                        text: data.actionText || 'Got It',
                        action: data.action || angular.noop
                    }
                ]
            }));
        }

        function notify(data) {
            show('notification', data);
        }

        function show(type, data) {

            var event = new Event('popupshow:' + type);
            event.data = data;
            document.dispatchEvent(event);
        }
    });
})(window);
