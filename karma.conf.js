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
            'src/init.js',

            // Load libraries
            'lib/jquery/jquery-3.3.1.js',
            'lib/jscookie/js.cookie-2.2.0.js',
            'lib/jquery-dateFormat/jquery-dateFormat.min.js',
            'lib/spin/spin.js',

            // Load application
            'src/about/about.js',
            'src/about/author.js',
            'src/about/dependencies.js',
            'src/about/version.js',

            'src/i18n/lang.js',
            'src/core/globals.js',
            'src/core/mode/test.js',
            'src/core/mode/local.js',
            'src/core/date.js',
            'src/config.js',

            'src/core/imports.js',
            'src/core/errors.js',
            'src/core/color.js',
            'src/core/console.js',
            'src/core/country.js',
            'src/core/dom.js',
            'src/core/hash.js',
            'src/core/logic.js',
            'src/core/math.js',
            'src/core/polyfills.js',
            'src/core/session.js',
            'src/core/url.js',

            'src/engine/geom/face.js',
            'src/engine/geom/polyhedra.js',
            'src/engine/geom/vertex.js',
            'src/engine/geom/volume.js',

            'src/engine/generator/generator.js',
            'src/engine/generator/basic_cube.js',
            'src/engine/generator/basic_pyramid.js',
            'src/engine/generator/cross_fractal.js',
            'src/engine/generator/cube.js',
            'src/engine/generator/cylinder.js',
            'src/engine/generator/empty.js',
            'src/engine/generator/function.js',
            'src/engine/generator/mobius.js',
            'src/engine/generator/polyhedra.js',
            'src/engine/generator/random_plane.js',
            'src/engine/generator/sierpinski_cube.js',
            'src/engine/generator/sierpinski_triangle.js',
            'src/engine/generator/sphere.js',
            'src/engine/generator/square.js',
            'src/engine/generator/toroid.js',

            'src/engine/tms/events.js',
            'src/engine/tms/menu.js',
            'src/engine/tms/minesweeper.js',
            'src/engine/tms/sounds.js',
            'src/engine/tms/tms.js',
            'src/engine/tms/viewer.js',

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
