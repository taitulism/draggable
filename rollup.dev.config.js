export default [{
	input: 'index.js',
	output: {
		file: 'draggable-dev-bundle.js',
		format: 'iife',
		name: 'draggable',
	},
}, {
	input: 'tests/index.spec.js',
	output: {
		file: 'draggable-spec-bundle.js',
		format: 'iife',
		name: 'draggable',
	},
}];
