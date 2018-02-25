module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            lib: {
                files: [
                    {expand: true, src: ['libs/**'], dest: 'dist/'}
                ]
            },
            app: {
                files: [
                    {expand: true, src: ['**', '!**/*.js'], dest: 'dist/', cwd: 'src'}
                ]
            }
        },
        clean: {
            build: ['dist'],
            options: {
                force: true
            }
        },
        uglify: {
            debug: {
                files: [{
                    expand: true,
                    src: ['**/*.js'],
                    dest: 'dist',
                    cwd: 'src'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

};