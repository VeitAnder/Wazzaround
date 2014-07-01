// Generated on 2014-01-09 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

      // Project settings
      yeoman: {
        // configurable paths
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
      },

      pkg: grunt.file.readJSON('package.json'),

      // Watches files for changes and runs tasks based on the changed files
      watch: {
        js: {
          files: ['<%= yeoman.app %>/scripts/**/*.js'],
          tasks: ['newer:jshint:all'],
          options: {
            livereload: true
          }
        },
        jsTest: {
          files: ['test/spec/{,*/}*.js'],
          tasks: ['newer:jshint:test', 'karma']
        },
        sass: {
          files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
          tasks: ['sass:server']
        },
        gruntfile: {
          files: ['Gruntfile.js']
        },
        templates: {
          files: ['<%= yeoman.app %>/views/**/{,*/}*.tpl.html', '<%= yeoman.app %>/views/**/{,*/}*.html'],
          tasks: ['html2js']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= yeoman.app %>/{,*/}*.html',
            '<%= yeoman.app %>/styles/{,*/}*.css',
            '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      },

      // The actual grunt server settings
      connect: {
        options: {
          port: 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: '0.0.0.0',
          livereload: 35729,
          middleware: function (connect, options) {
            // checkout https://github.com/gruntjs/grunt-contrib-connect/issues/30 for discussion on this implementation
            var middlewares = [];
            var directory = options.directory || options.base[options.base.length - 1];

            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            options.base.forEach(function (base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            // Handle 404
            middlewares.push(function (req, res, next) {
              res.end(grunt.file.read(options.base[options.base.length - 1] + '/index.html'));
            });
            return middlewares;
          }
        },
        livereload: {
          options: {
            open: true,
            base: [
              '.tmp',
              '<%= yeoman.app %>'
            ]
          }
        },
        test: {
          options: {
            port: 9001,
            base: [
              '.tmp',
              'test',
              '<%= yeoman.app %>'
            ]
          }
        },
        dist: {
          options: {
            base: [
              '<%= yeoman.dist %>'
            ]
          }
        }
      },

      // Make sure code styles are up to par and there are no obvious mistakes
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        all: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '!<%= yeoman.app %>/scripts/modelizer/{,*/}*.js'
        ],
        test: {
          options: {
            jshintrc: 'test/.jshintrc'
          },
          src: ['test/spec/{,*/}*.js']
        }
      },

      // Empties folders to start fresh
      clean: {
        dist: {
          files: [
            {
              dot: true,
              src: [
                '.tmp',
                '<%= yeoman.dist %>/*',
                '!<%= yeoman.dist %>/.git*'
              ]
            }
          ]
        },
        server: '.tmp'
      },

      // Automatically inject Bower components into the app
      'bower-install': {
        app: {
          src: '<%= yeoman.app %>/index.html',
          ignorePath: '<%= yeoman.app %>/'
        }
      },

      // Renames files for browser caching purposes
      rev: {
        dist: {
          files: {
            src: [
              '<%= yeoman.dist %>/scripts/{,*/}*.js',
              '<%= yeoman.dist %>/styles/{,*/}*.css',
              '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
              '<%= yeoman.dist %>/fonts/{,*/}*.*',
              '!<%= yeoman.dist %>/img/email/**/*.{png,jpg,jpeg,gif,webp,svg}',
              '!<%= yeoman.dist %>/img/responsiveimages/**/*.{png,jpg,jpeg,gif,webp,svg}',
              '!<%= yeoman.dist %>/img/mapicons/**/*.{png,jpg,jpeg,gif,webp,svg}'
            ]
          }
        }
      },

      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
        html: ['<%= yeoman.app %>/index.html'],
        options: {
          dest: '<%= yeoman.dist %>'
        }
      },

      // Performs rewrites based on rev and the useminPrepare configuration
      usemin: {
        html: ['<%= yeoman.dist %>/{,*/}*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
          assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/fonts', '<%= yeoman.dist %>/img']
        }
      },

      // The following *-min tasks produce minified files in the dist folder
      imagemin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= yeoman.app %>/img',
              src: '{,*/}*.{png,jpg,jpeg,gif}',
              dest: '<%= yeoman.dist %>/img'
            }
          ]
        }
      },
      svgmin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= yeoman.app %>/img',
              src: '{,*/}*.svg',
              dest: '<%= yeoman.dist %>/img'
            }
          ]
        }
      },
      htmlmin: {
        dist: {
          options: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeOptionalTags: true
          },
          files: [
            {
              expand: true,
              cwd: '<%= yeoman.dist %>',
              src: ['*.html', 'views/{,*/}*.html'],
              dest: '<%= yeoman.dist %>'
            }
          ]
        }
      },

      // Allow the use of non-minsafe AngularJS files. Automatically makes it
      // minsafe compatible so Uglify does not destroy the ng references
      ngAnnotate: {
        options: {
          // Task-specific options go here.
        },
        dist: {
          // Target-specific file lists and/or options go here.
          files: {
            '.tmp/concat/scripts/vendor.js': ['.tmp/concat/scripts/vendor.js'],
            '.tmp/concat/scripts/scripts.js': ['.tmp/concat/scripts/scripts.js']
          }
        }
      },

      // Replace Google CDN references
      cdnify: {
        dist: {
          html: ['<%= yeoman.dist %>/*.html']
        }
      },

      // Copies remaining files to places other tasks can use
      copy: {
        dist: {
          files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>',
              src: [
                '*.{ico,png,txt}',
                '.htaccess',
                '*.html',
                'bower_components/**/*',
                'img/mapicons/**/*.*',
                'img/email/**/*.*',
                'favicon/*.*',
                'fonts/*'
              ]
            },
            {
              expand: true,
              cwd: '.tmp/img',
              dest: '<%= yeoman.dist %>/img',
              src: ['generated/*']
            },
            {
              expand: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>',
              src: ['favicon/favicon.ico']
            }
          ]
        },
        styles: {
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          dest: '.tmp/styles/',
          src: '{,*/}*.css'
        },
        translations: {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts/translations',
          dest: '<%= yeoman.dist %>/scripts/translations',
          src: '{,*/}*.json'
        }
      },

      // Run some tasks in parallel to speed up the build process
      concurrent: {
        options: {
          limit: 50
        },
        server: [
          'sass:server',
          'html2js'
        ],
        test: [
          'sass',
          'html2js'
        ],
        dist: [
          'sass:dist',
          'imagemin',
          'svgmin',
          'html2js'
        ]
      },

      // By default, your `index.html`'s <!-- Usemin block --> will take care of
      // minification. These next options are pre-configured if you do not wish
      // to use the Usemin blocks.
      // cssmin: {
      //   dist: {
      //     files: {
      //       '<%= yeoman.dist %>/styles/main.css': [
      //         '.tmp/styles/{,*/}*.css',
      //         '<%= yeoman.app %>/styles/{,*/}*.css'
      //       ]
      //     }
      //   }
      // },
      // uglify: {
      //   dist: {
      //     files: {
      //       '<%= yeoman.dist %>/scripts/scripts.js': [
      //         '<%= yeoman.dist %>/scripts/scripts.js'
      //       ]
      //     }
      //   }
      // },
      // concat: {
      //   dist: {}
      // },

      // Test settings
      karma: {
        unit: {
          configFile: 'karma.conf.js',
          singleRun: true
        }
      },
      html2js: {
        app: {
          options: {
            base: '<%= yeoman.app %>/'
          },
          src: ['<%= yeoman.app %>/views/**/*.tpl.html', '<%= yeoman.app %>/views/**/*.html'],
          dest: '<%= yeoman.app %>/scripts/templates.js',
          module: 'templates.app'
        }
      },
      sass: {
        server: {
          files: {
            '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
          }
        },
        dist: {
          files: {
            '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
          }
        }
      },
      favicons: {
        options: {
          trueColor: true,
          precomposed: true,
          appleTouchBackgroundColor: '#ffffff',
          coast: true,
          firefox: true,
          windowsTile: true,
          tileBlackWhite: false,
          tileColor: 'none',
          html: '<%= yeoman.dist %>/index.html',
          HTMLPrefix: '/favicon/'
        },
        icons: {
          src: '<%= yeoman.app %>/favicon/original/favicon.png',
          dest: '<%= yeoman.dist %>/favicon/'
        }
      },
      shell: {
        startserver: {
          command: ' sh ../server/startserver.sh &',
          options: {
            async: true
          }
        },
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        npminstallclient: {
          command: 'npm install',
          options: {
            async: true
          }
        },
        bowerinstallclient: {
          command: 'bower install',
          options: {
            async: true
          }
        },
        npminstallserver: {
          command: 'cd ../server/ & npm install',
          options: {
            async: true
          }
        }
      },
      replace: {
        dist: {
          options: {
            patterns: [
              {
                match: 'buildversion',
                replacement: '<%= pkg.version %>'
              },
              {
                match: 'timestamp',
                replacement: '<%= grunt.template.today("dddd, mmmm dS, yyyy, H:MM:ss") %>'
              }
            ]
          },
          files: [
            {
              expand: true,
              flatten: true,
              src: ['<%= yeoman.dist %>/index.html'],
              dest: '<%= yeoman.dist %>/'
            }
          ]
        }
      },
      bump: {
        // checkout https://npmjs.org/package/grunt-bump for options
        options: {
          files: ['package.json'],
          updateConfigs: [],
          commit: true,
          commitMessage: 'Release v%VERSION%',
          commitFiles: ['package.json'], // '-a' for all files
          createTag: true,
          tagName: 'Release-v%VERSION%',
          tagMessage: 'Release Version %VERSION%',
          push: true,
          pushTo: 'origin',
          gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
        }
      },

      // Translation source is this Google Spreadsheet:
      // https://docs.google.com/spreadsheets/d/10o5NKCAckc2rIaLX1dKMnh2VAT66yK9UpzGDAK8wwx8/edit#gid=424150697
      // Google-User: reactureapp@gmail.com
      gss: {
        products: {
          options: {
            // from your Google API key
            clientId: '59063909800-hrl5svtdk72g42rl1jl4ii29gpv4r40o.apps.googleusercontent.com',
            clientSecret: 'ulzYowIXXTUUOGZh9YEWef43',
            // output format
            saveJson: true,
            // options for JSON
            prettifyJson: true,
            // do parseInt, parseFloat, or split(',') automatically
            typeDetection: false
          },
          files: {
            // local save path : link to your worksheet
            './app/scripts/translations/translationspreadsheet.json': 'https://docs.google.com/spreadsheet/ccc?key=10o5NKCAckc2rIaLX1dKMnh2VAT66yK9UpzGDAK8wwx8#gid=424150697'
          }
        }
      }

    }
  );

  grunt.registerTask('convertgssjson', 'Convert Google Spreadsheet Data to angular-translate json files', function () {
    var _ = require('lodash');
    var spreadsheetjson = grunt.file.readJSON("./app/scripts/translations/translationspreadsheet.json");
    var translationfilepath = "./app/scripts/translations/";

    var getLanguageFileJSON = function (langkey, spreadsheetjson) {
      var translationobject = {};
      _.each(spreadsheetjson, function (row) {
        if (row.key && row.key !== "") {
          translationobject[row.key] = row[langkey.toLowerCase()];
        }
      });
      return translationobject;
    };

    // write files
    grunt.file.write(translationfilepath + 'locale-de.json', JSON.stringify(getLanguageFileJSON("de", spreadsheetjson), null, 2));
    grunt.file.write(translationfilepath + 'locale-en.json', JSON.stringify(getLanguageFileJSON("en", spreadsheetjson), null, 2));
    grunt.file.write(translationfilepath + 'locale-fr.json', JSON.stringify(getLanguageFileJSON("fr", spreadsheetjson), null, 2));
    grunt.file.write(translationfilepath + 'locale-it.json', JSON.stringify(getLanguageFileJSON("it", spreadsheetjson), null, 2));
  });

  grunt.registerTask('translate', [
    'gss',
    'convertgssjson'
  ]);

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
//      'bower-install', // creates mess with dependencies
      'concurrent:server',
      'connect:livereload',
      'shell',
      'watch'
    ]);
  });

  grunt.registerTask('dev', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
//      'bower-install', // creates mess with dependencies
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
//    'bower-install', // creates mess with dependencies
    'useminPrepare',
    'html2js',
    'concurrent:dist',
    'translate',
    'concat',
    'ngAnnotate',
    'copy:translations',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('install', [
    'shell:npminstallclient',
    'shell:bowerinstallclient',
    'shell:npminstallserver'
  ]);

  grunt.registerTask('release', [
    'build',
    'favicons',
    'replace'
  ]);

};
