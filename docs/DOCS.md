# WordPress Dependency Manager - Documentation

## Table of Contents

- [Installation Options](#installation-options)
- [Configuration Details](#configuration-details)
- [Build System](#build-system)
- [File Structures](#file-structures)
- [Safety Features](#safety-features)
- [Command Reference](#command-reference)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## Installation Options

### Global vs Local Installation

#### Global Installation Benefits
- **Convenience**: Run `wp-dependency` commands from anywhere
- **Consistency**: Same version across all projects
- **Quick setup**: No need to install in each project
- **CLI experience**: Familiar command-line interface

#### Local Installation Benefits
- **Project isolation**: Each project can use different versions
- **Team consistency**: Version is locked in package.json
- **CI/CD friendly**: Dependencies are explicitly declared
- **No global pollution**: Doesn't affect system-wide npm packages

#### When to Use Each

**Use Global Installation when:**
- You frequently create new WordPress projects
- You want a consistent development experience
- You prefer CLI tools over npm scripts
- You're working on personal projects

**Use Local Installation when:**
- You're working on team projects
- You need version control per project
- You're setting up CI/CD pipelines
- You want to ensure reproducible builds

## Configuration Details

### ESLint Configuration

ESLint is configured to enforce JavaScript/TypeScript coding standards. The setup process automatically creates a `.eslintrc.json` file in your project root by copying the configuration template from the package.

### StyleLint Configuration

StyleLint ensures consistent CSS/SCSS coding standards. The setup process automatically creates a `.stylelintrc.json` file in your project root by copying the configuration template from the package.

A `.stylelintignore` file is also created to exclude certain files:

```
node_modules
dist
build
```

### Prettier Configuration

Prettier provides code formatting rules. The setup process automatically creates a `.prettierrc` file in your project root by copying the configuration template from the package.

A `.prettierignore` file is also created to exclude files from formatting:

```
node_modules
dist
build
```

### PHPCS Configuration

PHP_CodeSniffer enforces PHP coding standards. The setup process automatically creates a `phpcs.xml.dist` file in your project root by copying the configuration template from the package.

### Editor Configuration

The package includes `.editorconfig` settings for consistent coding styles across different editors and IDEs. The setup process automatically creates an `.editorconfig` file in your project root by copying the configuration template from the package.

### Composer Configuration

A root-level `composer.json` file is automatically created to manage PHP dependencies and coding standards:

```json
{
    "require-dev": {
        "squizlabs/php_codesniffer": "^3.12.0",
        "wp-coding-standards/wpcs": "^3.1"
    },
    "config": {
        "allow-plugins": {
            "dealerdirect/phpcodesniffer-composer-installer": true
        }
    },
    "scripts": {
        "lint-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes ./wp-content/plugins",
        "format-php": "./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes ./wp-content/plugins || true"
    }
}
```

This includes PHP CodeSniffer and WordPress Coding Standards for PHP code quality. The lint and format scripts automatically scan all themes and plugins.

## Build System

### Current Architecture

Each theme and plugin includes its own build configuration:

**Themes:**
- **Entry points:** `src/scripts/index.js`, `src/styles.scss`, `src/editor-styles.scss`
- **Output directory:** `dist/` (referenced in `functions.php`)
- **Webpack config:** `webpack.config.js` (copied from template)
- **Build orchestration:** Individual `turbo.json` files

**Plugins:**
- **Entry points:** `src/scripts/index.js`, `src/styles.scss`, `src/editor-styles.scss`
- **Output directory:** `dist/`
- **Webpack config:** Uses `@wordpress/scripts` with custom `webpack.scripts.js`
- **Build orchestration:** Individual `turbo.json` files
- **Blocks:** Auto-generated example blocks (static, dynamic, interactive)

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

## File Structures

### Theme Structure

```
wp-content/themes/your-theme/
├── package.json             # Build scripts and dependencies
├── turbo.json               # Build orchestration
├── webpack.config.js        # Webpack configuration
├── functions.php            # WordPress theme setup
├── header.php               # Theme header template
├── footer.php               # Theme footer template
├── index.php                # Main theme file
├── style.css                # WordPress theme header
├── src/
│   ├── scripts/
│   │   └── index.js         # Main JavaScript entry
│   ├── styles.scss          # Main stylesheet
│   └── editor-styles.scss   # Editor-specific styles
└── dist/                    # Built assets (generated)
    ├── scripts.js
    ├── styles.css
    └── editor-styles.css
```

### Plugin Structure

```
wp-content/plugins/your-plugin/
├── package.json             # Build scripts and dependencies
├── turbo.json               # Build orchestration
├── webpack.scripts.js       # Custom webpack config
├── plugin.php               # Main plugin file
├── src/
│   ├── blocks/              # WordPress blocks (auto-generated)
│   │   ├── static-example/
│   │   ├── dynamic-example/
│   │   └── interactive-example/
│   ├── scripts/
│   │   └── index.js         # Main JavaScript entry
│   ├── styles.scss          # Main stylesheet
│   └── editor-styles.scss   # Editor-specific styles
└── dist/                    # Built assets (generated)
    ├── blocks/              # Built block assets
    ├── scripts.js
    └── styles.css
```

## Safety Features

The setup process includes several safety measures to protect your existing configuration:

### Automatic Backup

- Existing configuration files are automatically backed up to `.wp-dependency-backups/[timestamp]/`
- Backups are created before any files are modified
- You can restore files manually if needed

### Setup Options

- `wp-dependency setup` - Standard setup with backup and confirmation
- `wp-dependency setup --dry-run` - Preview changes without modifying files
- `wp-dependency setup --safe` - Only create files that don't exist

### File Conflict Resolution

When existing configuration files are detected:

1. You'll see a detailed list of files that would be overwritten with modification dates
2. Files are backed up automatically before proceeding
3. You can cancel the setup if you need to review existing configurations

### Recovery

If you need to restore backed-up files:

```bash
# List available backups
ls -la .wp-dependency-backups/

# Restore from a specific backup (replace timestamp with actual backup folder)
cp -r .wp-dependency-backups/2025-07-06T10-30-00/* .
```

## Command Reference

### CLI Commands (wp-dependency)

#### setup
Creates the monorepo structure with all necessary configuration files.

```bash
wp-dependency setup [options]

Options:
  --dry-run    Preview changes without modifying files
  --safe       Only create files that don't exist
```

#### setup:theme
Creates a new WordPress theme with proper structure and build configuration.

```bash
wp-dependency setup:theme [options]

Options:
  --dry-run    Preview changes without modifying files
  --safe       Only create files that don't exist
```

#### setup:plugin
Creates a new WordPress plugin with proper structure and build configuration.

```bash
wp-dependency setup:plugin [options]

Options:
  --dry-run    Preview changes without modifying files
  --safe       Only create files that don't exist
```

### NPM Scripts (after setup)

#### build
Builds all themes and plugins for production.

```bash
npm run build
```

#### build:force
Forces a rebuild by bypassing Turborepo cache.

```bash
npm run build:force
```

### Planned Commands (Future Releases)

- `npm run start` - Start development server
- `npm run lint` - Run linting across all projects
- `npm run format` - Format code across all projects
- `npm run clean` - Clean build artifacts

## Troubleshooting

### Build Cache Issues

**Issue**: After setting up new themes or plugins, they may not build correctly on the first attempt due to Turborepo cache conflicts.

**Symptoms**:
- Theme or plugin shows "cache hit" but no actual build output
- Missing build assets even though build reports success
- "FULL TURBO" message but no files generated

**Solution**: Use the force build command to bypass cache and rebuild:

```bash
npm run build:force
```

This forces Turborepo to bypass the cache and actually execute the build process, creating the proper build outputs and cache entries for future builds.

**Prevention**: The issue typically occurs when multiple projects are created quickly with similar source file structures. The updated turbo.json configurations in recent versions help prevent this by using more specific cache keys.

### Common Issues

1. **Dependencies not found**: Ensure all dependencies are installed at root level
2. **Build failures**: Check that all required source files exist in `src/` directories
3. **Configuration conflicts**: Verify that configuration files are properly copied from templates

### Debugging

- Use `--verbose` flags where available for detailed output
- Check `dist/` directories for build artifacts
- Verify configuration files are properly formatted

## Advanced Usage

### Custom Configuration

While the package provides opinionated defaults, you can customize configurations after setup:

1. **ESLint**: Modify `.eslintrc.json` in your project root
2. **StyleLint**: Modify `.stylelintrc.json` in your project root
3. **Webpack**: Modify individual theme/plugin webpack configs
4. **Turborepo**: Modify `turbo.json` files for custom build pipelines

### CI/CD Integration

The generated configuration works well with continuous integration:

```yaml
# Example GitHub Actions workflow
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
```

### Multiple Environment Support

The build system supports different environments:

- **Development**: `npm run build` (with source maps)
- **Production**: `npm run build` (optimized, minified)
- **Force rebuild**: `npm run build:force` (bypasses cache)

## Requirements and Limitations

### Directory Structure Requirements

This tool expects a standard WordPress installation structure:

- **WordPress root** with `wp-config.php`, `wp-content/`, `wp-includes/`, `wp-admin/`
- **Theme location:** `wp-content/themes/`
- **Plugin location:** `wp-content/plugins/`

### Source File Conventions

**Themes must follow this structure:**
- `src/scripts/index.js` - Main JavaScript entry point
- `src/styles.scss` - Main stylesheet
- `src/editor-styles.scss` - Editor styles
- `functions.php` - WordPress theme functions (auto-generated)
- `header.php` - Theme header template (auto-generated)
- `footer.php` - Theme footer template (auto-generated)
- `index.php` - Main theme file (auto-generated)
- `style.css` - WordPress theme header (auto-generated)

**Plugins must follow this structure:**
- `src/scripts/index.js` - Main JavaScript entry point
- `src/styles.scss` - Main stylesheet
- `src/editor-styles.scss` - Editor-specific styles
- `plugin.php` - Main plugin file (auto-generated)

### Configuration Dependencies

The setup creates configuration files at specific locations that themes/plugins depend on:

- **Root-level configs:** `.eslintrc.json`, `.stylelintrc.json`, `.prettierrc`, `phpcs.xml.dist`
- **Relative paths:** Theme/plugin lint scripts reference configs 3 levels up (`../../../.eslintrc.json`)
- **Build output:** All themes/plugins output to `dist/` directory

### WordPress Integration

Generated themes and plugins include WordPress-specific integration:

- **Theme functions:** Auto-generated PHP functions based on theme name
- **Asset enqueuing:** `functions.php` references `/dist/styles.css` and `/dist/scripts.js`
- **Plugin headers:** Auto-generated plugin headers in `plugin.php`

⚠️ **Important:** Changing file locations or names after setup may break the build system. See [REVIEW.md](./REVIEW.md) for detailed information about configuration dependencies and hard-coded paths.