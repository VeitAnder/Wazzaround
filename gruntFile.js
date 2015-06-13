module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    env: {
      testing: {
        NODE_ENV: 'testing',
        DEST: 'temp'
      }
    },
    watch: {
      js: {
        files: [
          'lib/**/*.js',
          'models/**/*.js',
          'routes/**/*.js',
          'monitoring/**/*.js',
          'servermodules/**/*.js',
          'templates/**/*.handlebars'
        ],
        tasks: 'buildfast'
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc.productionbuild.json',
        reporter: require('jshint-stylish')
      },
      all: [
        'lib/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        'monitoring/**/*.js',
        'servermodules/**/*.js',
        '!models/**/*.js'
      ]
    },
    handlebars: {
      compile: {
        options: {
          namespace: "JST",
          node: true,
          processName: function (filePath) {
            return filePath.replace(/^.*[\\\/]/, '');
          }
        },
        files: {
          "server/templates/compiled/compiledtemplates.js": "_temp/server/templates/source/**/*.handlebars.html"
        }
      }
    },
    replace: {
      fixhandlebarsinclude: {
        options: {
          patterns: [
            {
              match: /{{&gt;/g,
              replacement: '{{>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['_temp/server/templates/source/default.handlebars.html'],
            dest: '_temp/server/templates/source/'
          }
        ]
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      textmailtemplates: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'server/templates/source/',
            dest: '_temp/server/templates/source/',
            src: [
              '**/*.txt.handlebars.html'
            ]
          }
        ]
      }
    },
    clean: {
      temp: ["_temp/"]
    },
    bump: {
      // checkout https://npmjs.org/package/grunt-bump for options
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Server Release v%VERSION%',
        commitFiles: ['package.json'], // '-a' for all files
        createTag: false,
        tagName: 'Server-v%VERSION%',
        tagMessage: 'Server Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },
    shell: {
      options: {
        stdout: true,
        stderr: true,
        failOnError: true
      },
      inlinecss: {
        command: 'gulp inlinecss'
      }
    }
  });

  // release builds
  grunt.registerTask('releasebasetask', ['buildemailtemplates', 'jshint']);
  grunt.registerTask('release', ['releasebasetask']);
  grunt.registerTask('releasepatch', ['releasebasetask']);
  grunt.registerTask('releasedevelopment', ['releasebasetask']);

  // buildfast for development
  grunt.registerTask('build', ['buildemailtemplates', 'jshint']);

  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });

  // buildemailtemplates
  grunt.registerTask('buildemailtemplates', ['shell:inlinecss', 'copy', 'handlebars', 'clean']);

  grunt.registerTask('supervise', function () {
    this.async();
    require('supervisor').run(['server.js']);
  });

};
