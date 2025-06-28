const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
	createDirectory,
	writeFile,
	promptYesNo,
	closeReadline,
	SHARED_DEPENDENCIES,
	SHARED_SCRIPTS,
	TURBO_CONFIG,
} = require('./utils');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2] || process.cwd();

// Configuration file templates
const ESLINTRC_CONTENT = {
	extends: ['wp-monorepo-manager/config/eslint'],
};

const STYLELINTRC_CONTENT = {
	extends: ['wp-monorepo-manager/config/stylelint'],
};

const STYLELINTIGNORE_CONTENT = `node_modules
dist
build
`;

const PRETTIERRC_CONTENT = {
	extends: ['wp-monorepo-manager/config/prettier'],
};

const PRETTIERIGNORE_CONTENT = `node_modules
dist
build
`;

const PHPCS_XML_CONTENT = `<?xml version="1.0"?>
<ruleset name="WordPress Monorepo Standards">
    <rule ref="wp-monorepo-manager/config/phpcs"/>
</ruleset>
`;

const EDITORCONFIG_CONTENT = `root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,yml,yaml,md}]
indent_size = 2
`;

const COMPOSER_JSON_CONTENT = {
	require_dev: {
		'squizlabs/php_codesniffer': '^3.12.0',
		'wp-coding-standards/wpcs': '^3.1',
	},
	config: {
		allow_plugins: {
			'dealerdirect/phpcodesniffer-composer-installer': true,
		},
	},
	scripts: {
		'lint-plugin-php':
			'./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/plugins/test-plugin',
		'format-plugin-php':
			'./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/plugins/test-plugin || true',
		'lint-theme-php':
			'./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/test-theme',
		'format-theme-php':
			'./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes/test-theme || true',
	},
};

async function setup() {
	try {
		// Check if there are existing configuration files that would be overwritten
		const configFiles = [
			'package.json',
			'turbo.json',
			'.eslintrc.json',
			'.stylelintrc.json',
			'.prettierrc',
			'phpcs.xml.dist',
			'.editorconfig',
			'composer.json',
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

		// Create root package.json
		const rootPackageJson = {
			name: path.basename(TARGET_DIR),
			version: '1.0.0',
			private: true,
			workspaces: ['wp-content/themes/*', 'wp-content/plugins/*'],
			scripts: SHARED_SCRIPTS,
			dependencies: {
				...SHARED_DEPENDENCIES,
			},
			packageManager: 'npm@10.2.4',
		};

		// Write root files
		writeFile(path.join(TARGET_DIR, 'package.json'), JSON.stringify(rootPackageJson, null, 2));
		writeFile(path.join(TARGET_DIR, 'turbo.json'), JSON.stringify(TURBO_CONFIG, null, 2));

		// Write configuration files as documented in README.md
		console.log('📝 Creating configuration files...');

		// ESLint configuration
		writeFile(
			path.join(TARGET_DIR, '.eslintrc.json'),
			JSON.stringify(ESLINTRC_CONTENT, null, 2)
		);

		// StyleLint configuration
		writeFile(
			path.join(TARGET_DIR, '.stylelintrc.json'),
			JSON.stringify(STYLELINTRC_CONTENT, null, 2)
		);
		writeFile(path.join(TARGET_DIR, '.stylelintignore'), STYLELINTIGNORE_CONTENT);

		// Prettier configuration
		writeFile(
			path.join(TARGET_DIR, '.prettierrc'),
			JSON.stringify(PRETTIERRC_CONTENT, null, 2)
		);
		writeFile(path.join(TARGET_DIR, '.prettierignore'), PRETTIERIGNORE_CONTENT);

		// PHPCS configuration
		writeFile(path.join(TARGET_DIR, 'phpcs.xml.dist'), PHPCS_XML_CONTENT);

		// Editor configuration
		writeFile(path.join(TARGET_DIR, '.editorconfig'), EDITORCONFIG_CONTENT);

		// Composer configuration
		writeFile(
			path.join(TARGET_DIR, 'composer.json'),
			JSON.stringify(COMPOSER_JSON_CONTENT, null, 2)
		);

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
