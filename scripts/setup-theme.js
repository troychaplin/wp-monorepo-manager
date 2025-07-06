const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
	createDirectory,
	writeFile,
	promptUser,
	promptYesNo,
	toFolderName,
	closeReadline,
} = require('./utils');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.cwd();

// Function to copy composer.json template for theme
async function copyComposerJson(folderName) {
	const composerTemplatePath = path.join(
		PACKAGE_DIR,
		'config',
		'composer',
		'composer-theme.json'
	);
	const themeComposerPath = path.join(
		TARGET_DIR,
		'wp-content',
		'themes',
		folderName,
		'composer.json'
	);

	try {
		// Copy the composer template
		fs.copyFileSync(composerTemplatePath, themeComposerPath);
		console.log('✅ Theme composer.json created');
	} catch (error) {
		console.error('❌ Error creating composer.json:', error.message);
	}
}

// Function to update root composer.json with theme scripts
async function updateRootComposerJson(folderName) {
	const rootComposerPath = path.join(TARGET_DIR, 'composer.json');

	// Check if root composer.json exists
	if (!fs.existsSync(rootComposerPath)) {
		console.log('⚠️  composer.json not found in the root directory.');
		console.log('   Composer scripts will not be added.');
		return;
	}

	try {
		// Read existing composer.json
		const composerContent = fs.readFileSync(rootComposerPath, 'utf8');
		const composer = JSON.parse(composerContent);

		// Initialize scripts object if it doesn't exist
		if (!composer.scripts) {
			composer.scripts = {};
		}

		// Create script names using the pattern
		const scriptNamePrefix = folderName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
		const lintScriptName = `lint-theme-php-${scriptNamePrefix}`;
		const formatScriptName = `format-theme-php-${scriptNamePrefix}`;

		// Add new scripts
		composer.scripts[lintScriptName] =
			`./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/${folderName}`;
		composer.scripts[formatScriptName] =
			`./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes/${folderName} || true`;

		// Write updated composer.json
		fs.writeFileSync(rootComposerPath, JSON.stringify(composer, null, 2));
		console.log('✅ Root composer.json updated with scripts:');
		console.log(`   • ${lintScriptName} - Lint PHP files`);
		console.log(`   • ${formatScriptName} - Format PHP files`);
	} catch (error) {
		console.error('❌ Error updating root composer.json:', error.message);
	}
}

