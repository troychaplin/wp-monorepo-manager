#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Get the command from arguments
const command = process.argv[2];
const subCommand = process.argv[3];

// Get the current working directory
const cwd = process.cwd();

// Helper function to check if current directory is a WordPress installation
function isWordPressInstallation(dir) {
	const wpFiles = ['wp-config.php', 'wp-content', 'wp-includes', 'wp-admin'];
	return wpFiles.some(file => fs.existsSync(path.join(dir, file)));
}

// Handle help command first (before any other processing)
if (
	command === '--help' ||
	command === '-h' ||
	!command ||
	(command === 'setup' && (subCommand === '--help' || subCommand === '-h'))
) {
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
	console.log('');
	console.log('Setup Usage:');
	console.log('  Run "wp-monorepo setup" from:');
	console.log('  - WordPress root directory: Initializes monorepo in existing WordPress');
	console.log('  - Empty directory: Creates new WordPress + monorepo structure');
	console.log('');
	console.log('Examples:');
	console.log('  wp-monorepo setup              # Initialize monorepo structure');
	console.log('  wp-monorepo setup:theme my-theme    # Create a new theme');
	console.log('  wp-monorepo setup:plugin my-plugin  # Create a new plugin');
	return;
}

// Handle setup commands
if (command === 'setup') {
	const setupScript =
		subCommand === 'theme'
			? 'setup-theme'
			: subCommand === 'plugin'
				? 'setup-plugin'
				: 'setup-monorepo';

	try {
		// Check if we're in a WordPress installation
		if (isWordPressInstallation(cwd)) {
			// We're in a WordPress installation, so we need to create package.json here
			console.log('WordPress installation detected. Setting up monorepo structure...');

			// Create package.json if it doesn't exist
			const packageJsonPath = path.join(cwd, 'package.json');
			if (!fs.existsSync(packageJsonPath)) {
				const packageJson = {
					name: 'wp-monorepo-project',
					version: '1.0.0',
					private: true,
					workspaces: ['wp-content/themes/*', 'wp-content/plugins/*'],
					scripts: {
						build: 'turbo run build',
						'build:dev': 'turbo run build:dev',
						'build:prod': 'turbo run build:prod',
						start: 'turbo run start',
						lint: 'turbo run lint',
						format: 'turbo run format',
						clean: 'turbo run clean',
					},
					dependencies: {
						'wp-monorepo-manager':
							'file:' + path.relative(cwd, path.dirname(__dirname)),
						'@wordpress/browserslist-config': '^6.25.0',
						'@wordpress/eslint-plugin': '22.11.0',
						'@wordpress/scripts': '30.18.0',
						'css-loader': '^7.1.2',
						'eslint-config-wordpress': '2.0.0',
						'postcss-import': '^16.1.0',
						prettier: '3.5.3',
						sass: '^1.71.0',
						'sass-loader': '^16.0.5',
						stylelint: '16.20.0',
						'stylelint-scss': '^6.11.1',
						turbo: '2.5.4',
					},
					packageManager: 'npm@10.2.4',
				};

				fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
				console.log('Created package.json');
			}

			// Create turbo.json if it doesn't exist
			const turboJsonPath = path.join(cwd, 'turbo.json');
			if (!fs.existsSync(turboJsonPath)) {
				const turboJson = {
					$schema: 'https://turbo.build/schema.json',
					globalDependencies: ['**/.env.*local'],
					tasks: {
						build: {
							dependsOn: ['^build'],
							outputs: ['dist/**'],
						},
						'build:dev': {
							dependsOn: ['^build:dev'],
							outputs: ['dist/**'],
						},
						'build:prod': {
							dependsOn: ['^build:prod'],
							outputs: ['dist/**'],
						},
						start: {
							cache: false,
							persistent: true,
						},
						lint: {
							outputs: [],
						},
						format: {
							outputs: [],
						},
						clean: {
							cache: false,
						},
					},
				};

				fs.writeFileSync(turboJsonPath, JSON.stringify(turboJson, null, 2));
				console.log('Created turbo.json');
			}

			// Install dependencies
			console.log('Installing dependencies...');
			execSync('npm install', { cwd, stdio: 'inherit' });

			console.log('Monorepo setup completed! You can now use:');
			console.log('  wp-monorepo setup:theme    - Create a new theme');
			console.log('  wp-monorepo setup:plugin   - Create a new plugin');
		} else {
			// We're not in a WordPress installation, use the original setup script
			execSync(`node ${path.join(__dirname, '..', 'scripts', setupScript + '.js')}`, {
				stdio: 'inherit',
				cwd: path.dirname(__dirname),
			});
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
