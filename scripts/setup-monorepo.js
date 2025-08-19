const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { createDirectory, promptYesNo, closeReadline } = require('./utils');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isSafeMode = args.includes('--safe');
const targetDirArg = args.find(arg => !arg.startsWith('--'));

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = targetDirArg || process.cwd();

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

function createBackup(targetDir, filesToBackup) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const backupDir = path.join(targetDir, '.wp-dependency-backups', timestamp);

	if (filesToBackup.length > 0) {
		createDirectory(backupDir);

		for (const file of filesToBackup) {
			const sourcePath = path.join(targetDir, file);
			const backupPath = path.join(backupDir, file);

			// Create subdirectories if needed
			const backupSubDir = path.dirname(backupPath);
			if (backupSubDir !== backupDir) {
				createDirectory(backupSubDir);
			}

			fs.copyFileSync(sourcePath, backupPath);
		}

		console.log(`📦 Backed up existing files to: ${path.relative(targetDir, backupDir)}`);
		return backupDir;
	}

	return null;
}

async function setup() {
	try {
		// Handle dry run mode
		if (isDryRun) {
			console.log('🔍 DRY RUN MODE - No files will be modified\n');

			console.log('Files that would be created/modified:');
			for (const filename of Object.keys(CONFIG_FILES)) {
				const targetPath = path.join(TARGET_DIR, filename);
				const exists = fs.existsSync(targetPath);
				console.log(
					`  ${exists ? '📝' : '✨'} ${filename} ${exists ? '(would overwrite)' : '(would create)'}`
				);
			}

			console.log('\nTo actually perform setup, run without --dry-run flag');
			console.log('Example: wp-dependency setup');
			closeReadline();
			process.exit(0);
		}

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
			console.log('\n⚠️  WARNING: Configuration files already exist!');
			console.log('\nExisting files that would be overwritten:');
			existingConfigFiles.forEach(file => {
				const filePath = path.join(TARGET_DIR, file);
				const stats = fs.statSync(filePath);
				console.log(`  • ${file} (modified: ${stats.mtime.toLocaleString()})`);
			});

			console.log('\n💡 Options:');
			console.log('  1. Backup existing files and proceed');
			console.log('  2. Skip setup (you can run this again later)');
			console.log('  3. Use --dry-run to preview changes first');
			console.log('  4. Use --safe to only create missing files');

			const shouldProceed = await promptYesNo('\nProceed with backup and setup? (y/n): ');
			if (!shouldProceed) {
				console.log('Setup cancelled. Run wp-dependency setup again when ready.');
				closeReadline();
				process.exit(0);
			}

			// Create backup before proceeding
			const backupPath = createBackup(TARGET_DIR, existingConfigFiles);
			if (backupPath) {
				console.log('✅ Backup created successfully\n');
			}
		}

		// Create target directory if it doesn't exist
		createDirectory(TARGET_DIR);

		// Write configuration files as documented in README.md
		console.log('📝 Creating configuration files...');

		// Copy configuration files from the package
		for (const [filename, sourcePath] of Object.entries(CONFIG_FILES)) {
			const targetPath = path.join(TARGET_DIR, filename);

			if (isSafeMode && fs.existsSync(targetPath)) {
				console.log(`  ⏭️  Skipped ${filename} (already exists, safe mode)`);
				continue;
			}

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
			execSync('npm link wp-dependency-manager', {
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
		console.log('1. Use "wp-dependency setup:theme" to create a new theme');
		console.log('2. Use "wp-dependency setup:plugin" to create a new plugin');

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
