var path = require('path');

module.exports = function (grunt) {
  grunt.initConfig({

    /**
     * JS concatenation
     */
    concat: {
      client: {
        src: ['client/**/*.js'],
        dest: 'public/build/client/app.js'
      }
    },

    /**
     * LESS compilation
     * If you are creating any new files they
     * should all be referenced in base.less
     * and not here as this is only a compiler.
     */
    less: {
      options: {
        paths: [
          'public/stylesheets/'
        ]
      },
      default: {
        files: {
          "public/build/styles.css": "public/stylesheets/style.less"
        }
      }
    },

    /**
     * Template compilation
     */
    html2js: {
      options: {
        rename: function(name) {
          return path.basename(name).replace('.jade', '.tmpl');
        },
        module: 'templates'
      },
      client: {
        src: ['client/**/*.jade'],
        dest: 'public/build/client/templates.js'
      }
    },

    /**
     * Watch
     * Watch the filesystem and auto-run these commands
     */
    watch: {
      options: {
        debounceDelay: 100,
        spawn: false,
        livereload: true
      },
      less: {
        files: ['public/stylesheets/**/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['client/**/*.js'],
        tasks: ['concat']
      },
      html: {
        files: ['client/**/*.jade'],
        tasks: ['html2js']
      }
    }

  });

  /**
   * Plugins
   * We load the necessary Grunt plugins that
   * help us run our compilation. You will also
   * need to reference this in package.json
   */
  require("matchdep").filterDev([
    "grunt-*"
  ]).forEach(grunt.loadNpmTasks);

  /*
   * Tasks
   */
  grunt.registerTask('default', ['less', 'html2js', 'concat']);
};
