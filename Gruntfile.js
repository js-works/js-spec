module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['build/*', 'dist/*'],
            }
        },
        ts: {
            default : {
                src: ['**/*.ts', '!node_modules/**/*.ts']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: [
                        'node_modules/babel-polyfill/dist/polyfill.min.js'
                    ],
                    bail: true
                },
                src: ['build/src/**/*.ts']
            }
        },
        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    out: './dist/docs',
                    name: 'my-project',
                    target: 'es6'
                },
                src: ['./src/main/**/*']
            }
        },
        browserify: {
            js: {
                src: 'build/src/js-spec.ts',
                dest: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                ASCIIOnly: true,
                banner: '/*\n'
                        + ' <%= pkg.name %> v<%= pkg.version %> -'
                        + ' <%= grunt.template.today("yyyy-mm-dd") %>\n'
                        + ' Homepage: <%= pkg.homepage %>\n'
                        + ' License: <%= pkg.license %>\n'
                        + '*/\n'
            },
            js: {
                src: ['dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.js'],
                dest: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.min.js'
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                files: [{
                    src: ['dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.min.js'],
                    dest: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.min.js.gz'
                }, {
                    src: ['node_modules/babel-polyfill/dist/polyfill.min.js'],
                    dest: 'dist/v<%= pkg.version %>/polyfill.min.js.gz'
                }]
            }
        },
        copy: {
            jsspec1: {
                src: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.js',
                dest: 'dist/js-spec/js-spec.js'
            },
            jsspec2: {
                src: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.min.js',
                dest: 'dist/js-spec/js-spec.min.js'
            },
            jsspec3: {
                src: 'dist/v<%= pkg.version %>/js-spec-<%= pkg.version %>.min.js.gz',
                dest: 'dist/js-spec/js-spec.min.js.gz'
            },
            polyfill1: {
                src: 'node_modules/babel-polyfill/dist/polyfill.min.js',
                dest: 'dist/v<%= pkg.version %>/polyfill.min.js'
            },
            polyfill2: {
                src: 'node_modules/babel-polyfill/dist/polyfill.min.js',
                dest: 'dist/js-spec/polyfill.min.js'
            },
            polyfill3: {
                src: 'dist/v<%= pkg.version %>/polyfill.min.js.gz',
                dest: 'dist/js-spec/polyfill.min.js.gz'
            },
            docs: {
                cwd: 'dist/v<%= pkg.version %>/docs',
                src: '**',
                dest: 'dist/js-spec/docs/',
                expand: true
            }
        },
        watch: {
            js: {
                options: {
                    spawn: true,
                },
                files: ['src/**/*.ts'],
                tasks: ['test']
                //tasks: ['esdoc']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-esdoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typedoc');

    grunt.registerTask('compile', ['ts']);
    grunt.registerTask('test', ['ts', 'mochaTest']);
    grunt.registerTask('doc', ['ts', 'mochaTest', 'typedoc']);
    grunt.registerTask('dist', ['clean', 'ts', 'mochaTest', 'typedoc', 'browserify', 'uglify', 'compress', 'copy']);
    grunt.registerTask('default', ['dist']);
};
