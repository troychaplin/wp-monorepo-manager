const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.cwd(); // Use current working directory instead of hardcoded path

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

// Convert plugin name to lowercase hyphenated folder name
function toFolderName(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

async function setupPlugin() {
	try {
		// Get plugin name from user
		const pluginName = await promptUser('Enter plugin name: ');
		if (!pluginName.trim()) {
			console.log('Plugin name is required.');
			rl.close();
			return;
		}

		// Generate default folder name from plugin name
		const defaultFolderName = toFolderName(pluginName);

		// Get plugin folder name from user
		const pluginFolderName = await promptUser(
			`Enter plugin folder name (default: ${defaultFolderName}): `
		);
		const folderName = pluginFolderName.trim() || defaultFolderName;

		// Determine the plugin directory path
		// Check if we're in a WordPress installation (has wp-content/plugins)
		const wpContentPluginsPath = path.join(TARGET_DIR, 'wp-content/plugins');
		const pluginDir = fs.existsSync(wpContentPluginsPath)
			? path.join(wpContentPluginsPath, folderName)
			: path.join(TARGET_DIR, 'plugins', folderName);

		// Check if plugin already exists
		if (fs.existsSync(pluginDir)) {
			const shouldOverwrite = await promptUser(
				`Plugin "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (shouldOverwrite.toLowerCase() !== 'y' && shouldOverwrite.toLowerCase() !== 'yes') {
				console.log('Setup cancelled.');
				rl.close();
				return;
			}
		}

		// Create plugin package.json
		const pluginPackageJson = {
			name: folderName,
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
			path.join(pluginDir, 'plugin.php'),
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
			path.join(pluginDir, 'src/editor-styles.scss'),
			`/* ${pluginName} Editor Styles */

/* Styles for the WordPress editor */
.wp-block {
	/* Editor-specific styles here */
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
		writeFile(
			path.join(pluginDir, '.gitignore'),
			`# Dependencies
node_modules/

# Build artifacts
dist/

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
`
		);

		console.log(`\nPlugin "${pluginName}" created successfully in "${folderName}" folder!`);
		console.log(`\nPlugin location: ${pluginDir}`);
		console.log(`\nNext steps:`);
		console.log(`1. Add the plugin to your root package.json workspaces if needed`);
		console.log(`2. Run npm install from the project root to install dependencies`);
		console.log(`3. Use npm run build from the project root to build all plugins`);

		rl.close();
	} catch (error) {
		console.error('\nError during plugin setup:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run setup
setupPlugin();
