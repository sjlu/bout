var path = require('path');
var config = require('./lib/config');

module.exports = function (grunt) {
  grunt.initConfig({

    /**
     * JS concatenation & minification
     */
    concat: {
      default: {
        src: ['client/**/*.js'],
        dest: 'public/build/client/app.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      deploy: {
        files: {
          'public/build/client/app.js': 'public/build/client/app.js'
        }
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
      },
      deploy: {
        options: {
          cleancss: true
        },
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
      default: {
        src: ['client/**/*.jade'],
        dest: 'public/build/client/templates.js'
      },
      deploy: {
        options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        },
        src: ['client/**/*.jade'],
        dest: 'public/build/client/templates.js'
      }
    },

    /**
     * S3 Deployments
     */
    s3: {
      options: {
        key: config.AWS_KEY,
        secret: config.AWS_SECRET,
        bucket: config.AWS_CDN_BUCKET,
        access: 'public-read'
      },
      deploy: {
        upload: [{
          src: "public/bower_components/**/*",
          dest: config.GITREV + "/bower_components/",
        }, {
          src: "public/build/**/*",
          dest: config.GITREV + "/build/",
        }, {
          src: "public/images/**/*",
          dest: config.GITREV + "/images/",
        }]
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
        tasks: ['less:default']
      },
      js: {
        files: ['client/**/*.js'],
        tasks: ['concat:default']
      },
      html: {
        files: ['client/**/*.jade'],
        tasks: ['html2js:default']
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
  grunt.registerTask('default', ['less:default', 'html2js:default', 'concat:default']);
  grunt.registerTask('deploy', ['less:deploy', 'html2js:deploy', 'concat:default', 'uglify:deploy', 's3:deploy']);
};
