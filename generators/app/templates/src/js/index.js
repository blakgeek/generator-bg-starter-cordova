document.addEventListener('deviceready', function() {

    FastClick.attach(document.body);

    if(cordova.plugins && cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);
        // This event fires when the keyboard will be shown

        window.addEventListener('native.keyboardshow', function keyboardShowHandler(e) {
            if(cordova.platformId === 'ios') {
                document.body.style.height = 'calc(100% - ' + e.keyboardHeight + 'px)';
            }
            if(document.activeElement) {
                document.activeElement.scrollIntoViewIfNeeded();
            }
            document.documentElement.classList.add('keyboard-open');
        });

        // This event fires when the keyboard will hide

        window.addEventListener('native.keyboardhide', function keyboardHideHandler(e) {
            if(cordova.platformId === 'ios') {
                document.body.style.height = null;
            }
            document.documentElement.classList.remove('keyboard-open');
        });
    }

    if(!history.state) {

    }

    angular.bootstrap(document, ['<%= module %>']);

}, false);
