const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
	createDirectory,
	writeFile,
	promptYesNo,
	isWordPressInstallation,
	closeReadline,
	SHARED_DEPENDENCIES,
	SHARED_SCRIPTS,
	TURBO_CONFIG,
} = require('./utils');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2] || process.cwd();

async function setup() {
	try {
		// Check if directory exists and handle WordPress installations
		if (fs.existsSync(TARGET_DIR)) {
			const isWordPress = isWordPressInstallation(TARGET_DIR);
			const message = isWordPress
				? `A WordPress installation was detected in ${TARGET_DIR}. Do you want to proceed with adding the monorepo structure? (y/n): `
				: `The directory already exists. Do you want to proceed with setup? (y/n): `;

			const shouldProceed = await promptYesNo(message);
			if (!shouldProceed) {
				closeReadline();
				process.exit(0);
			}
		}

		// Create target directory
		createDirectory(TARGET_DIR);

		// Create root package.json
		const rootPackageJson = {
			name: path.basename(TARGET_DIR),
			version: '1.0.0',
			private: true,
			workspaces: ['wp-content/themes/*', 'wp-content/plugins/*'],
			scripts: SHARED_SCRIPTS,
			dependencies: {
				'wp-monorepo-manager': 'wp-monorepo-manager',
				...SHARED_DEPENDENCIES,
			},
			packageManager: 'npm@10.2.4',
		};

		// Create wp-content directory structure
		createDirectory(path.join(TARGET_DIR, 'wp-content/themes'));
		createDirectory(path.join(TARGET_DIR, 'wp-content/plugins'));

		// Write root files
		writeFile(path.join(TARGET_DIR, 'package.json'), JSON.stringify(rootPackageJson, null, 2));
		writeFile(path.join(TARGET_DIR, 'turbo.json'), JSON.stringify(TURBO_CONFIG, null, 2));

		// Link the package globally from the package directory
		execSync('npm link', { cwd: PACKAGE_DIR, stdio: 'inherit' });

		// Install dependencies
		execSync('npm install', { cwd: TARGET_DIR, stdio: 'inherit' });

		// Link the package in the target directory
		execSync('npm link wp-monorepo-manager', { cwd: TARGET_DIR, stdio: 'inherit' });

		console.log('\n✅ Monorepo setup completed successfully!');
		console.log('\nNext steps:');
		console.log('1. Use "wp-monorepo setup:theme" to create a new theme');
		console.log('2. Use "wp-monorepo setup:plugin" to create a new plugin');

		closeReadline();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error during setup:', error.message);
		closeReadline();
		process.exit(1);
	}
}

// Run setup
setup();
