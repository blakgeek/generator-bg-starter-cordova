(function (window) {
    
    window.history.rewind = function (to, state) {

        to = history.state.$r + (to || 0);
        // got back to the beginning of the history stack.
        // in order for this to work we'll need to track the states so we know how far to go back from any given state
        if (history.state && to < 0) {
            history.go(to);
            window.addEventListener('statechange', onStateChange, false);
        } else if (state) {
            history.replaceState(state)
        }

        function onStateChange() {

            window.removeEventListener('statechange', onStateChange);
            if (state) {
                history.replaceState(state)
            }
        }
    };

    window.history.pushState = function (state, title, path) {


        state.$r = history.state ? history.state.$r - 1 : 0;
        History.prototype.pushState.call(this, state, title || '', path);
        var e = new CustomEvent('statechange', {
            detail: state
        });
        window.dispatchEvent(e);

        return window.history;

    };

    window.history.replaceState = function (state, title, path) {

        state.$r = history.state ? history.state.$r : 0;
        History.prototype.replaceState.call(this, state, title || '', path);
        var e = new CustomEvent('statechange', {
            detail: state
        });
        window.dispatchEvent(e);

        return window.history;
    };

    window.addEventListener('popstate', function (e) {

        var event = new CustomEvent('statechange', {
            detail: e.state
        });
        window.dispatchEvent(event);
    }, false);

})(window);
