const fs = require('fs-extra');
const path = require('path');

class ProjectCreator {
	constructor(options) {
		this.targetDir = options.directory || process.cwd();
		this.name = options.name;
		this.templateDir = path.join(__dirname, '../templates');
	}

	async createTheme() {
		try {
			// Ensure wp-content/themes directory exists
			const themesDir = path.join(this.targetDir, 'wp-content/themes');
			await fs.ensureDir(themesDir);

			const themeDir = path.join(themesDir, this.name);

			// Create theme directory structure
			await this.createThemeStructure(themeDir);

			// Create theme files
			await this.createThemeFiles(themeDir);

			console.log(`\n✨ Theme "${this.name}" created successfully!`);
			console.log('\nNext steps:');
			console.log(`1. cd wp-content/themes/${this.name}`);
			console.log('2. npm install');
			console.log('3. Start developing your theme');
		} catch (error) {
			throw new Error(`Failed to create theme: ${error.message}`);
		}
	}

	async createPlugin() {
		try {
			// Ensure wp-content/plugins directory exists
			const pluginsDir = path.join(this.targetDir, 'wp-content/plugins');
			await fs.ensureDir(pluginsDir);

			const pluginDir = path.join(pluginsDir, this.name);

			// Create plugin directory structure
			await this.createPluginStructure(pluginDir);

			// Create plugin files
			await this.createPluginFiles(pluginDir);

			console.log(`\n✨ Plugin "${this.name}" created successfully!`);
			console.log('\nNext steps:');
			console.log(`1. cd wp-content/plugins/${this.name}`);
			console.log('2. npm install');
			console.log('3. Start developing your plugin');
		} catch (error) {
			throw new Error(`Failed to create plugin: ${error.message}`);
		}
	}

	async createThemeStructure(themeDir) {
		const directories = [
			'src',
			'src/blocks',
			'src/components',
			'src/styles',
			'src/scripts',
			'templates',
			'templates/parts',
			'templates/blocks',
			'assets',
			'assets/images',
			'assets/fonts',
		];

		for (const dir of directories) {
			await fs.ensureDir(path.join(themeDir, dir));
		}
	}

	async createPluginStructure(pluginDir) {
		const directories = [
			'src',
			'src/blocks',
			'src/components',
			'src/styles',
			'src/scripts',
			'includes',
			'templates',
			'assets',
			'assets/images',
			'assets/fonts',
		];

		for (const dir of directories) {
			await fs.ensureDir(path.join(pluginDir, dir));
		}
	}

	async createThemeFiles(themeDir) {
		// Create style.css
		const styleCss = `/*
Theme Name: ${this.name}
Theme URI: 
Author: 
Author URI: 
Description: 
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${this.name}
*/

/* Import styles */
@import './src/styles/main.css';
`;

		// Create functions.php
		const functionsPhp = `<?php
/**
 * ${this.name} functions and definitions
 *
 * @package ${this.name}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define theme constants
define( '${this.name.toUpperCase()}_VERSION', '1.0.0' );
define( '${this.name.toUpperCase()}_DIR', get_template_directory() );
define( '${this.name.toUpperCase()}_URI', get_template_directory_uri() );

// Include required files
require_once ${this.name.toUpperCase()}_DIR . '/includes/setup.php';
require_once ${this.name.toUpperCase()}_DIR . '/includes/enqueue.php';
require_once ${this.name.toUpperCase()}_DIR . '/includes/blocks.php';
`;

		// Create package.json
		const packageJson = {
			name: this.name,
			version: '1.0.0',
			private: true,
			scripts: {
				build: 'wp-scripts build',
				start: 'wp-scripts start',
				'check-engines': 'wp-scripts check-engines',
				'check-licenses': 'wp-scripts check-licenses',
				format: 'wp-scripts format',
				'lint:css': 'wp-scripts lint-style',
				'lint:js': 'wp-scripts lint-js',
				'lint:md:docs': 'wp-scripts lint-md-docs',
				'lint:pkg-json': 'wp-scripts lint-pkg-json',
				'packages-update': 'wp-scripts packages-update',
				'test:e2e': 'wp-scripts test-e2e',
				'test:unit': 'wp-scripts test-unit-js',
			},
			dependencies: {
				'@wordpress/scripts': '^26.0.0',
			},
		};

		// Create webpack.config.js
		const webpackConfig = `const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    'main': './src/scripts/index.js',
    'blocks': './src/blocks/index.js'
  }
};`;

		// Write files
		await fs.writeFile(path.join(themeDir, 'style.css'), styleCss);
		await fs.writeFile(path.join(themeDir, 'functions.php'), functionsPhp);
		await fs.writeJson(path.join(themeDir, 'package.json'), packageJson, { spaces: 2 });
		await fs.writeFile(path.join(themeDir, 'webpack.config.js'), webpackConfig);
	}

	async createPluginFiles(pluginDir) {
		// Create main plugin file
		const mainPhp = `<?php
/**
 * Plugin Name: ${this.name}
 * Plugin URI: 
 * Description: 
 * Version: 1.0.0
 * Author: 
 * Author URI: 
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ${this.name}
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define plugin constants
define( '${this.name.toUpperCase()}_VERSION', '1.0.0' );
define( '${this.name.toUpperCase()}_FILE', __FILE__ );
define( '${this.name.toUpperCase()}_DIR', plugin_dir_path( __FILE__ ) );
define( '${this.name.toUpperCase()}_URI', plugin_dir_url( __FILE__ ) );

// Include required files
require_once ${this.name.toUpperCase()}_DIR . 'includes/class-${this.name}.php';

// Initialize the plugin
function ${this.name}_init() {
    $plugin = new ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}();
    $plugin->init();
}
add_action( 'plugins_loaded', '${this.name}_init' );
`;

		// Create package.json
		const packageJson = {
			name: this.name,
			version: '1.0.0',
			private: true,
			scripts: {
				build: 'wp-scripts build',
				start: 'wp-scripts start',
				'check-engines': 'wp-scripts check-engines',
				'check-licenses': 'wp-scripts check-licenses',
				format: 'wp-scripts format',
				'lint:css': 'wp-scripts lint-style',
				'lint:js': 'wp-scripts lint-js',
				'lint:md:docs': 'wp-scripts lint-md-docs',
				'lint:pkg-json': 'wp-scripts lint-pkg-json',
				'packages-update': 'wp-scripts packages-update',
				'test:e2e': 'wp-scripts test-e2e',
				'test:unit': 'wp-scripts test-unit-js',
			},
			dependencies: {
				'@wordpress/scripts': '^26.0.0',
			},
		};

		// Create webpack.config.js
		const webpackConfig = `const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    'admin': './src/scripts/admin.js',
    'blocks': './src/blocks/index.js'
  }
};`;

		// Write files
		await fs.writeFile(path.join(pluginDir, `${this.name}.php`), mainPhp);
		await fs.writeJson(path.join(pluginDir, 'package.json'), packageJson, { spaces: 2 });
		await fs.writeFile(path.join(pluginDir, 'webpack.config.js'), webpackConfig);
	}
}

module.exports = ProjectCreator;
