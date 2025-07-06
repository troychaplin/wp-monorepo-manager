const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const {
	createDirectory,
	writeFile,
	promptUser,
	promptYesNo,
	toFolderName,
	closeReadline,
} = require('./utils');

// Configuration
const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.cwd();

// Function to copy composer.json template for plugin
async function copyComposerJson(folderName) {
	const composerTemplatePath = path.join(
		PACKAGE_DIR,
		'config',
		'composer',
		'composer-plugin.json'
	);
	const pluginComposerPath = path.join(
		TARGET_DIR,
		'wp-content',
		'plugins',
		folderName,
		'composer.json'
	);

	try {
		// Copy the composer template
		fs.copyFileSync(composerTemplatePath, pluginComposerPath);
		console.log('\n✅ Plugin composer.json created');
	} catch (error) {
		console.error('❌ Error creating composer.json:', error.message);
	}
}

async function setupPlugin() {
	try {
		// Get plugin name from user
		const pluginName = await promptUser('Enter plugin name: ');
		if (!pluginName.trim()) {
			console.log('❌ Plugin name is required.');
			closeReadline();
			process.exit(0);
		}

		// Generate default folder name from plugin name
		const defaultFolderName = toFolderName(pluginName);

		// Get plugin folder name from user
		const pluginFolderName = await promptUser(
			`Enter plugin folder name (default: ${defaultFolderName}): `
		);
		const folderName = pluginFolderName.trim() || defaultFolderName;

		// Determine the plugin directory path
		const wpContentPluginsPath = path.join(TARGET_DIR, 'wp-content/plugins');
		const pluginDir = path.join(wpContentPluginsPath, folderName);

		// Check if plugin already exists
		if (fs.existsSync(pluginDir)) {
			const shouldOverwrite = await promptYesNo(
				`Plugin "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (!shouldOverwrite) {
				console.log('Setup cancelled.');
				closeReadline();
				process.exit(0);
			}
		}

		// Read plugin package.json template
		const pluginPackageTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'package',
			'package-plugin.json'
		);
		let pluginPackageContent = fs.readFileSync(pluginPackageTemplatePath, 'utf8');
		pluginPackageContent = pluginPackageContent.replace(/\{\{PROJECT_NAME\}\}/g, folderName);
		const pluginPackageJson = JSON.parse(pluginPackageContent);

		// Create plugin directory structure
		createDirectory(pluginDir);
		createDirectory(path.join(pluginDir, 'src'));

		// Sanitize plugin name for PHP function names
		const sanitizedName = pluginName.replace(/[^a-zA-Z0-9]/g, '_');
		const sanitizedNameLower = pluginName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
		const kebabName = pluginName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

		// Track what was created
		const createdItems = [];

		// Create plugin files
		writeFile(path.join(pluginDir, 'package.json'), JSON.stringify(pluginPackageJson, null, 2));
		createdItems.push('package.json');

		// Copy webpack configuration
		const webpackPluginTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'webpack',
			'webpack-plugin.js'
		);
		const webpackPluginPath = path.join(pluginDir, 'webpack.scripts.js');
		fs.copyFileSync(webpackPluginTemplatePath, webpackPluginPath);
		createdItems.push('webpack configuration');

		// Copy turbo.json for plugin
		const turboPluginTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'turbo',
			'turbo-plugin.json'
		);
		const turboPluginPath = path.join(pluginDir, 'turbo.json');
		fs.copyFileSync(turboPluginTemplatePath, turboPluginPath);
		createdItems.push('turbo.json configuration');

		// Copy .prettierignore for plugin
		const prettierIgnoreTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'prettier',
			'.prettierignore'
		);
		const prettierIgnorePluginPath = path.join(pluginDir, '.prettierignore');
		fs.copyFileSync(prettierIgnoreTemplatePath, prettierIgnorePluginPath);
		createdItems.push('.prettierignore configuration');

		// Copy and customize plugin.php template
		const pluginPhpTemplatePath = path.join(PACKAGE_DIR, 'config', 'plugin', 'plugin.php');
		let pluginPhpContent = fs.readFileSync(pluginPhpTemplatePath, 'utf8');

		// Replace template placeholders
		pluginPhpContent = pluginPhpContent
			.replace(/\{\{PLUGIN_NAME\}\}/g, pluginName)
			.replace(/\{\{PLUGIN_DESCRIPTION\}\}/g, `${pluginName} - A custom WordPress plugin`)
			.replace(/\{\{SANITIZED_NAME\}\}/g, sanitizedNameLower)
			.replace(/\{\{KEBAB_NAME\}\}/g, kebabName);

		writeFile(path.join(pluginDir, 'plugin.php'), pluginPhpContent);
		createdItems.push('plugin.php');

		// Copy and customize scripts.js template
		const scriptsTemplatePath = path.join(PACKAGE_DIR, 'config', 'plugin', 'scripts.js');
		let scriptsContent = fs.readFileSync(scriptsTemplatePath, 'utf8');
		scriptsContent = scriptsContent.replace(/\{\{PLUGIN_NAME\}\}/g, pluginName);
		writeFile(path.join(pluginDir, 'src/scripts.js'), scriptsContent);
		createdItems.push('JavaScript entry point');

		// Copy and customize styles.scss template
		const stylesTemplatePath = path.join(PACKAGE_DIR, 'config', 'plugin', 'styles.scss');
		let stylesContent = fs.readFileSync(stylesTemplatePath, 'utf8');
		stylesContent = stylesContent
			.replace(/\{\{KEBAB_NAME\}\}/g, kebabName)
			.replace(/\{\{PLUGIN_NAME\}\}/g, pluginName);
		writeFile(path.join(pluginDir, 'src/styles.scss'), stylesContent);
		createdItems.push('SCSS stylesheet');

		// Copy and customize editor-styles.scss template
		const editorStylesTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'plugin',
			'editor-styles.scss'
		);
		let editorStylesContent = fs.readFileSync(editorStylesTemplatePath, 'utf8');
		editorStylesContent = editorStylesContent.replace(/\{\{PLUGIN_NAME\}\}/g, pluginName);
		writeFile(path.join(pluginDir, 'src/editor-styles.scss'), editorStylesContent);
		createdItems.push('editor stylesheet');

		// Create composer.json for plugin
		await copyComposerJson(folderName);
		createdItems.push('composer.json');

		// Install composer dependencies for the plugin
		console.log('📦 Installing Composer dependencies...');
		execSync('composer install', { cwd: pluginDir, stdio: 'inherit' });
		createdItems.push('composer dependencies');

		// Create blocks
		console.log('\n🔧 Creating example blocks...');

		execSync(
			'npx @wordpress/create-block@latest static-example --variant=static --title="Static Block Example" --target-dir=./src/blocks/static-example --textdomain=wp-monorepo-manager --no-plugin',
			{ cwd: pluginDir, stdio: 'pipe' }
		);
		createdItems.push('static block example');

		execSync(
			'npx @wordpress/create-block@latest dynamic-example --variant=dynamic --title="Dynamic Block Example" --target-dir=./src/blocks/dynamic-example --textdomain=wp-monorepo-manager --no-plugin',
			{ cwd: pluginDir, stdio: 'pipe' }
		);
		createdItems.push('dynamic block example');

		execSync(
			'npx @wordpress/create-block@latest interactive-example --title="Interactive Block Example" --target-dir=./src/blocks/interactive-example --textdomain=wp-monorepo-manager --template @wordpress/create-block-interactive-template --no-plugin',
			{ cwd: pluginDir, stdio: 'pipe', env: { ...process.env, NPM_CONFIG_YES: 'true' } }
		);
		createdItems.push('interactive block example');

		// Success summary
		console.log('\n✅ Plugin setup completed successfully!');
		console.log(`\n📁 Location: ${path.relative(TARGET_DIR, pluginDir)}`);
		console.log('\n📋 Created:');
		createdItems.forEach(item => console.log(`   • ${item}`));
		console.log('\n🚀 Next steps:');
		console.log('   1. Run "npm run build" to build the plugin');
		console.log('   2. Run "npm run start" to start development mode');
		console.log('   3. Activate the plugin in WordPress admin');
		console.log('\n💡 To add blocks later:');
		console.log('   • Run "npx @wordpress/create-block" inside the plugin directory');

		closeReadline();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error during plugin setup:', error.message);
		closeReadline();
		process.exit(1);
	}
}

// Run setup
setupPlugin();
