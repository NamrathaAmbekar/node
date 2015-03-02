module.exports = function(grunt) {


    grunt.initConfig({
        // ...

        watch: {

           app: {
                files: "*.js"
            }

        }

        // ...
    })
    grunt.registerTask('start', function () {
        grunt.util.spawn(
            { cmd: 'node'
                , args: ['index.js']
            })

        grunt.task.run('watch:app')
    })
    grunt.loadNpmTasks('grunt-contrib-watch');
};