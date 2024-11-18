import type {UserConfig} from 'vite';
import pkg from './package.json';
import terser from '@rollup/plugin-terser';

const pkgNameAndVersion = pkg.name + ' v' + pkg.version;
const license = `${pkg.license} License`;
const author = `© ${pkg.author.name}`;
const year = new Date().getFullYear();
const repoUrl = pkg.repository.url.substring(0, pkg.repository.url.length - 4); // removes tail ".git"
const banner = `/*! ${pkgNameAndVersion} | ${license} | ${author} ${year} | ${repoUrl} */`;

export default {
	build: {
		minify: false,
		sourcemap: true,
		lib: {
			entry: pkg.main,
		},
		rollupOptions: {
			output: [{
				banner,
				format: 'es',
				entryFileNames: 'pkg-name.js',
			}, {
				banner,
				format: 'iife',
				entryFileNames: 'pkg-name.browser.js',
				name: 'pkgName',
				plugins: [terser({
					compress: {
						keep_classnames: true,
					},
				})],
			}],
		},
	},
} satisfies UserConfig;
