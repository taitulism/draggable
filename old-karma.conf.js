/* env node */

module.exports = function (config) {
	config.set({
		autoWatch: true,
		singleRun: false,
		reporters: ['mocha'],
		port: 8181,
		colors: true,
		basePath: process.cwd(),
		concurrency: Infinity,
		logLevel: config.LOG_INFO,
		frameworks: ['mocha', 'chai'], /* 'browserify',  */
		plugins: [
			// 'karma-browserify',
			'karma-chrome-launcher',
			'karma-chai',
			'karma-mocha',
			'karma-mocha-reporter',
		],
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
		// preprocessors: {
		// 	'tests/**/*.js': ['browserify'],
		// },
		// browserify: {
		// 	debug: true,
		// },
		// watchify: {
		// 	poll: true,
		// 	cache: {},
		// 	packageCache: {}
		// },
		files: [
			// 'draggable.js',
			// 'tests/**/*.js',
			'tests/index.spec.js',
			// { pattern: 'tests**/*.js', included: false }
		],
		client: {
			clearContext: false,
			mocha: {
				reporter: 'html',
				timeout: 2000,

				// require files after Mocha is initialized - but cached - not watched :/
				// require: [require.resolve('./draggable.js')],
			},
		},
	});
};
