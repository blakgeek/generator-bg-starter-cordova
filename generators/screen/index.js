'use strict';
var Base = require('yeoman-generator').Base;
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var cordova = require('cordova');
var fs = require('fs');

module.exports = Base.extend({

    constructor: function () {
        Base.apply(this, arguments);

        this.argument('screen', {
            type: String,
            required: true,
            desc: 'Name of the screen. Duh.'
        });
        this.screen = _.camelCase(this.screen);
    },
    prompting: function () {

        // Have Yeoman greet the user.
        this.log(yosay("Let's get this screen created for you."));

        return this.prompt([]).then(function (props) {

        }.bind(this));
    },

    writing: {

        copy: function () {

            var generator = this;
            var context = {
                screen: this.screen,
                module: this.config.get('module'),
                directive: _.kebabCase(this.screen),
                _: _s
            };
            generator.fs.copyTpl(
                generator.templatePath('screen.scss'),
                generator.destinationPath('src/sass/screens/_' + this.screen + '.scss'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('screen.html'),
                generator.destinationPath('src/templates/screens/' + this.screen + '.html'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('screen.js'),
                generator.destinationPath('src/js/screens/' + this.screen + '.screen.js'),
                context
            );
        },
        insert: function () {

            var indexHtml = this.destinationPath('src/index.html');
            var screensSass = this.destinationPath('src/sass/screens/_screens.scss');
            var directive = _.kebabCase(this.screen);
            var data, result;

            data = fs.readFileSync(indexHtml, 'utf8');
            result = data
                .replace(/([ \t]*)(<!-- add:screen directives -->)/g, '$1$2\n$1<' + directive + 'class="screen"></' + directive + '>')
                .replace(/([ \t]*)(<!-- add:screens js -->)/g, '$1$2\n$1<script src="js/screens/' + this.screen + '.screen.js"></script>');
            fs.writeFileSync(indexHtml, result, 'utf8');

            data = fs.readFileSync(screensSass, 'utf8');
            result = data.replace(/\/\/ add:screens/g, "// add:screens\n@import '" + this.screen + "';");
            fs.writeFileSync(screensSass, result, 'utf8');

        }
    }
});
