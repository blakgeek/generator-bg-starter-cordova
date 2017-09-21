var shell = require('shelljs');
var path = require('path');
var fs = require('fs');

module.exports = function(context) {

    if (!forPlatform('android')) return;

    var rootPath = context.opts.projectRoot;
    var srcPath = path.join(rootPath, 'build-extras.gradle');
    var destPath = path.join(rootPath, 'platforms', 'android', 'build-extras.gradle');
    var fileExists = fs.existsSync(srcPath);

    if (fileExists) {
        console.log("Copying build extras");
        shell.cp(srcPath, destPath);
    }

    function forPlatform(platform) {

        return context.opts.platforms.indexOf(platform) > -1;
    }
}
