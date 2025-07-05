const path = require('path');
const fs = require('fs');
const {
	createDirectory,
	writeFile,
	promptUser,
	promptYesNo,
	toFolderName,
	closeReadline,
} = require('./utils');

// Configuration
const TARGET_DIR = process.cwd();

// Function to update composer.json with plugin scripts
async function updateComposerJson(folderName) {
	const composerPath = path.join(TARGET_DIR, 'composer.json');

	// Check if composer.json exists
	if (!fs.existsSync(composerPath)) {
		console.log('\n⚠️  composer.json not found in the current directory.');
		console.log('   Composer scripts will not be added.');
		return;
	}

	try {
		// Read existing composer.json
		const composerContent = fs.readFileSync(composerPath, 'utf8');
		const composer = JSON.parse(composerContent);

		// Initialize scripts object if it doesn't exist
		if (!composer.scripts) {
			composer.scripts = {};
		}

		// Create script names using the pattern
		const scriptNamePrefix = folderName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
		const lintScriptName = `lint-php-${scriptNamePrefix}`;
		const formatScriptName = `format-php-${scriptNamePrefix}`;

		// Check for existing scripts with the same names
		const existingScripts = [];
		if (composer.scripts[lintScriptName]) {
			existingScripts.push(lintScriptName);
		}
		if (composer.scripts[formatScriptName]) {
			existingScripts.push(formatScriptName);
		}

		// If scripts already exist, ask user what to do
		if (existingScripts.length > 0) {
			console.log('\n⚠️  Composer scripts already exist:');
			existingScripts.forEach(script => {
				console.log(`   • ${script}`);
			});
			console.log('\nThese scripts will be updated to point to the new plugin.');
			const shouldReplace = await promptYesNo('Replace existing scripts? (y/n): ');
			if (!shouldReplace) {
				console.log('📝 Skipping composer.json update.');
				return;
			}
		}

		// Add new scripts
		composer.scripts[lintScriptName] =
			`./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/plugins/${folderName}`;
		composer.scripts[formatScriptName] =
			`./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/plugins/${folderName} || true`;

		// Write updated composer.json
		fs.writeFileSync(composerPath, JSON.stringify(composer, null, 2));
		console.log('\n✅ Composer scripts added:');
		console.log(`   • ${lintScriptName} - Lint PHP files`);
		console.log(`   • ${formatScriptName} - Format PHP files`);
	} catch (error) {
		console.error('❌ Error updating composer.json:', error.message);
	}
}

async function setupPlugin() {
	try {
		// Get plugin name from user
		const pluginName = await promptUser('Enter plugin name: ');
		if (!pluginName.trim()) {
			console.log('❌ Plugin name is required.');
			closeReadline();
			process.exit(0);
		}

		// Generate default folder name from plugin name
		const defaultFolderName = toFolderName(pluginName);

		// Get plugin folder name from user
		const pluginFolderName = await promptUser(
			`Enter plugin folder name (default: ${defaultFolderName}): `
		);
		const folderName = pluginFolderName.trim() || defaultFolderName;

		// Determine the plugin directory path
		const wpContentPluginsPath = path.join(TARGET_DIR, 'wp-content/plugins');
		const pluginDir = path.join(wpContentPluginsPath, folderName);

		// Check if plugin already exists
		if (fs.existsSync(pluginDir)) {
			const shouldOverwrite = await promptYesNo(
				`Plugin "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (!shouldOverwrite) {
				console.log('Setup cancelled.');
				closeReadline();
				process.exit(0);
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

		// Sanitize plugin name for PHP function names
		const sanitizedName = pluginName.replace(/[^a-zA-Z0-9]/g, '_');
		const kebabName = pluginName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

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
function ${sanitizedName}_init() {
	// Plugin initialization code here
}
add_action('init', '${sanitizedName}_init');

// Enqueue scripts and styles
function ${sanitizedName}_enqueue_scripts() {
	wp_enqueue_script(
		'${kebabName}-script',
		plugin_dir_url(__FILE__) . 'dist/scripts/index.js',
		array(),
		'1.0.0',
		true
	);

	wp_enqueue_style(
		'${kebabName}-style',
		plugin_dir_url(__FILE__) . 'dist/styles/index.css',
		array(),
		'1.0.0'
	);
}
add_action('wp_enqueue_scripts', '${sanitizedName}_enqueue_scripts');
`
		);
		writeFile(
			path.join(pluginDir, 'src/scripts/index.js'),
			`console.log("${pluginName} plugin script loaded");`
		);
		writeFile(
			path.join(pluginDir, 'src/styles.scss'),
			`/* ${pluginName} Plugin Styles */

.plugin-${kebabName} {
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

		// Update composer.json with plugin scripts
		await updateComposerJson(folderName);

		console.log(`\n✅ Plugin "${pluginName}" created successfully in ${pluginDir}`);

		closeReadline();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error during plugin setup:', error.message);
		closeReadline();
		process.exit(1);
	}
}

// Run setup
setupPlugin();
