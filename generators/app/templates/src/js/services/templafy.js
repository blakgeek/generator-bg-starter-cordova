var Templafy = {
    tpl: function() {
        var str;
        if(arguments.length > 1) {
            str = [].join.call(arguments, '');
        } else {
            str = arguments[0];
        }
        return function(data) {
            return str.replace(/{[^{}]+}/g, function(key) {
                var k = key.replace(/[{}]+/g, "");
                return data.hasOwnProperty(k) ? data[k] : "";
            });
        }
    }
}
