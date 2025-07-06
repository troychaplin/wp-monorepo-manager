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

// Function to copy composer.json template for theme
async function copyComposerJson(folderName) {
	const composerTemplatePath = path.join(
		PACKAGE_DIR,
		'config',
		'composer',
		'composer-theme.json'
	);
	const themeComposerPath = path.join(
		TARGET_DIR,
		'wp-content',
		'themes',
		folderName,
		'composer.json'
	);

	try {
		// Copy the composer template
		fs.copyFileSync(composerTemplatePath, themeComposerPath);
		console.log('✅ Theme composer.json created');
	} catch (error) {
		console.error('❌ Error creating composer.json:', error.message);
	}
}

async function setupTheme() {
	try {
		// Get theme name from user
		const themeName = await promptUser('Enter theme name: ');
		if (!themeName.trim()) {
			console.log('❌ Theme name is required.');
			closeReadline();
			process.exit(0);
		}

		// Generate default folder name from theme name
		const defaultFolderName = toFolderName(themeName);

		// Get theme folder name from user
		const themeFolderName = await promptUser(
			`Enter theme folder name (default: ${defaultFolderName}): `
		);
		const folderName = themeFolderName.trim() || defaultFolderName;

		// Determine the theme directory path
		const wpContentThemesPath = path.join(TARGET_DIR, 'wp-content/themes');
		const themeDir = path.join(wpContentThemesPath, folderName);

		// Check if theme already exists
		if (fs.existsSync(themeDir)) {
			const shouldOverwrite = await promptYesNo(
				`Theme "${folderName}" already exists. Overwrite? (y/n): `
			);
			if (!shouldOverwrite) {
				console.log('Setup cancelled.');
				closeReadline();
				process.exit(0);
			}
		}

		// Read theme package.json template
		const themePackageTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'package',
			'package-theme.json'
		);
		let themePackageContent = fs.readFileSync(themePackageTemplatePath, 'utf8');
		themePackageContent = themePackageContent.replace(/\{\{PROJECT_NAME\}\}/g, folderName);
		const themePackageJson = JSON.parse(themePackageContent);

		// Create theme directory structure
		createDirectory(themeDir);
		createDirectory(path.join(themeDir, 'src'));

		// Sanitize theme name for PHP function names
		const sanitizedName = themeName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
		const kebabName = themeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

		// Track what was created
		const createdItems = [];

		// Create theme files
		writeFile(path.join(themeDir, 'package.json'), JSON.stringify(themePackageJson, null, 2));
		createdItems.push('package.json');

		// Copy webpack configuration
		const webpackThemeTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'webpack',
			'webpack-theme.js'
		);
		const webpackThemePath = path.join(themeDir, 'webpack.config.js');
		fs.copyFileSync(webpackThemeTemplatePath, webpackThemePath);
		createdItems.push('webpack configuration');

		// Copy turbo.json for theme
		const turboThemeTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'turbo',
			'turbo-theme.json'
		);
		const turboThemePath = path.join(themeDir, 'turbo.json');
		fs.copyFileSync(turboThemeTemplatePath, turboThemePath);
		createdItems.push('turbo.json configuration');

		// Copy .prettierignore for theme
		const prettierIgnoreTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'prettier',
			'.prettierignore'
		);
		const prettierIgnoreThemePath = path.join(themeDir, '.prettierignore');
		fs.copyFileSync(prettierIgnoreTemplatePath, prettierIgnoreThemePath);
		createdItems.push('.prettierignore configuration');

		// Copy and customize index.php template
		const indexPhpTemplatePath = path.join(PACKAGE_DIR, 'config', 'theme', 'index.php');
		let indexPhpContent = fs.readFileSync(indexPhpTemplatePath, 'utf8');
		indexPhpContent = indexPhpContent.replace(/\{\{THEME_NAME\}\}/g, themeName);
		writeFile(path.join(themeDir, 'index.php'), indexPhpContent);
		createdItems.push('index.php');

		// Copy and customize style.css template
		const styleCssTemplatePath = path.join(PACKAGE_DIR, 'config', 'theme', 'style.css');
		let styleCssContent = fs.readFileSync(styleCssTemplatePath, 'utf8');
		styleCssContent = styleCssContent.replace(/\{\{THEME_NAME\}\}/g, themeName);
		writeFile(path.join(themeDir, 'style.css'), styleCssContent);
		createdItems.push('style.css');

		// Copy and customize functions.php template
		const functionsPhpTemplatePath = path.join(PACKAGE_DIR, 'config', 'theme', 'functions.php');
		let functionsPhpContent = fs.readFileSync(functionsPhpTemplatePath, 'utf8');
		functionsPhpContent = functionsPhpContent
			.replace(/\{\{THEME_NAME\}\}/g, themeName)
			.replace(/\{\{SANITIZED_NAME\}\}/g, sanitizedName)
			.replace(/\{\{KEBAB_NAME\}\}/g, kebabName);
		writeFile(path.join(themeDir, 'functions.php'), functionsPhpContent);
		createdItems.push('functions.php');

		// Copy and customize scripts.js template
		const scriptsTemplatePath = path.join(PACKAGE_DIR, 'config', 'theme', 'scripts.js');
		let scriptsContent = fs.readFileSync(scriptsTemplatePath, 'utf8');
		scriptsContent = scriptsContent.replace(/\{\{THEME_NAME\}\}/g, themeName);
		writeFile(path.join(themeDir, 'src/scripts.js'), scriptsContent);
		createdItems.push('JavaScript entry point');

		// Copy and customize styles.scss template
		const stylesTemplatePath = path.join(PACKAGE_DIR, 'config', 'theme', 'styles.scss');
		let stylesContent = fs.readFileSync(stylesTemplatePath, 'utf8');
		stylesContent = stylesContent
			.replace(/\{\{THEME_NAME\}\}/g, themeName)
			.replace(/\{\{KEBAB_NAME\}\}/g, kebabName);
		writeFile(path.join(themeDir, 'src/styles.scss'), stylesContent);
		createdItems.push('SCSS stylesheet');

		// Copy and customize editor-styles.scss template
		const editorStylesTemplatePath = path.join(
			PACKAGE_DIR,
			'config',
			'theme',
			'editor-styles.scss'
		);
		let editorStylesContent = fs.readFileSync(editorStylesTemplatePath, 'utf8');
		editorStylesContent = editorStylesContent.replace(/\{\{THEME_NAME\}\}/g, themeName);
		writeFile(path.join(themeDir, 'src/editor-styles.scss'), editorStylesContent);
		createdItems.push('editor stylesheet');

		// Create composer.json for theme
		await copyComposerJson(folderName);
		createdItems.push('composer.json');

		// Install composer dependencies for the theme
		console.log('\n📦 Installing Composer dependencies...');
		execSync('composer install', { cwd: themeDir, stdio: 'inherit' });
		createdItems.push('composer dependencies');

		// Success summary
		console.log('\n✅ Theme setup completed successfully!');
		console.log(`\n📁 Location: ${path.relative(TARGET_DIR, themeDir)}`);
		console.log('\n📋 Created:');
		createdItems.forEach(item => console.log(`   • ${item}`));
		console.log('\n🚀 Next steps:');
		console.log('   1. Run "npm run build" to build the theme');
		console.log('   2. Run "npm run start" to start development mode');
		console.log('   3. Activate the theme in WordPress admin');

		closeReadline();
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error during theme setup:', error.message);
		closeReadline();
		process.exit(1);
	}
}

// Run setup
setupTheme();
