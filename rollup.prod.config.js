
export default [{
	input: 'index.js',
	output: {
		file: 'dist/draggable.esm.js',
		format: 'es',
	},
}, {
	input: 'index.js',
	output: {
		file: 'dist/draggable.browser.js',
		format: 'iife',
		name: 'draggable',
	}
}];

/*
minify:
-------
	import {terser} from 'rollup-plugin-terser';

	...

	input: 'index.js',
	plugins: [terser()],
	output: {
		file: 'dist/draggable.browser.min.js',
		format: 'iife',
		name: 'draggable',
	},
*/
