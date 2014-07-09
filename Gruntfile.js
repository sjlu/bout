module.exports = function (grunt) {
  grunt.initConfig({

    files: {
      less: ['public/assets/less/**/*.less']
    },

    /**
     * JS concatenation
     */
    concat: {
      options: {
        separator: ';'
      },
      client: {
        src: ['client/**/*.js'],
        dest: 'public/client.js'
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
          "public/styles.css": "public/stylesheets/style.less"
        }
      }
    },

    /**
     * Template compilation
     */
    template: {
      dist: {
        options: {
          wrap: {
            banner: '<script type="text/ng-template" id="#{0}">',
            footer: '</script>',
            inject: [{
              prop: 'src',
              rem: /^.*\//
            }],
          }
        },
        files: {
          'public/client.html': 'client/**/*.html',
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
  grunt.registerTask('default', ['less', 'template', 'concat']);
};
