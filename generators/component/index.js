'use strict';
var Base = require('yeoman-generator').Base;
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var fs = require('fs');

module.exports = Base.extend({

    constructor: function () {
        Base.apply(this, arguments);

        this.argument('component', {
            type: String,
            required: true,
            desc: 'Name of the component. Duh.'
        });
        this.component = _.camelCase(this.component);
    },
    prompting: function () {

        // Have Yeoman greet the user.
        this.log(yosay("Let's get this component created for you."));

        return this.prompt([]).then(function (props) {

        }.bind(this));
    },

    writing: {

        copy: function () {

            var generator = this;
            var context = {
                component: this.component,
                module: this.config.get('module'),
                directive: _.kebabCase(this.component),
                _: _s
            };
            generator.fs.copyTpl(
                generator.templatePath('component.scss'),
                generator.destinationPath('src/sass/components/_' + this.component + '.scss'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('component.html'),
                generator.destinationPath('src/templates/components/' + this.component + '.html'),
                context
            );
            generator.fs.copyTpl(
                generator.templatePath('component.js'),
                generator.destinationPath('src/js/components/' + this.component + '.component.js'),
                context
            );
        },
        insert: function () {

            var indexHtml = this.destinationPath('src/index.html');
            var componentsSass = this.destinationPath('src/sass/components/_components.scss');
            var data, result;

            data = fs.readFileSync(indexHtml, 'utf8');
            result = data
                .replace(/([ \t]*)(<!-- add:components js -->)/g, '$1$2\n$1<script src="js/components/' + this.component + '.component.js"></script>');
            fs.writeFileSync(indexHtml, result, 'utf8');

            data = fs.readFileSync(componentsSass, 'utf8');
            result = data.replace(/\/\/ add:components/g, "// add:components\n@import '" + this.component + "';");
            fs.writeFileSync(componentsSass, result, 'utf8');

        }
    }
});
