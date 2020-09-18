// Karma configuration
// Generated on Mon Sep 14 2020 22:14:22 GMT+0300 (Israel Daylight Time)

module.exports = function(config) {
  config.set({
    // used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
		'dist/draggable.global.js',
		'dist/tests/*.spec.js',
		// 'dist/tests/*.spec.js.map',
		// {
		// 	pattern: 'dist/tests/*.spec.js.map',
		// 	// included: false
		// },
	],

	preprocessors: {
		'**/*.js': ['sourcemap']
	},
	// plugins: [
	// 	'sourcemap'
	// ],

    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
		'ChromeNoSandbox',
		// 'ChromeHeadlessNoSandbox',
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

	client: {
		clearContext: false,
		mocha: {
			reporter: 'html',
			timeout: 2000,

			// require files after Mocha is initialized - but cached - not watched :/
			// require: [require.resolve('./draggable.js')],
		},
	},

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
