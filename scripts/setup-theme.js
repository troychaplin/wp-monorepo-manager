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

async function setupTheme() {
	try {
		// Check if target directory exists
		if (!fs.existsSync(TARGET_DIR)) {
			console.log('Error: Target directory does not exist. Please run setup first.');
			rl.close();
			return;
		}

		// Get theme name from user
		const themeName = await promptUser('Enter theme name: ');
		if (!themeName.trim()) {
			console.log('Theme name is required.');
			rl.close();
			return;
		}

		const themeDir = path.join(TARGET_DIR, 'wp-content/themes', themeName);

		// Check if theme already exists
		if (fs.existsSync(themeDir)) {
			const shouldOverwrite = await promptUser(
				`Theme "${themeName}" already exists. Overwrite? (y/n): `
			);
			if (shouldOverwrite.toLowerCase() !== 'y' && shouldOverwrite.toLowerCase() !== 'yes') {
				console.log('Setup cancelled.');
				rl.close();
				return;
			}
		}

		// Create theme package.json
		const themePackageJson = {
			name: themeName,
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

		// Install dependencies in the theme directory
		execSync('npm install', { cwd: themeDir, stdio: 'inherit' });

		console.log(`\nTheme "${themeName}" created successfully!`);
		console.log(`\nNext steps:`);
		console.log(`1. cd wp-content/themes/${themeName}`);
		console.log(`2. npm run build`);

		rl.close();
	} catch (error) {
		console.error('\nError during theme setup:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run setup
setupTheme();
