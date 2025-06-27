const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2] || path.resolve(PACKAGE_DIR, '../wp-monorepo-test');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Helper functions
function createDirectory(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		// console.log(`Created directory: ${dir}`);
	}
}

function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content);
	// console.log(`Created file: ${filePath}`);
}

function isWordPressInstallation(dir) {
	// Check for common WordPress files/directories
	const wpFiles = ['wp-config.php', 'wp-content', 'wp-includes', 'wp-admin'];

	return wpFiles.some(file => fs.existsSync(path.join(dir, file)));
}

function promptUser(question) {
	return new Promise(resolve => {
		rl.question(question, answer => {
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
		});
	});
}

async function setup() {
	try {
		// Check if directory exists
		if (fs.existsSync(TARGET_DIR)) {
			const isWordPress = isWordPressInstallation(TARGET_DIR);
			const message = isWordPress
				? `A WordPress installation was detected in ${TARGET_DIR}. Do you want to proceed with adding the monorepo structure? (y/n): `
				: `The test directory already exists. Do you want to proceed with setup? (y/n): `;

			const shouldProceed = await promptUser(message);
			if (!shouldProceed) {
				// console.log('Setup cancelled by user.');
				rl.close();
				return;
			}
		}

		// Create test directory
		// console.log('Setting up test environment...');
		createDirectory(TARGET_DIR);

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
			dependencies: {
				'wp-monorepo-manager': TARGET_DIR.includes('wp-monorepo-test')
					? 'file:../wp-monorepo-manager'
					: 'wp-monorepo-manager',
				'@wordpress/browserslist-config': '^6.25.0',
				'@wordpress/eslint-plugin': '22.11.0',
				'@wordpress/scripts': '30.18.0',
				'css-loader': '^7.1.2',
				'eslint-config-wordpress': '2.0.0',
				'postcss-import': '^16.1.0',
				prettier: '3.5.3',
				sass: '^1.71.0',
				'sass-loader': '^16.0.5',
				stylelint: '16.20.0',
				'stylelint-scss': '^6.11.1',
				turbo: '2.5.4',
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

		// Create wp-content directory structure
		createDirectory(path.join(TARGET_DIR, 'wp-content/themes'));
		createDirectory(path.join(TARGET_DIR, 'wp-content/plugins'));

		// Write root files
		writeFile(path.join(TARGET_DIR, 'package.json'), JSON.stringify(rootPackageJson, null, 2));
		writeFile(path.join(TARGET_DIR, 'turbo.json'), JSON.stringify(turboJson, null, 2));

		// First, link the package globally from the package directory
		// console.log('\nLinking wp-monorepo-manager globally...');
		execSync('npm link', { cwd: PACKAGE_DIR, stdio: 'inherit' });

		// Install dependencies
		// console.log('\nInstalling dependencies...');
		execSync('npm install', { cwd: TARGET_DIR, stdio: 'inherit' });

		// Link the package in the test directory
		// console.log('\nLinking wp-monorepo-manager in test directory...');
		execSync('npm link wp-monorepo-manager', { cwd: TARGET_DIR, stdio: 'inherit' });

		// console.log('\nSetup completed successfully!');
		// console.log('\nNext steps:');
		// console.log('1. cd ../wp-monorepo-test');
		// console.log('2. Use setup-theme or setup-plugin commands to create themes/plugins');

		rl.close();
	} catch (error) {
		// console.error('\nError during setup:', error.message);
		rl.close();
		process.exit(1);
	}
}

// Run setup
setup();
