import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		include: ['./tests/**/*.spec.*'],
		browser: {
			enabled: true,
			headless: false,
			name: 'chromium',
			provider: 'playwright',
			providerOptions: {},
		},
		coverage: {
			enabled: false,
			include: ['src'],
			reporter: ['text', 'html'],
		},
	},
});
