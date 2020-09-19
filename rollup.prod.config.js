export default [{
	input: 'draggable.js',
	output: {
		file: 'dist/draggable.esm-bundle.js',
		format: 'es',
	},
},{
	input: 'draggable.js',
	output: {
		file: 'dist/draggable.browser.js',
		format: 'iife',
		name: 'draggable',
	},
}];
