const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = path.resolve(PACKAGE_DIR, '../wp-monorepo-test');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Helper functions
function createDirectory(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content);
}

function promptUser(question) {
	return new Promise(resolve => {
		rl.question(question, answer => {
			resolve(answer);
		});
	});
}

async function setupPlugin() {
	try {
		// Check if target directory exists
		if (!fs.existsSync(TARGET_DIR)) {
			console.log('Error: Target directory does not exist. Please run setup first.');
			rl.close();
			return;
		}

		// Get plugin name from user
		const pluginName = await promptUser('Enter plugin name: ');
		if (!pluginName.trim()) {
			console.log('Plugin name is required.');
			rl.close();
			return;
		}

		const pluginDir = path.join(TARGET_DIR, 'wp-content/plugins', pluginName);

		// Check if plugin already exists
		if (fs.existsSync(pluginDir)) {
			const shouldOverwrite = await promptUser(
				`Plugin "${pluginName}" already exists. Overwrite? (y/n): `
			);
			if (shouldOverwrite.toLowerCase() !== 'y' && shouldOverwrite.toLowerCase() !== 'yes') {
				console.log('Setup cancelled.');
				rl.close();
				return;
			}
		}

		// Create plugin package.json
		const pluginPackageJson = {
			name: pluginName,
			version: '1.0.0',
			browserslist: ['extends @wordpress/browserslist-config'],
			scripts: {
				build: 'wp-monorepo-manager build',
				'build:dev': 'wp-monorepo-manager build:dev',
				'build:prod': 'wp-monorepo-manager build:prod',
				start: 'wp-monorepo-manager start',
				lint: 'wp-monorepo-manager lint',
				format: 'wp-monorepo-manager format',
				clean: 'wp-monorepo-manager clean',
			},
		};

		// Create plugin directory structure
		createDirectory(pluginDir);
		createDirectory(path.join(pluginDir, 'src/scripts'));
		createDirectory(path.join(pluginDir, 'src/styles'));

		// Create plugin files
		writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(pluginPackageJson, null, 2));
		writeFile(
			path.join(pluginDir, `${pluginName}.php`),
			`<?php
/**
 * Plugin Name: ${pluginName}
 * Description: A custom WordPress plugin
 * Version: 1.0.0
 * Author: Your Name
 *
 * @package ${pluginName}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Plugin initialization
function ${pluginName.replace(/[^a-zA-Z0-9]/g, '_')}_init() {
	// Plugin initialization code here
}
add_action('init', '${pluginName.replace(/[^a-zA-Z0-9]/g, '_')}_init');

// Enqueue scripts and styles
function ${pluginName.replace(/[^a-zA-Z0-9]/g, '_')}_enqueue_scripts() {
	wp_enqueue_script(
		'${pluginName}-script',
		plugin_dir_url(__FILE__) . 'dist/scripts/index.js',
		array(),
		'1.0.0',
		true
	);

	wp_enqueue_style(
		'${pluginName}-style',
		plugin_dir_url(__FILE__) . 'dist/styles/index.css',
		array(),
		'1.0.0'
	);
}
add_action('wp_enqueue_scripts', '${pluginName.replace(/[^a-zA-Z0-9]/g, '_')}_enqueue_scripts');
`
		);
		writeFile(
			path.join(pluginDir, 'src/scripts/index.js'),
			`console.log("${pluginName} plugin script loaded");`
		);
		writeFile(
			path.join(pluginDir, 'src/styles.scss'),
			`/* ${pluginName} Plugin Styles */

.plugin-${pluginName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()} {
	/* Plugin styles here */
}`
		);
		writeFile(
			path.join(pluginDir, 'README.md'),
			`# ${pluginName}

A custom WordPress plugin.

## Development

\`\`\`bash
npm run build    # Build for production
npm run build:dev # Build for development
npm run start     # Start development mode
npm run lint      # Run linting
npm run format    # Format code
npm run clean     # Clean build artifacts
\`\`\`
`
		);

		// Install dependencies in the plugin directory
		execSync('npm install', { cwd: pluginDir, stdio: 'inherit' });

		console.log(`\nPlugin "${pluginName}" created successfully!`);
		console.log(`\nNext steps:`);
		console.log(`1. cd wp-content/plugins/${pluginName}`);
		console.log(`2. npm run build`);

		rl.close();
	} catch (error) {
		console.error('\nError during plugin setup:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run setup
setupPlugin();
