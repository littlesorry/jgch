'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    mochaTest : {
      test : {
        options : {
          reporter : 'spec'
        },
        src : [ 'test/**/*Test.js' ]
      },
      all : {
        options : {
          reporter : 'spec',
          require : 'coverage/blanket'
        },
        src : [ 'test/**/*Test.js' ]
      },
      coverage : {
        options : {
          reporter : 'html-cov',
          quiet : true,
          captureFile : 'report/index.html'
        },
        src : [ 'test/**/*Test.js' ]
      },
      'travis-cov' : {
        options : {
          reporter : 'travis-cov'
        },
        src : [ 'test/**/*Test.js' ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [ 'mochaTest:test' ]);
  grunt.registerTask('coverage', [ 'mochaTest:all', 'mochaTest:coverage' ]);
  grunt.registerTask('coverage-travis', [ 'mochaTest:all', 'mochaTest:travis-cov' ]);

  // Default task.
  grunt.registerTask('default', [ 'jshint', 'coverage' ]);

};
