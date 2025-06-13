const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(__dirname, '../../src/index.js'),
		// Add additional entry points here
	},
	output: {
		path: path.resolve(__dirname, '../../build'),
		filename: '[name].js',
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			'@': path.resolve(__dirname, '../../src'),
		},
	},
};
