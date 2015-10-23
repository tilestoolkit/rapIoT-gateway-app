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
                    src: 'src/js/*.js',
                    dest: 'dist/asset/js/'
                }]
            },
            modules_js: {
                files: [{
                    expand: true,
                    flatten:true,
                    src: 'src/js/modules/*/*.js',
                    dest: 'dist/asset/js/modules/'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['**/*.css', '!*.min.css'],
                    dest: 'dist/asset/css',
                    ext: '.min.css'
                },
                    {'dist/asset/css/theme/main.min.css': ['src/css/theme/main.css']},
                    {'dist/asset/css/theme/old/main.min.css': ['src/css/theme/old/main.css']},
                    {'dist/asset/css/pure/pure.min.css': ['bower_components/pure/pure.css']}
                ]
            }
        },
        pure_grids: {
            responsive: {
                dest: 'src/css/main-grid.css',

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
                    'src/css/pure/old/grids-responsive-old-ie.css':['bower_components/pure/grids-responsive.css'],
                    'src/css/pure/old/pure-old-ie.css':['bower_components/pure/pure.css']
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'src/css/theme/main.css': 'src/scss/main.scss',
                    'src/css/theme/old/main.css': 'src/scss/old/main.scss'
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "JST"
                },
                files: {
                    "src/js/templates.js": "src/views/templates/**/*.hbs"
                }
            }
        },
        assemble:{
            options:{
              layout:'page.hbs',
                layoutdir:'./src/views/layouts',
                partials:'./src/views/partials/**/*.hbs'
            },
            pages:{
                files:[{
                    cwd:'./src/views/pages/',
                    dest:'./dist/',
                    expand:true,
                    src:'**/*.hbs'
                }]
            }
        },
        watch: {
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass','cssmin']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['stripmq','uglify']
            },
            hs: {
                files: ['src/views/**/*.hbs'],
                tasks: ['handlebars']
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble');
    // Default task(s).
    grunt.registerTask('default', ['assemble','pure_grids','handlebars','stripmq','uglify','sass','cssmin']);

};