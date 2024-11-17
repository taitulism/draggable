import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEsLint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tsEsLint.configs.recommended,
	{
		ignores: ['src/vite-env.d.ts'],
	},
	{
		rules: {
			'no-undef': 'error',
			'semi': 'error',
			'comma-dangle': ['error', 'always-multiline'],
			'arrow-body-style': ['error', 'as-needed'],
			'max-len': ['error', 110],
			'spaced-comment': 'error',
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab'],
			'array-bracket-spacing': 'error',
			'no-duplicate-imports': 'error',
			'object-curly-spacing': 'error',
			'prefer-destructuring': 'error',
			'comma-spacing': 'error',
			'eqeqeq': 'error',
			'eol-last': 'error',
			'consistent-return': 0,
			'space-before-blocks': 'error',
			'space-before-function-paren': 'error',
			'space-in-parens': 'error',
			'no-trailing-spaces': 'error',
			'space-infix-ops': 'error',
			'keyword-spacing': 'error',
			'func-call-spacing': 'error',
			'no-console': 'warn',
			'padding-line-between-statements': ['error',
				// {blankLine: 'always', prev: '*', next: 'return'},
				// {blankLine: 'always', prev: '*', next: 'block-like'},
				{blankLine: 'always', prev: 'block-like', next: '*'},
				{blankLine: 'always', prev: '*', next: ['const', 'let', 'var']},
				// {blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
				{blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']},
			],
			'no-multi-spaces': ['error', {'ignoreEOLComments' : true}],
			'brace-style': ['error', 'stroustrup'],
			'curly': ['error', 'multi-line'],

			'no-unused-vars': 0,
			'@typescript-eslint/no-unused-expressions': 0,
		},
	},
	// {
	// 	files: ['tests/**/*.spec.ts'],
	// 	rules: {
	// 		'@typescript-eslint/no-unused-expressions': 0,
	// 	},
	// },
];
