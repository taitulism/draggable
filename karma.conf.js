// Karma configuration
// Generated on Fri Sep 18 2020 18:49:15 GMT+0300 (Israel Daylight Time)

module.exports = function (config) {
	config.set({
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		basePath: '',
		port: 9876,
		concurrency: Infinity,
		colors: true,
		singleRun: true,
		autoWatch: false,
		frameworks: ['mocha', 'chai'],
		reporters: ['mocha'],
		files: [
			{ pattern: 'tests/index.spec.js', watched: false },
			{ pattern: 'draggable.js', watched: false },
		],
		preprocessors: {
			'tests/index.spec.js': ['rollup'],
			'draggable.js': ['rollup'],
		},
		rollupPreprocessor: {
			output: {
				format: 'iife',
				name: 'draggable',
				sourcemap: 'inline',
			},
		},
		client: {
			clearContext: false,
			mocha: {
				reporter: 'html',
				timeout: 2000,
			},
		},
		browsers: [
			'HeadlessChrome',
			// 'ChromeWithGUI',
		],
		customLaunchers: {
			HeadlessChrome: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			},
			ChromeWithGUI: {
				base: 'Chrome',
				flags: [
					'--no-sandbox',
					'--disable-gpu',
					'--remote-debugging-port-9222'
				]
			},
		},
	})
}
