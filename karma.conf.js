/* eslint-disable */
// Karma configuration

// noinspection JSUnresolvedVariable
module.exports = function (config) {
    // Read index file to detect scripts
    // noinspection JSUnresolvedFunction,NodeCoreCodingAssistance
    /** @type {string} */ let index = require('fs').readFileSync('index.html', 'utf8');
    /** @type {string[]|{pattern: boolean, served: boolean, included: boolean}[]} */ let files = [];
    let src_regex = /<script.*?src="(.*?)"/;

    // Add served
    files.push({
        pattern: 'dist/i18n/*.js',
        served: true,
        included: false,
    });

    // Retrieve files from HTML
    index.split('\n').forEach((ln) => {
        ln = ln.trim();
        /** @type {string|string[]} */ let path = src_regex.exec(ln);
        if (path === null) return;
        path = path[1].split('?v=')[0];
        if (path.substring(0, 5) === 'dist/') { // Move from dist to src
            path = `src/${path.substring(5).replace('.min.js', '.js')}`;
        }
        if (path === 'src/about/about.js') {
            files.push({
                pattern: 'lib/**',
                served: true,
                included: false,
            });
        }
        files.push(path);
    });

    // noinspection JSUnresolvedVariable
    config.set({

        // Base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // Will be used as the hostname when launching browsers
        hostname: '127.0.0.1',

        // Frameworks to use: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // List of files / patterns to load in the browser
        files: files.concat([
            'test/**/*.js',
        ]),

        // List of files / patterns to exclude
        exclude: [],

        // Test results reporter to use; possible values: 'dots', 'progress'
        reporters: ['progress', 'coverage'],

        // Preprocess matching files before serving them to the browser
        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging (LOG_DISABLE, LOG_ERROR, LOG_WARN, config.LOG_INFO, config.LOG_DEBUG)
        logLevel: config.LOG_DEBUG,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        // Browser timeout before disconecting (ms)
        browserNoActivityTimeout: 24 * 60 * 60 * 1000,

        // Continuous Integration mode; if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level; how many browser should be started simultaneous
        concurrency: Infinity,

    });
};
