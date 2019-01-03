const webpackConfig = require('./webpack.dev.js');

//
// Karma configuration
//

module.exports = function (config) {
    config.set({
        webpack: webpackConfig,
        basePath: '',
        frameworks: ['jasmine'], // 'source-map-support',
        files: [
            'test/all.js'
        ],
        exclude: [],
        preprocessors: {
            'test/all.js': ['webpack', 'sourcemap']
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        autoWatch: true,
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
