const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { createDirectory, writeFile, promptYesNo, closeReadline } = require('./utils');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2] || process.cwd();

// Configuration file paths
const CONFIG_FILES = {
	'.editorconfig': path.join(PACKAGE_DIR, 'config', 'editorconfig', '.editorconfig'),
	'.eslintrc.json': path.join(PACKAGE_DIR, 'config', 'eslint', '.eslintrc.json'),
	'.prettierignore': path.join(PACKAGE_DIR, 'config', 'prettier', '.prettierignore'),
	'.prettierrc': path.join(PACKAGE_DIR, 'config', 'prettier', '.prettierrc'),
	'.stylelintignore': path.join(PACKAGE_DIR, 'config', 'stylelint', '.stylelintignore'),
	'.stylelintrc.json': path.join(PACKAGE_DIR, 'config', 'stylelint', '.stylelintrc.json'),
	'composer.json': path.join(PACKAGE_DIR, 'config', 'composer', 'composer.json'),
	'package.json': path.join(PACKAGE_DIR, 'config', 'package', 'package.json'),
	'phpcs.xml.dist': path.join(PACKAGE_DIR, 'config', 'phpcs', 'phpcs.xml.dist'),
	'turbo.json': path.join(PACKAGE_DIR, 'config', 'turbo', 'turbo.json'),
};

async function setup() {
	try {
		// Check if there are existing configuration files that would be overwritten
		const configFiles = [
			'.editorconfig',
			'.eslintrc.json',
			'.prettierrc',
			'.stylelintrc.json',
			'composer.json',
			'package.json',
			'phpcs.xml.dist',
			'turbo.json',
		];

		const existingConfigFiles = configFiles.filter(file =>
			fs.existsSync(path.join(TARGET_DIR, file))
		);

		if (existingConfigFiles.length > 0) {
			const message = `The following configuration files already exist in ${TARGET_DIR}:\n  ${existingConfigFiles.join('\n  ')}\n\nDo you want to proceed and overwrite them? (y/n): `;

			const shouldProceed = await promptYesNo(message);
			if (!shouldProceed) {
				closeReadline();
				process.exit(0);
			}
		}

		// Create target directory if it doesn't exist
		createDirectory(TARGET_DIR);

		// Write configuration files as documented in README.md
		console.log('📝 Creating configuration files...');

		// Copy configuration files from the package
		for (const [filename, sourcePath] of Object.entries(CONFIG_FILES)) {
			const targetPath = path.join(TARGET_DIR, filename);
			let content = fs.readFileSync(sourcePath, 'utf8');

			// Replace template variables
			const projectName = path.basename(TARGET_DIR);
			content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);

			fs.writeFileSync(targetPath, content);
			console.log(`  ✓ Copied ${filename}`);
		}

		// Link the package globally from the package directory
		execSync('npm link', { cwd: PACKAGE_DIR, stdio: 'inherit' });

		// Install npm dependencies
		execSync('npm install', { cwd: TARGET_DIR, stdio: 'inherit' });

		// Install composer dependencies
		console.log('📦 Installing Composer dependencies...');
		execSync('composer install', { cwd: TARGET_DIR, stdio: 'inherit' });

		// Link the package in the target directory (only if not in development mode)
		if (TARGET_DIR !== PACKAGE_DIR) {
			execSync('npm link wp-monorepo-manager', {
				cwd: TARGET_DIR,
				stdio: 'inherit',
			});
		}

		console.log('\n✅ Monorepo setup completed successfully!');
		console.log('\n📁 Created configuration files:');
		console.log('  • .eslintrc.json - ESLint configuration');
		console.log('  • .stylelintrc.json - StyleLint configuration');
		console.log('  • .stylelintignore - StyleLint ignore rules');
		console.log('  • .prettierrc - Prettier configuration');
		console.log('  • .prettierignore - Prettier ignore rules');
		console.log('  • phpcs.xml.dist - PHP CodeSniffer configuration');
		console.log('  • .editorconfig - Editor configuration');
		console.log('  • composer.json - Composer configuration');
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
