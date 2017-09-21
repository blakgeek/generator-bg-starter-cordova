'use strict';
var Base = require('yeoman-generator').Base;
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var fs = require('fs');

module.exports = Base.extend({

    constructor: function () {
        Base.apply(this, arguments);

        this.argument('overlay', {
            type: String,
            required: true,
            desc: 'Name of the overlay. Duh.'
        });
        this.overlay = _.camelCase(this.overlay);
    },
    prompting: function () {

        // Have Yeoman greet the user.
        this.log(yosay("Let's get this overlay created for you."));

        return this.prompt([]).then(function (props) {

        }.bind(this));
    },

    writing: {

        copy: function () {

            var generator = this;
            var context = {
                overlay: this.overlay,
                module: this.config.get('module'),
                directive: _.kebabCase(this.overlay),
                _: _s
            };
            generator.fs.copyTpl(
                generator.templatePath('overlay.scss'),
                generator.destinationPath('src/sass/overlays/_' + this.overlay + '.scss'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('overlay.html'),
                generator.destinationPath('src/templates/overlays/' + this.overlay + '.html'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('overlay.js'),
                generator.destinationPath('src/js/overlays/' + this.overlay + '.overlay.js'),
                context
            );
        },
        insert: function () {

            var indexHtml = this.destinationPath('src/index.html');
            var overlaysSass = this.destinationPath('src/sass/overlays/_overlays.scss');
            var tagName = _.kebabCase(this.overlay);
            var data, result;

            data = fs.readFileSync(indexHtml, 'utf8');
            result = data
                .replace(/([ \t]*)(<!-- add:overlay directives -->)/g, '$1$2\n$1<' + tagName + ' class="overlay"></' + tagName + '>')
                .replace(/([ \t]*)(<!-- add:overlays js -->)/g, '$1$2\n$1<script src="js/overlays/' + this.overlay + '.overlay.js"></script>');
            fs.writeFileSync(indexHtml, result, 'utf8');

            data = fs.readFileSync(overlaysSass, 'utf8');
            result = data.replace(/\/\/ add:overlays/g, "// add:overlays\n@import '" + this.overlay + "';");
            fs.writeFileSync(overlaysSass, result, 'utf8');

        }
    }
});
