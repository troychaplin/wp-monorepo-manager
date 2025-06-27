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

// Convert theme name to lowercase hyphenated folder name
function toFolderName(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

async function setupTheme() {
	try {
		// Get theme name from user
		const themeName = await promptUser('Enter theme name: ');
		if (!themeName.trim()) {
			console.log('Theme name is required.');
			rl.close();
			return;
		}

		// Generate default folder name from theme name
		const defaultFolderName = toFolderName(themeName);

		// Get theme folder name from user
		const themeFolderName = await promptUser(
			`Enter theme folder name (default: ${defaultFolderName}): `
		);
		const folderName = themeFolderName.trim() || defaultFolderName;

		// Determine the theme directory path
		// Check if we're in a WordPress installation (has wp-content/themes)
		const wpContentThemesPath = path.join(TARGET_DIR, 'wp-content/themes');
		const themeDir = fs.existsSync(wpContentThemesPath)
			? path.join(wpContentThemesPath, folderName)
			: path.join(TARGET_DIR, 'themes', folderName);

		// Check if theme already exists
		if (fs.existsSync(themeDir)) {
			const shouldOverwrite = await promptUser(
				`Theme "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (shouldOverwrite.toLowerCase() !== 'y' && shouldOverwrite.toLowerCase() !== 'yes') {
				console.log('Setup cancelled.');
				rl.close();
				return;
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
			path.join(themeDir, '.gitignore'),
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

		console.log(`\nTheme "${themeName}" created successfully in "${folderName}" folder!`);
		console.log(`\nTheme location: ${themeDir}`);
		console.log(`\nNext steps:`);
		console.log(`1. Add the theme to your root package.json workspaces if needed`);
		console.log(`2. Run npm install from the project root to install dependencies`);
		console.log(`3. Use npm run build from the project root to build all themes`);

		rl.close();
	} catch (error) {
		console.error('\nError during theme setup:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run setup
setupTheme();
