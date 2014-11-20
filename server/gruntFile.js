module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-email-builder');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');

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
          "templates/compiled/compiledtemplates.js": "_temp/templates/source/**/*.handlebars.html"
        }
      }
    },
    emailBuilder: {
      inline: {
        options: {
          encodeSpecialChars: false
        },
        files: [{
          expand: true,
          src: ['templates/source/**/*.handlebars.html'],
          dest: '_temp/'
        }]
      }
    },
    replace: {
      fixhandlebarsinclude: {
        options: {
          patterns: [{
            match: /{{&gt;/g,
            replacement: function () {
              return '{{>'; // replaces "foo" to "bar"
            }
          }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['_temp/templates/source/default.handlebars.html'],
            dest: '_temp/templates/source/'
          }
        ]
      }
    },
    clean: {
      temp: ["_temp/"]
    },
    jasmine_node: {
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      match: '.',
      matchall: false,
      extensions: 'js',
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath: ".",
        useDotNotation: true,
        consolidate: true
      }
      //all: ['test/']
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
  grunt.registerTask('buildemailtemplates', ['emailBuilder', 'replace', 'handlebars', 'clean']);

  grunt.registerTask('supervise', function () {
    this.async();
    require('supervisor').run(['server.js']);
  });

  grunt.registerTask('test', ['env:testing', 'jasmine_node']);

};
