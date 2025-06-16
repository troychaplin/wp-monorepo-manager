#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.config');

// Get the command from arguments
const command = process.argv[2];

// Get the current working directory
const cwd = process.cwd();

// Update webpack config for the current directory
const config = {
	...webpackConfig,
	context: cwd,
	entry: {
		main: path.resolve(cwd, 'src/scripts/index.js'),
		styles: path.resolve(cwd, 'src/styles.scss'),
		'editor-styles': path.resolve(cwd, 'src/editor-styles.scss'),
	},
	output: {
		...webpackConfig.output,
		path: path.resolve(cwd, 'dist'),
	},
};

// Execute the command
switch (command) {
	case 'build':
		webpack(config, (err, stats) => {
			if (err || stats.hasErrors()) {
				console.error('Build failed:', err || stats.toString());
				process.exit(1);
			}
			console.log('Build completed successfully');
		});
		break;

	case 'build:dev':
		webpack(
			{
				...config,
				mode: 'development',
				devtool: 'source-map',
			},
			(err, stats) => {
				if (err || stats.hasErrors()) {
					console.error('Build failed:', err || stats.toString());
					process.exit(1);
				}
				console.log('Development build completed successfully');
			}
		);
		break;

	case 'build:prod':
		webpack(
			{
				...config,
				mode: 'production',
			},
			(err, stats) => {
				if (err || stats.hasErrors()) {
					console.error('Build failed:', err || stats.toString());
					process.exit(1);
				}
				console.log('Production build completed successfully');
			}
		);
		break;

	case 'start':
		// TODO: Implement development server
		console.log('Development server not implemented yet');
		break;

	case 'lint':
	case 'lint:js':
	case 'lint:css':
	case 'lint:php':
		// TODO: Implement linting
		console.log('Linting not implemented yet');
		break;

	case 'format':
	case 'format:js':
	case 'format:css':
	case 'format:php':
		// TODO: Implement formatting
		console.log('Formatting not implemented yet');
		break;

	case 'clean':
		// TODO: Implement clean
		console.log('Clean not implemented yet');
		break;

	default:
		console.error('Unknown command:', command);
		process.exit(1);
}
