module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('bower.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            asset_js: {
                files: [{
                    expand: true,
                    flatten:true,
                    src: 'asset/js/*.js',
                    dest: 'build/public/js/'
                }]
            },
            modules_js: {
                files: [{
                    expand: true,
                    src: 'modules/*/*.js',
                    dest: 'build/public/js/'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'asset/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/public/css',
                    ext: '.min.css'
                },
                    {'build/public/css/theme/main.min.css': ['build/public/css/theme/main.css']},
                    {'build/public/css/theme/old/main.min.css': ['build/public/css/theme/old/main.css']},
                    {'build/public/css/pure.min.css': ['bower_components/pure/pure.css']}
                ]
            }
        },
        pure_grids: {
            responsive: {
                dest: 'asset/css/main-grid.css',

                options: {
                    units: 12, // 12-column grid

                    mediaQueries: {
                        sm: 'screen and (min-width: 35.5em)', // 568px
                        md: 'screen and (min-width: 48em)',   // 768px
                        lg: 'screen and (min-width: 64em)',   // 1024px
                        xl: 'screen and (min-width: 80em)'    // 1280px
                    }
                }
            }
        },
        stripmq: {
            //Viewport options
            options: {
                width: 1000,
                type: 'screen'
            },
            all: {
                files: {
                    // Takes the input file `grid.css`, and generates `grid-old-ie.css`.
                    'build/public/css/pure/grids-responsive-old-ie.css':['bower_components/pure/grids-responsive.css'],
                    'build/public/css/pure/pure-old-ie.css':['bower_components/pure/pure.css'],
                    'build/public/css/pure/side-menu-old-ie.css':['asset/css/pure/side-menu-old-ie.css']

                    // Takes the input file `app.css`, and generates `app-old-ie.css`.
                    //'asset/css/app-old-ie.css': ['asset/css/app.css']
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'build/public/css/theme/main.css': 'asset/scss/main.scss',
                    'build/public/css/theme/old/main.css': 'asset/scss/old/main.scss'
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "JST"
                },
                files: {
                    "path/to/result.js": "path/to/source.hbs",
                    "path/to/another.js": ["path/to/sources/*.hbs", "path/to/more/*.hbs"]
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-pure-grids');
    grunt.loadNpmTasks('grunt-stripmq');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    // Default task(s).
    grunt.registerTask('default', ['pure_grids','stripmq','uglify','sass','cssmin']);

};