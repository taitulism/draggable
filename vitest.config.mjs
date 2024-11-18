import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		// environment: 'jsdom',
		// browser: {
		// 	enabled: true,
		// 	headless: true,
		// },
		coverage: {
			enabled: false,
			include: ['src'],
			reporter: ['text', 'html'],
		},
	},
});
