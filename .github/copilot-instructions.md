# WordPress Monorepo Manager - Copilot Instructions

## Project Overview

This is a **WordPress Monorepo Manager** - a build tool for managing WordPress themes and plugins in a monorepo structure. It provides standardized configurations and build tools for efficient WordPress development.

### Key Features

- **Monorepo Management**: Uses Turborepo to manage multiple WordPress themes and plugins
- **Standardized Configurations**: Pre-configured settings for ESLint, StyleLint, PHPCS, and Webpack
- **Build Tools**: Unified build process for all themes and plugins
- **Development Workflow**: Consistent development experience across projects
- **Code Quality**: Enforced coding standards across all projects

## Project Structure

```
wp-monorepo-manager/
├── bin/
│   └── wp-monorepo.js          # CLI entry point
├── config/                      # Standardized configuration templates
│   ├── composer/               # Composer configurations
│   ├── editorconfig/           # Editor configuration
│   ├── eslint/                 # ESLint configuration
│   ├── package/                # Package.json templates
│   ├── phpcs/                  # PHP CodeSniffer configuration
│   ├── prettier/               # Prettier configuration
│   ├── stylelint/              # StyleLint configuration
│   ├── turbo/                  # Turborepo configurations
│   └── webpack/                # Webpack configurations
├── scripts/                    # Setup and utility scripts
│   ├── setup-monorepo.js       # Main monorepo setup
│   ├── setup-plugin.js         # Plugin creation script
│   ├── setup-theme.js          # Theme creation script
│   └── utils.js                # Shared utilities
├── templates/                  # Template files for themes/plugins
├── index.js                    # Main package exports
└── README.md                   # Project documentation
```

## Development Conventions

### 1. Configuration Management

- **All dependencies are managed at the root level** - plugin/theme package.json files should NOT include their own dependencies
- **Configuration files are copied from templates** rather than duplicated inline for easier maintenance
- **Setup scripts suppress verbose WordPress block creation messages** and only display high-level summary output

### 2. Script Organization

- **Lint and format commands** should be added to the root composer file where setup commands are run, not in individual plugin/theme composer files
- **Setup scripts** copy configuration templates (ESLint, Prettier, StyleLint, PHPCS, EditorConfig) instead of duplicating their contents inline

### 3. Implementation Approach

- **Tasks should be implemented one step at a time** with pauses between steps for reviews and testing
- **Prefer copying configuration templates** over inline duplication for better long-term maintenance

## CLI Commands

The main CLI tool (`wp-monorepo`) supports these commands:

### Setup Commands

- `wp-monorepo setup` - Create monorepo structure
- `wp-monorepo setup:theme` - Create a new theme
- `wp-monorepo setup:plugin` - Create a new plugin

**Note:** Build commands (`wp-monorepo build`, `wp-monorepo build:dev`, `wp-monorepo build:prod`) are planned for future releases.

### NPM Scripts (after setup)

- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:prod` - Build for production

### Development Commands

- `npm run start` - Start development server (planned for future release)
- `npm run lint` - Run linting (planned for future release)
- `npm run format` - Format code (planned for future release)
- `npm run clean` - Clean build artifacts (planned for future release)

## Configuration Files

### Root Level Configurations

- `.eslintrc.json` - ESLint configuration
- `.stylelintrc.json` - StyleLint configuration
- `.prettierrc` - Prettier configuration
- `phpcs.xml.dist` - PHP CodeSniffer configuration
- `.editorconfig` - Editor configuration
- `composer.json` - Composer configuration with shared dependencies
- `package.json` - NPM configuration with shared dependencies
- `turbo.json` - Turborepo configuration

### Theme/Plugin Specific

- Each theme/plugin gets its own `package.json` with build scripts
- Each theme/plugin gets its own `composer.json` for PHP dependencies
- Each theme/plugin gets its own `turbo.json` for build orchestration
- Each plugin gets its own `webpack.scripts.js` for asset bundling

## File Structure for Themes/Plugins

### Theme Structure

```
wp-content/themes/theme-name/
├── package.json              # Theme-specific build scripts
├── composer.json             # Theme-specific PHP dependencies
├── turbo.json               # Theme-specific build orchestration
├── index.php                # Main theme file
├── style.css                # WordPress theme header
├── src/
│   ├── scripts/
│   │   └── index.js         # Main JavaScript entry point
│   ├── styles.scss          # Main stylesheet
│   └── editor-styles.scss   # Editor-specific styles
└── dist/                    # Built assets (generated)
```

### Plugin Structure

```
wp-content/plugins/plugin-name/
├── package.json              # Plugin-specific build scripts
├── composer.json             # Plugin-specific PHP dependencies
├── turbo.json               # Plugin-specific build orchestration
├── webpack.scripts.js       # Webpack configuration
├── plugin.php               # Main plugin file
├── src/
│   ├── scripts/
│   │   └── index.js         # Main JavaScript entry point
│   ├── styles.scss          # Main stylesheet
│   └── blocks/              # Gutenberg blocks (if any)
└── dist/                    # Built assets (generated)
```

## Build System

### Webpack Configuration

- **Base configuration** is provided in `config/webpack/webpack.config.js`
- **Plugin-specific configuration** is provided in `config/webpack/webpack-plugin.js`
- **Entry points** are automatically configured for scripts and styles
- **Output** goes to `dist/` directory in each theme/plugin

### Turborepo Configuration

- **Root configuration** orchestrates builds across all themes/plugins
- **Individual configurations** handle theme/plugin-specific build steps
- **Caching** is enabled for production builds
- **Dependencies** are properly managed between packages

## Coding Standards

### JavaScript/TypeScript

- **ESLint** enforces WordPress coding standards
- **Prettier** handles code formatting
- **Configuration** extends WordPress-specific rules

### CSS/SCSS

- **StyleLint** enforces CSS coding standards
- **Prettier** handles formatting
- **SCSS** is supported for advanced styling

### PHP

- **PHP_CodeSniffer** enforces WordPress coding standards
- **WordPress-Extra** and **WordPress-Docs** standards are included
- **Configuration** is shared across all themes/plugins

## Development Workflow

### 1. Initial Setup

```bash
# Install globally
npm install -g wp-monorepo-manager

