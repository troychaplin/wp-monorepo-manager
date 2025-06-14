# WordPress Monorepo Manager Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
    - [ESLint](#eslint)
    - [StyleLint](#stylelint)
    - [PHPCS](#phpcs)
    - [Webpack](#webpack)
4. [Usage Examples](#usage-examples)
5. [Advanced Configuration](#advanced-configuration)
6. [Troubleshooting](#troubleshooting)

## Overview

The WordPress Monorepo Manager is a package that provides standardized build tools and coding standards for WordPress development. It includes pre-configured settings for ESLint, StyleLint, PHPCS, and Webpack, following WordPress best practices.

## Installation

### Basic Installation

```bash
npm install wp-monorepo-manager --save-dev
```

### Required Peer Dependencies

The package requires several peer dependencies. Install them based on your needs:

```bash
# For JavaScript development
npm install --save-dev @wordpress/eslint-plugin @wordpress/scripts eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks

# For CSS/SCSS development
npm install --save-dev stylelint stylelint-config-standard stylelint-config-wordpress

# For PHP development
composer require --dev wp-coding-standards/wpcs
```

## Configuration

### ESLint

The ESLint configuration includes:

- WordPress coding standards
- React support
- Import/export rules
- Accessibility rules

#### Basic Usage

Create `.eslintrc.json` in your project root:

```json
{
	"extends": ["wp-monorepo-manager/config/eslint/.eslintrc.json"]
}
```

#### Customizing Rules

```json
{
	"extends": ["wp-monorepo-manager/config/eslint/.eslintrc.json"],
	"rules": {
		"your-custom-rule": "error"
	}
}
```

### StyleLint

The StyleLint configuration includes:

- WordPress coding standards
- Modern CSS features
- SCSS support
- Tailwind CSS support

#### Basic Usage

Create `.stylelintrc.json` in your project root:

```json
{
	"extends": ["wp-monorepo-manager/config/stylelint/.stylelintrc.json"]
}
```

#### Customizing Rules

```json
{
	"extends": ["wp-monorepo-manager/config/stylelint/.stylelintrc.json"],
	"rules": {
		"your-custom-rule": "error"
	}
}
```

### PHPCS

The PHPCS configuration includes:

- WordPress coding standards
- WordPress VIP coding standards
- Custom exclusions for modern development

#### Basic Usage

Create `phpcs.xml.dist` in your project root:

```xml
<?xml version="1.0"?>
<ruleset name="WordPress Coding Standards">
  <rule ref="wp-monorepo-manager/config/phpcs/phpcs.xml.dist"/>
</ruleset>
```

#### Customizing Rules

```xml
<?xml version="1.0"?>
<ruleset name="WordPress Coding Standards">
  <rule ref="wp-monorepo-manager/config/phpcs/phpcs.xml.dist"/>
  <rule ref="WordPress.Files.FileName">
    <exclude-pattern>/your-custom-pattern/</exclude-pattern>
  </rule>
</ruleset>
```

### Webpack

The Webpack configuration includes:

- WordPress scripts integration
- Asset optimization
- Development and production modes
- Hot module replacement

#### Basic Usage

Create `webpack.config.js` in your project root:

```javascript
const { merge } = require('webpack-merge');
const defaultConfig = require('wp-monorepo-manager/config/webpack/webpack.config.js');

module.exports = merge(defaultConfig, {
	// Your custom configuration
});
```

#### Customizing Configuration

```javascript
const { merge } = require('webpack-merge');
const defaultConfig = require('wp-monorepo-manager/config/webpack/webpack.config.js');

module.exports = merge(defaultConfig, {
	entry: {
		'custom-entry': './src/custom-entry.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
});
```

## Usage Examples

### Accessing Configuration Paths

```javascript
const { utils } = require('wp-monorepo-manager');

// Get specific config path
const eslintConfigPath = utils.getConfigPath('eslint');

// Get all config paths
const allConfigPaths = utils.getAllConfigPaths();
```

### Adding to package.json Scripts

```json
{
	"scripts": {
		"lint:js": "eslint .",
		"lint:css": "stylelint \"**/*.css\"",
		"lint:php": "phpcs",
		"lint": "npm run lint:js && npm run lint:css && npm run lint:php",
		"format:js": "eslint . --fix",
		"format:css": "stylelint \"**/*.css\" --fix",
		"format:php": "phpcbf",
		"format": "npm run format:js && npm run format:css && npm run format:php"
	}
}
```

## Advanced Configuration

### React Support

The ESLint configuration includes React support. To use it:

1. Install React dependencies:

```bash
npm install --save-dev react react-dom
```

2. Configure your project to use React (the configuration is already included in the ESLint config).

## Troubleshooting

### Common Issues

1. **ESLint Configuration Not Found**

    - Ensure the package is installed correctly
    - Check the path in your `.eslintrc.json`

2. **StyleLint Configuration Not Found**

    - Verify the package installation
    - Check the path in your `.stylelintrc.json`

3. **PHPCS Configuration Not Found**

    - Ensure Composer dependencies are installed
    - Check the path in your `phpcs.xml.dist`

4. **Webpack Configuration Issues**
    - Verify all required dependencies are installed
    - Check for conflicts in your custom configuration

### Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [WordPress Coding Standards documentation](https://developer.wordpress.org/coding-standards/)
3. Open a new issue with detailed information about your problem
