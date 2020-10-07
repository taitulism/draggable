// import {terser} from 'rollup-plugin-terser';

export default [{
	input: 'draggable.js',
	output: {
		file: 'dist/draggable.esm.js',
		format: 'es',
	},
}, {
	input: 'draggable.js',
	output: {
		file: 'dist/draggable.browser.js',
		format: 'iife',
		name: 'draggable',
	}
// }, {
// 	input: 'draggable.js',
// 	plugins: [terser()],
// 	output: {
// 		file: 'dist/draggable.browser.min.js',
// 		format: 'iife',
// 		name: 'draggable',
// 	},
}];
