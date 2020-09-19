// Karma configuration
// Generated on Fri Sep 18 2020 18:49:15 GMT+0300 (Israel Daylight Time)

module.exports = function(config) {
  config.set({
    // resolve "files" patterns
    basePath: '',

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
	//   'tests/*.spec.js'
		{ pattern: 'tests/index.spec.js', watched: false },
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
	preprocessors: {
		'tests/index.spec.js': ['rollup'],
	},

	rollupPreprocessor: {
		plugins: [require('rollup-plugin-buble')()],
		output: {
			format: 'iife',
			name: 'draggable',
			sourcemap: 'inline',
		},
	},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
		'ChromeHeadlessNoSandbox',
		// 'ChromeNoSandbox',
	],
	customLaunchers: {
		ChromeNoSandbox: {
			base: 'Chrome',
			flags: [
				'--no-sandbox',
				'--disable-gpu',
				'--remote-debugging-port-9222'
			]
		},
		ChromeHeadlessNoSandbox: {
			base: 'ChromeHeadless',
			flags: ['--no-sandbox']
		},
	},

    // CI mode: if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // how many browser should be started simultaneous
	concurrency: Infinity,

	client: {
		clearContext: false,
		mocha: {
			reporter: 'html',
			timeout: 2000,
		},
	},
  })
}
