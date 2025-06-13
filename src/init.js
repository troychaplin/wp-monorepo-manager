const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class ProjectInitializer {
	constructor(options) {
		this.targetDir = options.directory;
		this.projectName = options.name;
		this.templateDir = path.join(__dirname, '../templates');
		this.configDir = path.join(__dirname, '../config');
	}

	async initialize() {
		try {
			// Create project directory if it doesn't exist
			await fs.ensureDir(this.targetDir);

			// Initialize package.json
			await this.initializePackageJson();

			// Initialize composer.json
			await this.initializeComposerJson();

			// Copy configuration files
			await this.copyConfigFiles();

			// Create WordPress directory structure
			await this.createWordPressStructure();

			// Initialize git repository
			await this.initializeGit();

			console.log('\n✨ WordPress monorepo project initialized successfully!');
			console.log('\nNext steps:');
			console.log('1. cd ' + this.projectName);
			console.log('2. npm install');
			console.log('3. composer install');
			console.log('4. Add your first theme or plugin:');
			console.log('   - npm run wp-monorepo add theme my-theme');
			console.log('   - npm run wp-monorepo add plugin my-plugin');
		} catch (error) {
			throw new Error(`Failed to initialize project: ${error.message}`);
		}
	}

	async initializePackageJson() {
		const packageJson = {
			name: this.projectName,
			version: '0.0.1',
			private: true,
			workspaces: ['wp-content/plugins/*', 'wp-content/themes/*'],
			scripts: {
				build: 'wp-monorepo build',
				'build:theme': 'wp-monorepo build --workspace=theme',
				'build:plugin': 'wp-monorepo build --workspace=plugin',
				start: 'wp-monorepo start',
				'start:theme': 'wp-monorepo start --workspace=theme',
				'start:plugin': 'wp-monorepo start --workspace=plugin',
				clean: 'wp-monorepo clean',
			},
			dependencies: {
				'wp-monorepo-manager': 'latest',
			},
		};

		await fs.writeJson(path.join(this.targetDir, 'package.json'), packageJson, { spaces: 2 });
	}

	async initializeComposerJson() {
		const composerJson = {
			name: `${this.projectName}/wordpress`,
			description: 'WordPress installation for monorepo project',
			type: 'project',
			require: {
				php: '>=7.4',
				'composer/installers': '^2.0',
			},
			config: {
				'allow-plugins': {
					'composer/installers': true,
				},
			},
		};

		await fs.writeJson(path.join(this.targetDir, 'composer.json'), composerJson, { spaces: 2 });
	}

	async copyConfigFiles() {
		// Copy webpack config
		await fs.copy(
			path.join(this.configDir, 'webpack'),
			path.join(this.targetDir, 'config/webpack')
		);

		// Copy eslint config
		await fs.copy(
			path.join(this.configDir, 'eslint'),
			path.join(this.targetDir, 'config/eslint')
		);

		// Copy stylelint config
		await fs.copy(
			path.join(this.configDir, 'stylelint'),
			path.join(this.targetDir, 'config/stylelint')
		);

		// Copy phpcs config
		await fs.copy(
			path.join(this.configDir, 'phpcs'),
			path.join(this.targetDir, 'config/phpcs')
		);
	}

	async createWordPressStructure() {
		const wpContentDir = path.join(this.targetDir, 'wp-content');

		// Create WordPress content directories
		await fs.ensureDir(path.join(wpContentDir, 'plugins'));
		await fs.ensureDir(path.join(wpContentDir, 'themes'));
		await fs.ensureDir(path.join(wpContentDir, 'uploads'));
		await fs.ensureDir(path.join(wpContentDir, 'mu-plugins'));
	}

	async initializeGit() {
		try {
			// Initialize git repository
			execSync('git init', { cwd: this.targetDir });

			// Create .gitignore
			const gitignore = `
# Dependencies
node_modules/
vendor/

# Build files
dist/
build/

# Environment files
.env
.env.*

# IDE files
.idea/
.vscode/
*.sublime-*

# OS files
.DS_Store
Thumbs.db

# WordPress files
wp-content/uploads/
wp-content/upgrade/
wp-content/backup-db/
wp-content/cache/
wp-content/backups/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Turbo
.turbo
      `.trim();

			await fs.writeFile(path.join(this.targetDir, '.gitignore'), gitignore);
		} catch (error) {
			console.warn('Warning: Failed to initialize git repository:', error.message);
		}
	}
}

module.exports = ProjectInitializer;
