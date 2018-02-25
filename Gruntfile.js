module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            lib: {
                files: [
                    {expand: true, src: ['libs/**'], dest: 'www/dist/'}
                ]
            },
            app: {
                files: [
                    {expand: true, src: ['**', '!index.html', '!**/*.js'], dest: __dirname + '/www/dist', cwd: 'src'}
                ]
            }
        },
        clean: {
            build: ['dist', 'www/dist'],
            options: {
                force: true
            }
        },
        uglify: {
            debug: {
                files: [{
                    expand: true,
                    src: ['**/*.js'],
                    dest: __dirname + '/www/dist',
                    cwd: 'src'
                }]
            }
        },
        replace: {
            index: {
                options: {
                    patterns: [
                        {
                            match: '../libs',
                            replacement: './libs'
                        }
                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['src/index.html'], dest: 'www/dist'}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');
};