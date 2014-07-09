module.exports = function (grunt) {
  grunt.initConfig({

    files: {
      less: ['public/assets/less/**/*.less']
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
          "public/styles.css": "public/stylesheets/style.less"
        }
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
  grunt.registerTask('default', ['less']);
};
