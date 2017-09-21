'use strict';
var Base = require('yeoman-generator').Base;
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var fs = require('fs');

module.exports = Base.extend({

    constructor: function () {
        Base.apply(this, arguments);

        this.argument('service', {
            type: String,
            required: true,
            desc: 'Name of the service. Duh.'
        });
        // this.service = _.camelCase(this.service);
    },
    prompting: function () {

        // Have Yeoman greet the user.
        this.log(yosay("Let's get this service created for you."));

        return this.prompt([]).then(function (props) {

        }.bind(this));
    },

    writing: {

        copy: function () {

            var generator = this;
            var context = {
                service: this.service,
                module: this.config.get('module'),
                directive: _.kebabCase(this.service),
                _: _s
            };
            generator.fs.copyTpl(
                generator.templatePath('service.js'),
                generator.destinationPath('src/js/services/' + _.camelCase(this.service) + '.service.js'),
                context
            );
        },
        insert: function () {

            var indexHtml = this.destinationPath('src/index.html');
            var data, result;

            data = fs.readFileSync(indexHtml, 'utf8');
            result = data
                .replace(/([ \t]*)(<!-- add:services js -->)/g, '$1$2\n$1<script src="js/services/' + _.camelCase(this.service) + '.service.js"></script>');
            fs.writeFileSync(indexHtml, result, 'utf8');

        }
    }
});
