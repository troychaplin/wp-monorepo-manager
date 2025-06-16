# WordPress Monorepo Manager Documentation

## Table of Contents

1. [Advanced Configuration](#advanced-configuration)
    - [Custom Build Scripts](#custom-build-scripts)
    - [Environment Variables](#environment-variables)
    - [Turbo Configuration](#turbo-configuration)
    - [Webpack Customization](#webpack-customization)
    - [Linting and Formatting Customization](#linting-and-formatting-customization)
2. [Development Workflows](#development-workflows)
    - [Multi-Environment Setup](#multi-environment-setup)
    - [Continuous Integration](#continuous-integration)
    - [Performance Optimization](#performance-optimization)
3. [Troubleshooting](#troubleshooting)
4. [API Reference](#api-reference)

## Advanced Configuration

### Custom Build Scripts

The build system is designed to be extensible, allowing you to add custom build steps or modify existing ones. This is particularly useful for:

- Adding pre-build validation
- Running custom asset processing
- Integrating with deployment systems
- Adding environment-specific build steps

Example with multiple custom steps:

```json
{
	"scripts": {
		"prebuild": "npm run validate",
		"build": "wp-monorepo-manager build && custom-build-step",
		"postbuild": "npm run generate-docs",
		"validate": "node scripts/validate.js",
		"generate-docs": "node scripts/generate-docs.js",
		"start": "wp-monorepo-manager start --port 3000",
		"deploy": "wp-monorepo-manager build:prod && deploy-script"
	}
}
```

### Environment Variables

Environment variables are crucial for managing different deployment environments and build configurations. The system supports multiple environment files:

```env
# .env.development
NODE_ENV=development
WP_DEBUG=true
WP_DEBUG_LOG=true
BROWSERSYNC_PORT=3000
WP_ENVIRONMENT_TYPE=development

# .env.staging
NODE_ENV=staging
WP_DEBUG=true
WP_DEBUG_LOG=true
BROWSERSYNC_PORT=3001
WP_ENVIRONMENT_TYPE=staging

# .env.production
NODE_ENV=production
WP_DEBUG=false
WP_DEBUG_LOG=false
WP_ENVIRONMENT_TYPE=production
```

Usage in your code:

```javascript
// Access environment variables
const isDevelopment = process.env.NODE_ENV === 'development';
const debugEnabled = process.env.WP_DEBUG === 'true';
```

### Turbo Configuration

Turbo is used for efficient build orchestration and caching. The configuration below shows how to:

- Define task dependencies
- Configure caching behavior
- Set up environment variable handling
- Optimize build pipelines

```json
{
	"$schema": "https://turbo.build/schema.json",
	"globalDependencies": ["**/.env.*local"],
	"pipeline": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**"],
			"env": ["NODE_ENV", "WP_DEBUG"],
			"cache": true
		},
		"build:dev": {
			"dependsOn": ["^build:dev"],
			"outputs": ["dist/**"],
			"env": ["NODE_ENV", "WP_DEBUG"],
			"cache": false
		},
		"build:prod": {
			"dependsOn": ["^build:prod"],
			"outputs": ["dist/**"],
			"env": ["NODE_ENV", "WP_DEBUG"],
			"cache": true
		},
		"start": {
			"cache": false,
			"persistent": true,
			"env": ["BROWSERSYNC_PORT"]
		},
		"lint": {
			"outputs": [],
			"env": ["CI"],
			"cache": true
		},
		"format": {
			"outputs": [],
			"cache": true
		},
		"clean": {
			"cache": false
		}
	}
}
```

### Webpack Customization

Webpack configuration can be extended for advanced use cases. This example shows:

- Multiple entry points for different scripts
- Code splitting and chunk optimization
- Asset handling
- Development and production optimizations

```javascript
// webpack.config.js
const path = require('path');
const baseConfig = require('wp-monorepo-manager/config/webpack');

module.exports = {
	...baseConfig,
	entry: {
		'my-script': './src/index.js',
		'admin-script': './src/admin.js',
		'editor-script': './src/editor.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		chunkFilename: '[name].[chunkhash].js',
		publicPath: '/wp-content/themes/your-theme/dist/',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					priority: 10,
				},
				wordpress: {
					test: /[\\/]@wordpress[\\/]/,
					name: 'wordpress',
					chunks: 'all',
					priority: 20,
				},
			},
		},
		minimize: process.env.NODE_ENV === 'production',
	},
	module: {
		rules: [
			...baseConfig.module.rules,
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
		],
	},
	devServer: {
		hot: true,
		port: process.env.BROWSERSYNC_PORT || 3000,
		proxy: {
			'/': 'http://localhost:8000',
		},
	},
};
```

### Linting and Formatting Customization

#### ESLint Advanced Configuration

ESLint configuration can be customized for:

- TypeScript support
- WordPress coding standards
- Custom rule sets
- Import/export handling

```javascript
// .eslintrc.js
module.exports = {
	extends: [
		'wp-monorepo-manager/config/eslint',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
	],
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaVersion: 2021,
	},
	settings: {
		'import/resolver': {
			typescript: {
				project: './tsconfig.json',
			},
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	rules: {
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'@wordpress/no-global-active-element': 'error',
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				'newlines-between': 'always',
				alphabetize: { order: 'asc' },
			},
		],
	},
	overrides: [
		{
			files: ['*.test.ts', '*.test.tsx'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};
```

#### StyleLint Advanced Configuration

StyleLint configuration can be customized for:

- SCSS support
- WordPress style guidelines
- Custom property patterns
- Media query handling

```javascript
// .stylelintrc.js
module.exports = {
	extends: ['wp-monorepo-manager/config/stylelint', 'stylelint-config-recommended-scss'],
	rules: {
		'selector-class-pattern': null,
		'no-descending-specificity': null,
		'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9]+$',
		'no-descending-specificity': null,
		'font-family-no-missing-generic-family-keyword': null,
		'scss/at-import-partial-extension': 'always',
		'scss/at-mixin-argumentless-call-parentheses': 'always',
		'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
		'media-feature-name-no-vendor-prefix': true,
		'at-rule-no-vendor-prefix': true,
		'property-no-vendor-prefix': true,
		'value-no-vendor-prefix': true,
	},
	overrides: [
		{
			files: ['**/*.scss'],
			rules: {
				'scss/at-import-partial-extension': 'always',
			},
		},
	],
};
```

## Development Workflows

### Multi-Environment Setup

Configure different environments for development, staging, and production. This setup allows for:

- Environment-specific debugging
- Different port configurations
- Custom build optimizations
- Environment-specific features

```javascript
// config/environments.js
module.exports = {
	development: {
		WP_DEBUG: true,
		WP_DEBUG_LOG: true,
		BROWSERSYNC_PORT: 3000,
		ENABLE_SOURCE_MAPS: true,
		ENABLE_HOT_RELOAD: true,
	},
	staging: {
		WP_DEBUG: true,
		WP_DEBUG_LOG: true,
		BROWSERSYNC_PORT: 3001,
		ENABLE_SOURCE_MAPS: true,
		ENABLE_HOT_RELOAD: false,
	},
	production: {
		WP_DEBUG: false,
		WP_DEBUG_LOG: false,
		ENABLE_SOURCE_MAPS: false,
		ENABLE_HOT_RELOAD: false,
	},
};
```

### Continuous Integration

Example GitHub Actions workflow with:

- Multiple Node.js versions
- Caching
- Parallel jobs
- Deployment stages

```yaml
name: CI

on:
	push:
		branches: [main]
	pull_request:
		branches: [main]

jobs:
	test:
		runs-on: ubuntu-latest
		strategy:
			matrix:
				node-version: [16.x, 18.x]
		steps:
			- uses: actions/checkout@v3
			- uses: actions/setup-node@v3
				with:
					node-version: ${{ matrix.node-version }}
					cache: 'npm'
			- run: npm ci
			- run: npm run lint
			- run: npm run test

	build:
		needs: test
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v3
			- uses: actions/setup-node@v3
				with:
					node-version: '18'
					cache: 'npm'
			- run: npm ci
			- run: npm run build:prod
			- uses: actions/upload-artifact@v3
				with:
					name: dist
					path: dist/

	deploy:
		needs: build
		if: github.ref == 'refs/heads/main'
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v3
			- uses: actions/download-artifact@v3
				with:
					name: dist
			- name: Deploy to production
				run: |
					# Add your deployment steps here
```

### Performance Optimization

Optimize build performance with:

- Turbo caching
- Webpack optimizations
- Memory management
- Parallel processing

```json
{
	"scripts": {
		"build": "turbo run build --cache-dir=.turbo/cache",
		"build:prod": "turbo run build:prod --cache-dir=.turbo/cache",
		"build:parallel": "turbo run build --parallel --cache-dir=.turbo/cache"
	}
}
```

## Troubleshooting

### Common Issues

1. **Build Performance Issues**

    - Enable Turbo caching
    - Optimize webpack configuration
    - Use production mode for builds
    - Implement code splitting
    - Use parallel processing

2. **Memory Issues**

    - Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
    - Optimize webpack chunking
    - Use production mode for builds
    - Implement lazy loading
    - Clean up unused dependencies

3. **Development Server Issues**
    - Check port conflicts
    - Verify WordPress installation
    - Check browser console for errors
    - Verify environment variables
    - Check network connectivity

### Debugging

Enable verbose logging for detailed debugging:

```bash
# Enable all debug logs
DEBUG=wp-monorepo-manager:* npm run start

# Enable specific debug logs
DEBUG=wp-monorepo-manager:webpack npm run start
DEBUG=wp-monorepo-manager:eslint npm run lint
```

## API Reference

### CLI Commands

```bash
# Build commands
wp-monorepo-manager build [options]
wp-monorepo-manager build:dev [options]
wp-monorepo-manager build:prod [options]

# Development commands
wp-monorepo-manager start [options]
wp-monorepo-manager start:dev [options]

# Linting and formatting
wp-monorepo-manager lint [options]
wp-monorepo-manager format [options]

# Utility commands
wp-monorepo-manager clean [options]
wp-monorepo-manager validate [options]
```

### Options

- `--mode`: Set build mode (development/production)
- `--port`: Set development server port
- `--watch`: Enable watch mode
- `--cache`: Enable caching
- `--verbose`: Enable verbose logging
- `--parallel`: Run tasks in parallel
- `--filter`: Filter tasks by package name
- `--force`: Force rebuild without cache
- `--no-cache`: Disable caching
- `--debug`: Enable debug mode
