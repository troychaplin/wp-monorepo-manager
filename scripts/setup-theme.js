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

// Function to update composer.json with theme scripts
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
		const lintScriptName = `lint-theme-php-${scriptNamePrefix}`;
		const formatScriptName = `format-theme-php-${scriptNamePrefix}`;

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
			console.log('\nThese scripts will be updated to point to the new theme.');
			const shouldReplace = await promptYesNo('Replace existing scripts? (y/n): ');
			if (!shouldReplace) {
				console.log('📝 Skipping composer.json update.');
				return;
			}
		}

		// Add new scripts
		composer.scripts[lintScriptName] =
			`./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/${folderName}`;
		composer.scripts[formatScriptName] =
			`./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes/${folderName} || true`;

		// Write updated composer.json
		fs.writeFileSync(composerPath, JSON.stringify(composer, null, 2));
		console.log('\n✅ Composer scripts added:');
		console.log(`   • ${lintScriptName} - Lint PHP files`);
		console.log(`   • ${formatScriptName} - Format PHP files`);
	} catch (error) {
		console.error('❌ Error updating composer.json:', error.message);
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

		// Create theme package.json
		const themePackageJson = {
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

		// Create theme directory structure
		createDirectory(themeDir);
		createDirectory(path.join(themeDir, 'src/scripts'));
		createDirectory(path.join(themeDir, 'src/styles'));

		// Create theme files
		writeFile(path.join(themeDir, 'package.json'), JSON.stringify(themePackageJson, null, 2));
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
		writeFile(
			path.join(themeDir, 'src/scripts/index.js'),
			`console.log("${themeName} theme script loaded");`
		);
		writeFile(
			path.join(themeDir, 'src/styles.scss'),
			`body { 
	color: #333; 
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}`
		);
		writeFile(
			path.join(themeDir, 'src/editor-styles.scss'),
			`/* ${themeName} Editor Styles */

/* Styles for the WordPress editor */
.wp-block {
	/* Editor-specific styles here */
}`
		);
		writeFile(
			path.join(themeDir, 'README.md'),
			`# ${themeName}

A custom WordPress theme.

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

		// Update composer.json with theme scripts
		await updateComposerJson(folderName);

		console.log(`\n✅ Theme "${themeName}" created successfully in ${themeDir}`);

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