async function setupTheme() {
	try {
		// Get theme name from user
		const themeName = await promptUser('Enter theme name: ');
		if (!themeName.trim()) {
			console.log('❌ Theme name is required.');
			closeReadline();
			process.exit(0);
		}

		// Generate default folder name from theme name
		const defaultFolderName = toFolderName(themeName);

		// Get theme folder name from user
		const themeFolderName = await promptUser(
			`Enter theme folder name (default: ${defaultFolderName}): `
		);
		const folderName = themeFolderName.trim() || defaultFolderName;

		// Determine the theme directory path
		const wpContentThemesPath = path.join(TARGET_DIR, 'wp-content/themes');
		const themeDir = path.join(wpContentThemesPath, folderName);

		// Check if theme already exists
		if (fs.existsSync(themeDir)) {
			const shouldOverwrite = await promptYesNo(
				`Theme "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (!shouldOverwrite) {
				console.log('Setup cancelled.');
				closeReadline();
				process.exit(0);
			}
		}

		// Read theme package.json template
		const themePackageTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'package',
			'package-theme.json'
		);
		let themePackageContent = fs.readFileSync(themePackageTemplatePath, 'utf8');
		themePackageContent = themePackageContent.replace(/\{\{PROJECT_NAME\}\}/g, folderName);
		const themePackageJson = JSON.parse(themePackageContent);

		// Create theme directory structure
		createDirectory(themeDir);
		createDirectory(path.join(themeDir, 'src'));

		// Sanitize theme name for PHP function names
		const sanitizedName = themeName.replace(/[^a-zA-Z0-9]/g, '_');
		const kebabName = themeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

		// Track what was created
		const createdItems = [];

		// Create theme files
		writeFile(path.join(themeDir, 'package.json'), JSON.stringify(themePackageJson, null, 2));
		createdItems.push('package.json');

		// Copy webpack configuration
		const webpackThemeTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'webpack',
			'webpack-theme.js'
		);
		const webpackThemePath = path.join(themeDir, 'webpack.config.js');
		fs.copyFileSync(webpackThemeTemplatePath, webpackThemePath);
		createdItems.push('webpack configuration');

		// Copy turbo.json for theme
		const turboThemeTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'turbo',
			'turbo-theme.json'
		);
		const turboThemePath = path.join(themeDir, 'turbo.json');
		fs.copyFileSync(turboThemeTemplatePath, turboThemePath);
		createdItems.push('turbo.json configuration');

		// Copy .prettierignore for theme
		const prettierIgnoreTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'prettier',
			'.prettierignore'
		);
		const prettierIgnoreThemePath = path.join(themeDir, '.prettierignore');
		fs.copyFileSync(prettierIgnoreTemplatePath, prettierIgnoreThemePath);
		createdItems.push('.prettierignore configuration');
		createdItems.push('package.json');
		writeFile(
			path.join(themeDir, 'index.php'),
			`<?php
/**
 * ${themeName}
 *
 * @package ${themeName}
 */

get_header(); ?>

<main id="main" class="site-main">
	<?php
	if (have_posts()) :
		while (have_posts()) :
			the_post();
			get_template_part('template-parts/content', get_post_type());
		endwhile;
	else :
		get_template_part('template-parts/content', 'none');
	endif;
	?>
</main>

<?php
get_sidebar();
get_footer();
`
		);
		createdItems.push('index.php');

		writeFile(
			path.join(themeDir, 'style.css'),
			`/*
Theme Name: ${themeName}
Description: A custom WordPress theme
Version: 1.0.0
Author: Your Name
*/

/* This file is required by WordPress but styles are compiled from src/styles.scss */
`
		);
		createdItems.push('style.css');

		writeFile(
			path.join(themeDir, 'functions.php'),
			`<?php
/**
 * ${themeName} functions and definitions
 *
 * @package ${themeName}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Theme setup
function ${sanitizedName}_setup() {
	// Add theme support for various features
	add_theme_support('post-thumbnails');
	add_theme_support('title-tag');
	add_theme_support('html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	));
}
add_action('after_setup_theme', '${sanitizedName}_setup');

// Enqueue scripts and styles
function ${sanitizedName}_scripts() {
	wp_enqueue_style(
		'${kebabName}-style',
		get_template_directory_uri() . '/build/styles.css',
		array(),
		'1.0.0'
	);

	wp_enqueue_script(
		'${kebabName}-script',
		get_template_directory_uri() . '/build/scripts.js',
		array(),
		'1.0.0',
		true
	);
}
add_action('wp_enqueue_scripts', '${sanitizedName}_scripts');
`
		);
		createdItems.push('functions.php');

		writeFile(
			path.join(themeDir, 'src/scripts.js'),
			`// eslint-disable-next-line no-console
console.log("${themeName} theme script loaded");`
		);
		createdItems.push('JavaScript entry point');

		writeFile(
			path.join(themeDir, 'src/styles.scss'),
			`/* ${themeName} Theme Styles */

body { 
	color: #333; 
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	line-height: 1.6;
	margin: 0;
	padding: 0;
}

.site-main {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

/* Add your custom styles here */
.${kebabName} {
	/* Theme-specific styles */
}`
		);
		createdItems.push('SCSS stylesheet');
		writeFile(
			path.join(themeDir, 'src/editor-styles.scss'),
			`/* ${themeName} Editor Styles */

/* Styles for the WordPress editor */
.wp-block {
	max-width: 100%;
}

.editor-styles-wrapper {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	line-height: 1.6;
}

/* Add editor-specific styles here */`
		);
		createdItems.push('editor stylesheet');

		writeFile(
			path.join(themeDir, 'README.md'),
			`# ${themeName}

A custom WordPress theme built with the WordPress Monorepo Manager.

## Development

\`\`\`bash
npm run build       # Build for production
npm run start       # Start development mode with watch
npm run format      # Format code with Prettier
npm run clean       # Clean build artifacts
\`\`\`

## Theme Structure

- \`src/scripts.js\` - Main JavaScript file
- \`src/styles.scss\` - Main stylesheet
- \`src/editor-styles.scss\` - Editor-specific styles
- \`build/\` - Built assets (generated automatically)

## Features

- Modern build system with Webpack
- SCSS support
- Editor styles
- WordPress coding standards
`
		);
		createdItems.push('README.md');

		// Create composer.json for theme
		await copyComposerJson(folderName);
		createdItems.push('composer.json');

		// Update root composer.json with theme scripts
		await updateRootComposerJson(folderName);
		createdItems.push('root composer scripts');

		// Install composer dependencies for the theme
		console.log('\n📦 Installing Composer dependencies...');
		execSync('composer install', { cwd: themeDir, stdio: 'inherit' });
		createdItems.push('composer dependencies');

		// Success summary
		console.log('\n✅ Theme setup completed successfully!');
		console.log(`\n📁 Location: ${path.relative(TARGET_DIR, themeDir)}`);
		console.log('\n📋 Created:');
		createdItems.forEach(item => console.log(`   • ${item}`));
		console.log('\n🚀 Next steps:');
		console.log('   1. Run "npm run build" to build the theme');
		console.log('   2. Run "npm run start" to start development mode');
		console.log('   3. Activate the theme in WordPress admin');

		closeReadline();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error during theme setup:', error.message);
		closeReadline();
		process.exit(1);
	}
}

// Run setup
setupTheme();
