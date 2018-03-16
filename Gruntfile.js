module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            lib: {
                files: [
                    {expand: true, src: ['libs/**'], dest: 'www/'}
                ]
            },
            app: {
                files: [
                    {expand: true, src: ['**', '!index.html', '!**/*.js'], dest: __dirname + '/www', cwd: 'src'}
                ]
            }
        },
        clean: {
            build: [
                'www/libs',
                'www/app.js',
                'www/index.html',
                'www/style.css'
            ],
            options: {
                force: true
            }
        },
        uglify: {
            debug: {
                files: [{
                    expand: true,
                    src: ['**/*.js'],
                    dest: __dirname + '/www',
                    cwd: 'src'
                }],
                options: {
                    beautify: true,
                    mangle: false
                }
            },
            release: {
                files: [{
                    expand: true,
                    src: ['**/*.js'],
                    dest: __dirname + '/www',
                    cwd: 'src'
                }],
                options: {
                    beautify: false,
                    mangle: true
                }
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
                    {expand: true, flatten: true, src: ['src/index.html'], dest: 'www'}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');
};