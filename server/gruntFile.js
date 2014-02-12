module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-env');

  // Project configuration.
  grunt.initConfig({
    env : {
      testing: {
        NODE_ENV : 'testing',
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
        '!models/**/*.js',
      ]
    },

    handlebars: {
      compile: {
        options: {
          namespace: "JST",
          node: true
        },
        files: {
          "templates/compiledtemplates.js": "templates/**/*.handlebars"
        }
      }
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
        createTag: true,
        tagName: 'Server-v%VERSION%',
        tagMessage: 'Server Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    }
  });

  // release builds
  grunt.registerTask('releasebasetask', ['handlebars', 'jshint']);
  grunt.registerTask('release', ['releasebasetask']);
  grunt.registerTask('releasepatch', ['releasebasetask']);
  grunt.registerTask('releasedevelopment', ['releasebasetask']);

  // buildfast for development
  grunt.registerTask('buildfast', ['handlebars', 'jshint']);

  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });

  grunt.registerTask('supervise', function () {
    this.async();
    require('supervisor').run(['server.js']);
  });

  grunt.registerTask('test', ['env:testing', 'jasmine_node']);

};
