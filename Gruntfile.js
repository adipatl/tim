module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {expand: true, src: ['**', '!**/*.ts'], dest: 'dist/', cwd: 'src'}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy']);

};