/* eslint-disable */
// Karma configuration

// noinspection JSUnresolvedVariable
module.exports = function (config) {
    // noinspection JSUnresolvedVariable
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [

            // Init application
            'init.js',

            // Load libraries
            'lib/jquery/jquery-3.3.1.js',
            'lib/jquery-confirm/jquery-confirm.min.js',
            'lib/jquery-dateFormat/jquery-dateFormat.min.js',
            'lib/jquery-scrollLock/jquery-scrollLock.min.js',
            'lib/jscookie/js.cookie-2.2.0.js',
            'lib/md5/md5.min.js',
            'lib/three.js/three.min.js',
            'lib/three.js/OrbitControls.min.js',
            'lib/stats.js/stats.min.js',
            'lib/spin/spin.js',
            'lib/dat.gui/dat.gui.min.js',
            'lib/toastr/toastr.min.js',
            'lib/notification.js/notification.min.js',

            // Load application
            'src/about/about.js',
            'src/about/author.js',
            'src/about/dependencies.js',
            'src/about/version.js',

            'src/i18n/lang.js',
            'src/i18n/en.js',

            'src/config.js',
            'src/core/env/mode_test.js',
            'src/core/globals.js',
            'src/core/errors.js',
            'src/core/color.js',
            'src/core/console.js',
            'src/core/date.js',
            'src/core/dom.js',
            'src/core/file.js',
            'src/core/hash.js',
            'src/core/logic.js',
            'src/core/math.js',
            'src/core/polyfills.js',
            'src/core/session.js',
            'src/core/string.js',
            'src/core/url.js',

            'src/engine/geom/face.js',
            'src/engine/geom/vertex.js',
            'src/engine/geom/volume.js',

            'src/engine/generator/generator.js',
            'src/engine/generator/basic_cube.js',
            'src/engine/generator/basic_pyramid.js',
            'src/engine/generator/cross_fractal.js',
            'src/engine/generator/sierpinski_cube.js',

            'src/engine/viewer/viewer.js',

            'src/ui/globals.js',
            'src/ui/dialogs.js',
            'src/ui/themes.js',
            'src/ui/loading.js',

            'src/app.js',

            // Load tests
            'test/**/**.js',
        ],

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
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

    });
};
