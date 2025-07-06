#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
	isWordPressInstallation,
	SHARED_SCRIPTS,
	SHARED_DEPENDENCIES,
	TURBO_CONFIG,
} = require('../scripts/utils');

// Get the command from arguments and parse colon syntax
const fullCommand = process.argv[2];
let command, subCommand;

if (fullCommand && fullCommand.includes(':')) {
	[command, subCommand] = fullCommand.split(':');
} else {
	command = fullCommand;
	subCommand = process.argv[3];
}

// Get the current working directory
const cwd = process.cwd();

// Handle help command first (before any other processing)
if (
	command === '--help' ||
	command === '-h' ||
	!command ||
	(command === 'setup' && (subCommand === '--help' || subCommand === '-h'))
) {
	console.log('Usage: wp-monorepo <command> [subcommand] [flags]');
	console.log('');
	console.log('Commands:');
	console.log('  setup              Create monorepo structure');
	console.log('  setup:theme        Create a new theme');
	console.log('  setup:plugin       Create a new plugin');
	console.log('  build              Build for production');
	console.log('  build:force        Force rebuild (bypasses turbo cache)');
	console.log('  start              Start development server');
	console.log('  lint               Run linting');
	console.log('  format             Format code');
	console.log('  clean              Clean build artifacts');
	console.log('');
	console.log('Setup Flags:');
	console.log('  --dry-run          Preview changes without modifying files');
	console.log("  --safe             Only create files that don't exist");
	console.log('');
	console.log('Setup Usage:');
	console.log('  Run "wp-monorepo setup" from:');
	console.log('  - WordPress root directory: Initializes monorepo in existing WordPress');
	console.log('  - Empty directory: Creates new WordPress + monorepo structure');
	console.log('');
	console.log('Examples:');
	console.log('  wp-monorepo setup              # Initialize monorepo structure');
	console.log('  wp-monorepo setup --dry-run    # Preview setup changes');
	console.log('  wp-monorepo setup --safe       # Only create missing files');
	console.log('  wp-monorepo setup:theme        # Create a new theme');
	console.log('  wp-monorepo setup:plugin       # Create a new plugin');
	process.exit(0);
}

// Handle setup commands
if (command === 'setup') {
	// Get additional arguments (flags like --dry-run, --safe)
	const additionalArgs = process.argv.slice(3).filter(arg => arg.startsWith('--'));

	// If we have a subcommand, validate it first (but exclude flags)
	const realSubCommand = process.argv.slice(3).find(arg => !arg.startsWith('--'));
	if (realSubCommand) {
		if (realSubCommand !== 'theme' && realSubCommand !== 'plugin') {
			console.error(`❌ Error: Unknown setup command "${realSubCommand}"`);
			console.log('');
			console.log('Valid setup commands:');
			console.log('  wp-monorepo setup         # Initialize monorepo structure');
			console.log('  wp-monorepo setup:theme   # Create a new theme');
			console.log('  wp-monorepo setup:plugin  # Create a new plugin');
			console.log('');
			console.log('Available flags:');
			console.log('  --dry-run                 # Preview changes without modifying files');
			console.log("  --safe                    # Only create files that don't exist");
			process.exit(1);
		}
		subCommand = realSubCommand;
	}

	const setupScript =
		subCommand === 'theme'
			? 'setup-theme'
			: subCommand === 'plugin'
				? 'setup-plugin'
				: 'setup-monorepo';

	// Build command with additional arguments
	const argsString = additionalArgs.length > 0 ? ' ' + additionalArgs.join(' ') : '';

	try {
		// If we have a subcommand (theme or plugin), run the specific setup script
		if (subCommand === 'theme' || subCommand === 'plugin') {
			execSync(
				`node ${path.join(__dirname, '..', 'scripts', setupScript + '.js')}${argsString}`,
				{
					stdio: 'inherit',
					cwd: cwd,
				}
			);
			process.exit(0);
		}

		// Only run main setup if no subcommand was provided
		// Check if we're in a WordPress installation
		if (isWordPressInstallation(cwd)) {
			// We're in a WordPress installation, use the enhanced setup script
			console.log('WordPress installation detected. Setting up monorepo structure...');
			execSync(
				`node ${path.join(__dirname, '..', 'scripts', setupScript + '.js')} ${cwd}${argsString}`,
				{
					stdio: 'inherit',
				}
			);
			process.exit(0);
		} else {
			// We're not in a WordPress installation, use the original setup script
			console.log('Empty directory detected. Setting up monorepo structure...');
			execSync(
				`node ${path.join(__dirname, '..', 'scripts', setupScript + '.js')} ${cwd}${argsString}`,
				{
					stdio: 'inherit',
				}
			);
			process.exit(0);
		}
	} catch (error) {
		console.error('Setup failed:', error.message);
		process.exit(1);
	}
	return;
}

// Only load webpack for build commands
if (command && command.startsWith('build')) {
	const webpack = require('webpack');
	const webpackConfig = require('../config/webpack/webpack.config');

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

	// Execute the build command
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
	}
	return;
}

// Handle other commands
switch (command) {
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
