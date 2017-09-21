(function(window) {

	'use strict';

	window.<%= module %>.directive('home', function() {

		return {
			restrict: 'E',
			scope: true,
			templateUrl: 'templates/screens/home.html',
			controller: controller,
            controllerAs: 'screen'
		};

		function controller($scope, $element, $timeout) {

			var SCREEN_NAME = 'home';
			var element = $element [0];
			var active = false;

			element.classList.add('screen');

			if(history.state && history.state.screen === SCREEN_NAME) {

				activate(history.state);
			}

			window.addEventListener('statechange', function onStateChange(e) {

				var state = history.state;

				if(state && state.screen) {

					$timeout(function() {
						if(state.screen === SCREEN_NAME) {
							activate(state);
						} else if(active) {
							active = false;
							element.classList.remove('active');
						}
					});
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
