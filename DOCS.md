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

This package provides standardized configurations and build tools for managing WordPress themes and plugins in a monorepo structure. It uses Turborepo for efficient workspace management and provides consistent configurations for ESLint, StyleLint, PHPCS, and Webpack.

## Installation

```bash
npm install --save-dev wp-monorepo-manager
```

## Monorepo Setup

### 1. Project Structure

```
my-wordpress-project/
├── package.json
├── turbo.json
├── wp-content/
│   ├── plugins/
│   │   ├── my-plugin/
│   │   │   ├── package.json
│   │   │   └── src/
│   │   └── another-plugin/
│   └── themes/
│       ├── my-theme/
│       │   ├── package.json
│       │   └── src/
│       └── another-theme/
```

### 2. Root package.json

```json
{
	"name": "my-wordpress-project",
	"private": true,
	"workspaces": ["wp-content/plugins/*", "wp-content/themes/*"],
	"scripts": {
		"build": "turbo run build",
		"build:dev": "turbo run build:dev",
		"build:prod": "turbo run build:prod",
		"start": "turbo run start",
		"lint": "turbo run lint",
		"lint:js": "turbo run lint:js",
		"lint:css": "turbo run lint:css",
		"lint:php": "turbo run lint:php",
		"format": "turbo run format",
		"format:js": "turbo run format:js",
		"format:css": "turbo run format:css",
		"format:php": "turbo run format:php",
		"clean": "turbo run clean"
	},
	"devDependencies": {
		"wp-monorepo-manager": "^0.1.0",
		"turbo": "^2.0.0"
	}
}
```

### 3. Theme/Plugin package.json

Each theme or plugin should have its own package.json:

```json
{
	"name": "my-theme",
	"version": "1.0.0",
	"scripts": {
		"build": "wp-monorepo-manager build",
		"build:dev": "wp-monorepo-manager build:dev",
		"build:prod": "wp-monorepo-manager build:prod",
		"start": "wp-monorepo-manager start",
		"lint": "wp-monorepo-manager lint",
		"lint:js": "wp-monorepo-manager lint:js",
		"lint:css": "wp-monorepo-manager lint:css",
		"lint:php": "wp-monorepo-manager lint:php",
		"format": "wp-monorepo-manager format",
		"format:js": "wp-monorepo-manager format:js",
		"format:css": "wp-monorepo-manager format:css",
		"format:php": "wp-monorepo-manager format:php",
		"clean": "wp-monorepo-manager clean"
	}
}
```

## Usage

### Building Projects

Build all themes and plugins:

```bash
npm run build
```

Build in development mode:

```bash
npm run build:dev
```

Build in production mode:

```bash
npm run build:prod
```

### Development

Start development mode for all projects:

```bash
npm run start
```

### Linting and Formatting

Lint all projects:

```bash
npm run lint
```

Format all projects:

```bash
npm run format
```

### Individual Project Commands

You can also run commands for individual themes or plugins:

```bash
# Build a specific theme
npm run build --workspace=wp-content/themes/my-theme

# Start development for a specific plugin
npm run start --workspace=wp-content/plugins/my-plugin

# Lint a specific theme
npm run lint --workspace=wp-content/themes/my-theme
```

## Configuration

### ESLint Configuration

Extend the base configuration in your theme or plugin:

```javascript
// .eslintrc.js
module.exports = {
	extends: ['wp-monorepo-manager/config/eslint'],
	root: true,
	parserOptions: {
		project: './tsconfig.json',
	},
};
```

### StyleLint Configuration

Extend the base configuration:

```javascript
// .stylelintrc.js
module.exports = {
	extends: ['wp-monorepo-manager/config/stylelint'],
};
```

### PHPCS Configuration

Extend the base configuration:

```xml
<!-- phpcs.xml -->
<?xml version="1.0"?>
<ruleset name="WordPress Theme Coding Standards">
    <rule ref="wp-monorepo-manager/config/phpcs.xml">
        <exclude name="Generic.WhiteSpace.DisallowSpaceIndent"/>
    </rule>
</ruleset>
```

### Webpack Configuration

Extend the base configuration:

```javascript
// webpack.config.js
const baseConfig = require('wp-monorepo-manager/config/webpack');

module.exports = {
	...baseConfig,
	entry: {
		'my-script': './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
};
```

## Advanced Configuration

### Custom Build Scripts

You can customize build scripts in your theme or plugin's package.json:

```json
{
	"scripts": {
		"build": "wp-monorepo-manager build && custom-build-step",
		"start": "wp-monorepo-manager start --port 3000"
	}
}
```

### Environment Variables

Create a `.env` file in your project root:

```env
NODE_ENV=development
WP_DEBUG=true
WP_DEBUG_LOG=true
```

### Turbo Configuration

Customize the Turbo configuration in your root turbo.json:

```json
{
	"$schema": "https://turbo.build/schema.json",
	"globalDependencies": ["**/.env.*local"],
	"pipeline": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**"]
		},
		"start": {
			"cache": false,
			"persistent": true
		}
	}
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**

    - Check if all dependencies are installed
    - Verify webpack configuration
    - Check for syntax errors in source files

2. **Linting Errors**

    - Run `npm run lint:js` to see JavaScript errors
    - Run `npm run lint:css` to see CSS errors
    - Run `npm run lint:php` to see PHP errors

3. **Development Server Issues**
    - Check if port is already in use
    - Verify WordPress installation
    - Check browser console for errors

### Getting Help

If you encounter issues:

1. Check the error messages
2. Review the configuration files
3. Check the WordPress debug log
4. Open an issue on GitHub
