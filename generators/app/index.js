'use strict';
var Base = require('yeoman-generator').Base;
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');
var cordova = require('cordova');

module.exports = Base.extend({

    constructor: function () {
        Base.apply(this, arguments);

        // This makes `appname` a required argument.
        this.argument('appname', {
            type: String, optional: true, default: this.appname
        });
        this.option('dryrun', {
            type: Boolean, default: false
        });
    },

    prompting: function () {

        // Have Yeoman greet the user.
        this.log(yosay("So you wanna create a Cordova app huh?\nCool, let's do this."));

        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: "What's the name?",
                default: _.camelCase(this.appname)
            }, {
                type: 'input',
                name: 'id',
                message: "What's the package name?",
                default: 'com.lazylimabean.app'
            }, {
                type: 'input',
                name: 'version',
                message: "What version is this?",
                default: '0.0.1'
            }, {
                type: 'input',
                name: 'module',
                message: "What's the angular module name?",
                default: _.camelCase(this.appname)
            }, {
                type: 'checkbox',
                name: 'screens',
                message: 'Which screens do you want to include?',
                choices: [
                    {
                        name: 'Login',
                        value: 'login'
                    },
                    {
                        name: 'Home',
                        value: 'home'
                    },
                    {
                        name: 'Settings',
                        value: 'settings'
                    }
                ]
            }
        ]).then(function (props) {

            var screens = {};
            this.screens = props.screens;
            props.screens.forEach(function (screen) {

                screens[screen] = true;
            });

            _.merge(this, props);

            this.props = _.merge(props, {
                screens: screens,
                appname: this.appname
            });

            this.config.set('module', this.module);
            this.config.save();

        }.bind(this));
    },

    writing: {

        cordova: function () {

            var done = this.async();
            var name = _.capitalize(_.camelCase(this.name));
            cordova.create('.', this.id, name, done);

        },

        copy: function () {

            var generator = this;
            var context = _.merge({}, this.props, {
                _: _s
            });
            var templates = ['Gruntfile.js', 'package.json', 'bower.json', 'src/index.html'];

            // copy static files
            this.fs.copy(
                [this.templatePath('**/*'), '!' + this.templatePath('**/screens/**/*')],
                this.destinationPath(),
                {
                    globOptions: {
                        dot: true
                    }
                }
            );

            // copy templates
            templates.forEach(function (file) {

                generator.fs.copyTpl(
                    generator.templatePath(file),
                    generator.destinationPath(file),
                    context
                );
            });
            this.fs.copyTpl(
                [this.templatePath('src/js/**/*'), '!' + this.templatePath('src/js/screens/**/*')],
                this.destinationPath('src/js'),
                context
            );
            this.screens.forEach(function (screen) {
                var js = 'src/js/screens/' + screen + '.screen.js';
                var sass = 'src/sass/screens/_' + screen + '.scss';
                var html = 'src/templates/screens/' + screen + '.html';
                generator.fs.copyTpl(generator.templatePath(js), generator.destinationPath(js), context);
                generator.fs.copyTpl(generator.templatePath(sass), generator.destinationPath(sass), context);
                generator.fs.copyTpl(generator.templatePath(html), generator.destinationPath(html), context);
            });
            generator.fs.copyTpl(generator.templatePath('src/sass/screens/_screens.scss'),
                generator.destinationPath('src/sass/screens/_screens.scss'), context);
        }
    },

    install: function () {

        if (!this.options.dryrun) {
            this.installDependencies();
            this.spawnCommandSync('git', ['init']);
            this.spawnCommandSync('git', ['remote', 'add', 'origin', this.props.ghUrl + '.git']);
            this.spawnCommandSync('git', ['add', '*']);
        }
    }
});
