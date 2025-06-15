const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const TEST_DIR = path.resolve(__dirname, '../../wp-monorepo-test');
const PACKAGE_DIR = path.resolve(__dirname, '..');

// Helper functions
function createDirectory(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created directory: ${dir}`);
	}
}

function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content);
	console.log(`Created file: ${filePath}`);
}

function setup() {
	try {
		// Create test directory
		console.log('Setting up test environment...');
		createDirectory(TEST_DIR);

		// Create root package.json
		const rootPackageJson = {
			name: 'wp-monorepo-test',
			version: '1.0.0',
			private: true,
			workspaces: ['wp-content/themes/*', 'wp-content/plugins/*'],
			scripts: {
				build: 'turbo run build',
				'build:dev': 'turbo run build:dev',
				'build:prod': 'turbo run build:prod',
				start: 'turbo run start',
				lint: 'turbo run lint',
				format: 'turbo run format',
				clean: 'turbo run clean',
			},
			devDependencies: {
				turbo: '^2.0.0',
				'wp-monorepo-manager': 'file:../wp-monorepo-manager',
			},
			packageManager: 'npm@10.2.4',
		};

		// Create turbo.json
		const turboJson = {
			$schema: 'https://turbo.build/schema.json',
			globalDependencies: ['**/.env.*local'],
			tasks: {
				build: {
					dependsOn: ['^build'],
					outputs: ['dist/**'],
				},
				'build:dev': {
					dependsOn: ['^build:dev'],
					outputs: ['dist/**'],
				},
				'build:prod': {
					dependsOn: ['^build:prod'],
					outputs: ['dist/**'],
				},
				start: {
					cache: false,
					persistent: true,
				},
				lint: {
					outputs: [],
				},
				format: {
					outputs: [],
				},
				clean: {
					cache: false,
				},
			},
		};

		// Create theme package.json
		const themePackageJson = {
			name: 'test-theme',
			version: '1.0.0',
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

		// Create plugin package.json
		const pluginPackageJson = {
			name: 'test-plugin',
			version: '1.0.0',
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

		// Create theme files
		const themeDir = path.join(TEST_DIR, 'wp-content/themes/test-theme');
		createDirectory(themeDir);
		createDirectory(path.join(themeDir, 'src/scripts'));
		writeFile(path.join(themeDir, 'package.json'), JSON.stringify(themePackageJson, null, 2));
		writeFile(
			path.join(themeDir, 'src/scripts/index.js'),
			'console.log("Theme script loaded");'
		);
		writeFile(path.join(themeDir, 'src/styles.scss'), 'body { color: #333; }');
		writeFile(path.join(themeDir, 'src/editor-styles.scss'), 'body { color: #333; }');

		// Create plugin files
		const pluginDir = path.join(TEST_DIR, 'wp-content/plugins/test-plugin');
		createDirectory(pluginDir);
		createDirectory(path.join(pluginDir, 'src/scripts'));
		writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(pluginPackageJson, null, 2));
		writeFile(
			path.join(pluginDir, 'src/scripts/index.js'),
			'console.log("Plugin script loaded");'
		);
		writeFile(path.join(pluginDir, 'src/styles.scss'), 'body { color: #333; }');
		writeFile(path.join(pluginDir, 'src/editor-styles.scss'), 'body { color: #333; }');

		// Write root files
		writeFile(path.join(TEST_DIR, 'package.json'), JSON.stringify(rootPackageJson, null, 2));
		writeFile(path.join(TEST_DIR, 'turbo.json'), JSON.stringify(turboJson, null, 2));

		// First, link the package globally from the package directory
		console.log('\nLinking wp-monorepo-manager globally...');
		execSync('npm link', { cwd: PACKAGE_DIR, stdio: 'inherit' });

		// Install dependencies
		console.log('\nInstalling dependencies...');
		execSync('npm install', { cwd: TEST_DIR, stdio: 'inherit' });

		// Link the package in the test directory
		console.log('\nLinking wp-monorepo-manager in test directory...');
		execSync('npm link wp-monorepo-manager', { cwd: TEST_DIR, stdio: 'inherit' });

		// Run initial build
		console.log('\nRunning initial build...');
		execSync('npm run build', { cwd: TEST_DIR, stdio: 'inherit' });

		console.log('\nSetup completed successfully!');
		console.log('\nNext steps:');
		console.log('1. cd wp-monorepo-test');
		console.log('2. npm run start');
	} catch (error) {
		console.error('\nError during setup:', error.message);
		process.exit(1);
	}
}

// Run setup
setup();