# Set up monorepo in WordPress installation
wp-monorepo setup

# Create theme/plugin
wp-monorepo setup:theme
wp-monorepo setup:plugin
```

### 2. Development

```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod
```

**Note:** Development server (`wp-monorepo start`) is not yet implemented in the current version.

### 3. Code Quality

```bash
# Lint code (planned for future release)
wp-monorepo lint

# Format code (planned for future release)
wp-monorepo format

# Clean build artifacts (planned for future release)
wp-monorepo clean
```

**Note:** These commands are planned for future releases. For now, use individual tools:

- `npx eslint` for JavaScript
- `npx stylelint` for CSS/SCSS
- `./vendor/bin/phpcs` for PHP

## Key Implementation Details

### Setup Scripts

- **setup-monorepo.js**: Creates root-level configuration files and installs dependencies
- **setup-theme.js**: Creates theme structure with proper WordPress theme files
- **setup-plugin.js**: Creates plugin structure with proper WordPress plugin files
- **utils.js**: Shared utilities for file operations and user prompts

### Configuration Templates

- All configuration files are stored in `config/` directory
- Templates use `{{PROJECT_NAME}}` for dynamic content replacement
- Setup scripts copy templates rather than generating content inline

### Dependencies Management

- **Root-level dependencies**: All shared dependencies (ESLint, StyleLint, Webpack, etc.)
- **Theme/plugin dependencies**: Only theme/plugin-specific dependencies
- **Composer dependencies**: PHP dependencies managed at root level
- **NPM dependencies**: JavaScript dependencies managed at root level

## Common Patterns

### 1. Configuration Extension

When extending configurations, prefer copying and modifying template files rather than inline generation:

```javascript
// Good: Copy template file
fs.copyFileSync(templatePath, targetPath);

// Avoid: Inline configuration generation
const config = {
	/* ... */
};
fs.writeFileSync(targetPath, JSON.stringify(config));
```

**Note:** All configuration files (ESLint, StyleLint, Prettier, PHPCS, EditorConfig) are copied from templates in the `config/` directory.

### 2. Script Organization

Add lint/format scripts to root composer.json, not individual theme/plugin files:

```json
{
	"scripts": {
		"lint-theme-php-themename": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/themename",
		"format-theme-php-themename": "./vendor/bin/phpcbf --standard=phpcs.xml.dist ./wp-content/themes/themename"
	}
}
```

### 3. User Interaction

Setup scripts should provide clear, non-verbose output:

```javascript
// Good: High-level summary
console.log('✅ Theme setup completed successfully!');
console.log('📁 Created files: package.json, index.php, style.css');

// Avoid: Verbose WordPress block creation messages
console.log('Creating WordPress theme block...');
console.log('Adding theme header...');
```

## Troubleshooting

### Common Issues

1. **Dependencies not found**: Ensure all dependencies are installed at root level
2. **Build failures**: Check that all required source files exist in `src/` directories
3. **Configuration conflicts**: Verify that configuration files are properly copied from templates

### Debugging

- Use `--verbose` flags where available for detailed output
- Check `dist/` directories for build artifacts
- Verify configuration files are properly formatted

## Best Practices

1. **Always copy configuration templates** rather than generating them inline
2. **Keep dependencies at root level** for consistent versioning
3. **Use descriptive script names** in composer.json for easy identification
4. **Provide clear, non-verbose output** in setup scripts
5. **Implement features incrementally** with testing between steps
6. **Maintain consistent file structure** across all themes and plugins

## Contributing

When contributing to this project:

1. Follow the established configuration patterns
2. Use the provided setup scripts for consistency
3. Test changes with both themes and plugins
4. Update documentation for any new features
5. Maintain backward compatibility with existing setups
