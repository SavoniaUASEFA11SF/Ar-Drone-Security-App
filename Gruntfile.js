'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    //Avoid any npm includes n stuff
    require('load-grunt-tasks')(grunt);

    // All upfront config goes in a massive nested object.
    grunt.initConfig({

        // You can also set the value of a key as parsed JSON.
        // Allows us to reference properties we declared in package.json.
        pkg: grunt.file.readJSON('package.json'),
        // Grunt tasks are associated with specific properties.
        // these names generally match their npm package name.
        mochaTest:{
            test:{
                options:{
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        watch:{
            js:{
                files:'**.js',
                tasks: ['mochaTest']
            },
            gruntfile:{
                files: ['Gruntfile.js']
            }
        }
    }); // The end of grunt.initConfig


    grunt.registerTask('serve', [
        'mochaTest',
        'watch'                 //Watch our stuff happen
    ]);
    grunt.registerTask('test', [
        'mochaTest'
    ]);
};