/* eslint-disable */
// Karma configuration

// noinspection JSUnresolvedVariable
module.exports = function (config) {
    // Read index file to detect scripts
    // noinspection NodeCoreCodingAssistance
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

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: files.concat([
            'test/**/*.js',
        ]),

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

    });
};
