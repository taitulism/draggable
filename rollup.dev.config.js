export default [{
	input: 'index.js',
	output: {
		file: 'dev-bundles/draggable.js',
		format: 'iife',
		name: 'draggable',
	},
}, {
	input: 'tests/index.spec.js',
	output: {
		file: 'dev-bundles/draggable-spec.js',
		format: 'iife',
	},
}];
