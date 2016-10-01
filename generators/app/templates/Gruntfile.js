module.exports = function (grunt) {

    var libxml = require('libxmljs');
    require('load-grunt-tasks')(grunt);

    var config = {
        env: 'dev',
        dest: 'www'
    };

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        config: config,
        clean: {
            www: ['www/*', '!www/lib/**'],
            dist: ['dist/**', '.tmp/**']
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watchMobile: {
                tasks: ['cordovacli:runBrowser', 'watch:mobileAll', 'watch:mobileSass']
            }
        },
        watch: {
            sass: {
                files: 'src/sass/**/*.scss',
                tasks: 'sass:dev'
            },
            mobileAll: {
                files: ['src/**/*', '!src/sass/**/*.{scss,sass}', '!src/puzzles/**', 'www/lib/**'],
                tasks: ['copy:src', 'wiredep', 'cordovacli:prepare']
            },
            mobileSass: {
                files: 'src/sass/**/*.scss',
                tasks: ['sass', 'cordovacli:prepare']
            }
        },
        sass: {
            www: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/sass',
                        src: '**/*.scss',
                        ext: '.css',
                        dest: 'www/css'
                    }
                ]
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'platforms/browser/www',
                src: ['**', '!sass/**'],
                dest: 'dist'
            },
            src: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**', '!sass/**'],
                        dest: '<%%= config.dest %>'
                    }, {
                        src: 'config/<%%= config.env %>.js',
                        dest: '<%%= config.dest %>/js/config.js'
                    }
                ]
            },
            configXml: {
                src: 'config.xml',
                dest: 'config.xml',
                options: {
                    process: function (content) {

                        var semver = grunt.config.get('pkg.version');
                        var parts = semver.split('.');
                        var appVersion = parts[0] + '.' + parts[1];
                        var androidVersion = String(+parts[0] * 1000000 + +parts[1] * 1000 + +parts[2]);
                        var xml = libxml.parseXmlString(content);
                        var widget = xml.get('/w:widget', {
                            'w': 'http://www.w3.org/ns/widgets'
                        }).attr({
                            'version': appVersion,
                            'android-versionCode': androidVersion,
                            'ios-CFBundleVersion': semver
                        });

                        return xml.toString();
                    }
                }
            }
        },
        wiredep: {
            www: {
                src: 'www/*.html',
                exclude: ['lib/ionicons/']
            }
        },
        filerev: {
            dist: {
                files: [
                    {
                        src: ['dist/js/*.js', 'dist/css/*.css']
                    }
                ]
            }
        },
        useminPrepare: {
            dist: {
                src: ['dist/**/*.html']
            }
        },
        usemin: {
            html: ['dist/**/*.html'],
            options: {
                type: 'html',
                assetsDirs: ['dist', 'dist/css', 'dist/js', 'css', 'js']
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'dist.zip'
                },
                files: [
                    {cwd: 'dist', src: ['**'], expand: true}
                ]
            }
        },
        cordovacli: {
            options: {
                path: '.',
                cli: 'cordova'
            },
            prepare: {
                options: {
                    command: 'prepare'
                }
            },
            runBrowser: {
                options: {
                    command: 'run',
                    platforms: ['browser']
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'www/js/dependencies.js'
            }
        },
        bump: {
            options: {
                push: false,
                commitFiles: ['-a'],
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg']
            }
        }
    });

    grunt.registerTask('prepare', [
        'clean',
        'copy:src',
        'sass',
        'wiredep',
        'cordovacli:prepare'
    ]);

    grunt.registerTask('serve', [
        'prepare',
        'concurrent:watchMobile'
    ]);

    grunt.registerTask('dist', [
        'release',
        'copy:dist',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'filerev',
        'usemin',
        'compress'
    ]);

    grunt.registerTask('release', function (platform, type) {

        config.env = 'prod';
        grunt.task.run([
            type ? 'bump-only:' + type : 'bump-only',
            'copy:configXml',
            'prepare',
            'bump-commit'
        ]);
    });
};
