#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.config');
const { execSync } = require('child_process');

// Get the command from arguments
const command = process.argv[2];
const subCommand = process.argv[3];

// Get the current working directory
const cwd = process.cwd();

// Handle setup commands
if (command === 'setup') {
	const setupScript =
		subCommand === 'theme'
			? 'setup-theme'
			: subCommand === 'plugin'
				? 'setup-plugin'
				: 'setup-monorepo';

	try {
		execSync(`node ${path.join(__dirname, '..', 'scripts', setupScript + '.js')}`, {
			stdio: 'inherit',
			cwd: path.dirname(__dirname),
		});
	} catch (error) {
		console.error('Setup failed:', error.message);
		process.exit(1);
	}
	return;
}

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
		// TODO: Implement cleaning
		console.log('Cleaning not implemented yet');
		break;

	default:
		console.log('Usage: wp-monorepo <command> [subcommand]');
		console.log('');
		console.log('Commands:');
		console.log('  setup              Create monorepo structure');
		console.log('  setup:theme        Create a new theme');
		console.log('  setup:plugin       Create a new plugin');
		console.log('  build              Build for production');
		console.log('  build:dev          Build for development');
		console.log('  build:prod         Build for production');
		console.log('  start              Start development server');
		console.log('  lint               Run linting');
		console.log('  format             Format code');
		console.log('  clean              Clean build artifacts');
		break;
}
