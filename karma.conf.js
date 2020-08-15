const resolvePath = require('path').resolve;

module.exports = function (config) {
	config.set({
		frameworks: ['browserify', 'mocha', 'chai'],
		browsers: [
			// 'ChromeNoSandbox',
			'ChromeHeadlessNoSandbox',
		],
		// customContextFile: 'tests/test.html',
		browserSocketTimeout: 30000,
		browserNoActivityTimeout: 30000,
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
		preprocessors: {
			'tests/**/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			// transform: [ 'brfs' ]
		},
		reporters: ['mocha'],
		plugins: [
			'karma-chrome-launcher',
			'karma-chai',
			'karma-mocha',
			'karma-browserify',
			'karma-mocha-reporter'
		],
		basePath: process.cwd(),
		colors: true,
		files: [
			'tests/**/*.js' // or you can put your test bundle here
		],
		port: 8181,
		singleRun: true,
		concurrency: Infinity
	});
};
