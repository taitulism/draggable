import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
	// If you want to keep running your existing tests in Node.js, uncomment the next line.
	// 'vitest.config.mjs',
	{
		extends: 'vitest.config.mjs',
		test: {
			include: ['./tests/**/*.spec.*'],
			browser: {
				enabled: true,
				headless: false,
				name: 'chromium',
				provider: 'playwright',
				// https://playwright.dev
				providerOptions: {},
			},
		},
	},
]);
