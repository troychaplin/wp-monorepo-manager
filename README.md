# WordPress Monorepo Manager

A build tool for managing WordPress themes and plugins in a monorepo structure. This package provides standardized configurations and build tools for efficient WordPress development.

## Features

- **Monorepo Management**: Use Turborepo to manage multiple WordPress themes and plugins
- **Standardized Configurations**: Pre-configured settings for ESLint, StyleLint, PHPCS, and Webpack
- **Build Tools**: Unified build process for all themes and plugins
- **Development Workflow**: Consistent development experience across projects
- **Code Quality**: Enforced coding standards across all projects

## Quick Start

### Option 1: Global Installation (Recommended for CLI usage)

1. Install the package globally:

    ```bash
    npm install -g wp-monorepo-manager
    ```

2. Set up your monorepo structure in an existing WordPress installation:

    ```bash
    # Navigate to your WordPress installation root
    cd /path/to/your/wordpress-site

    # Create the monorepo configuration
    wp-monorepo setup

    # Create a theme (optional)
    wp-monorepo setup:theme

    # Create a plugin (optional)
    wp-monorepo setup:plugin
    ```

### Option 2: Local Project Installation

1. Navigate to your existing WordPress installation:

    ```bash
    cd /path/to/your/wordpress-site
    ```

2. Install the package locally:

    ```bash
    npm install wp-monorepo-manager
    ```

3. Set up your monorepo structure using npm scripts:

    ```bash
    # Create the monorepo configuration
    npx wp-monorepo setup

    # Create a theme (optional)
    npx wp-monorepo setup:theme

    # Create a plugin (optional)
    npx wp-monorepo setup:plugin
    ```

### Project Structure

Your existing WordPress installation will be enhanced with monorepo configuration:

```
your-wordpress-site/
├── package.json             # Created by setup
├── turbo.json               # Created by setup
├── composer.json            # Created by setup
├── .eslintrc.json           # Created by setup
├── .stylelintrc.json        # Created by setup
├── .prettierrc              # Created by setup
├── phpcs.xml.dist           # Created by setup
├── .editorconfig            # Created by setup
├── wp-config.php            # Existing WordPress file
├── wp-content/              # Existing WordPress directory
│   ├── plugins/             # Existing plugins directory
│   │   └── your-plugin/     # Created plugins (build/ directory for assets)
│   └── themes/              # Existing themes directory
│       └── your-theme/      # Created themes (build/ directory for assets)
└── ... (other WordPress files)
```

### Configuration

The package includes pre-configured settings for various development tools. These configurations are automatically created during the setup process and are located in the `config/` directory:

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

## Build System

### Current Architecture

Each theme and plugin includes its own build configuration:

**Themes:**

- **Entry points:** `src/scripts.js`, `src/styles.scss`, `src/editor-styles.scss`
- **Output directory:** `build/` (referenced in `functions.php`)
- **Webpack config:** `webpack.config.js` (copied from template)
- **Build orchestration:** Individual `turbo.json` files

**Plugins:**

- **Entry points:** `src/scripts.js`, `src/styles.scss`, `src/editor-styles.scss`
- **Output directory:** `build/`
- **Webpack config:** Uses `@wordpress/scripts` with custom `webpack.scripts.js`
- **Build orchestration:** Individual `turbo.json` files
- **Blocks:** Auto-generated example blocks (static, dynamic, interactive)

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
│   ├── scripts.js           # Main JavaScript entry
│   ├── styles.scss          # Main stylesheet
│   └── editor-styles.scss   # Editor-specific styles
└── build/                   # Built assets (generated)
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
│   ├── scripts.js           # Main JavaScript entry
│   ├── styles.scss          # Main stylesheet
│   └── editor-styles.scss   # Editor-specific styles
└── build/                   # Built assets (generated)
    ├── blocks/              # Built block assets
    ├── scripts.js
    └── styles.css
```

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

## Available Commands

### CLI Commands (wp-monorepo)

- `wp-monorepo setup` - Create monorepo structure
- `wp-monorepo setup:theme` - Create a new theme
- `wp-monorepo setup:plugin` - Create a new plugin

### NPM Scripts (after setup)

- `npm run build` - Build all themes and plugins
- `npm run build:force` - Force rebuild (bypasses turbo cache)
- `npm run start` - Start development server (planned for future release)
- `npm run lint` - Run linting across all projects (planned for future release)
- `npm run format` - Format code across all projects (planned for future release)
- `npm run clean` - Clean build artifacts (planned for future release)

## Installation Options

### Global Installation Benefits

- **Convenience**: Run `wp-monorepo` commands from anywhere
- **Consistency**: Same version across all projects
- **Quick setup**: No need to install in each project
- **CLI experience**: Familiar command-line interface

### Local Installation Benefits

- **Project isolation**: Each project can use different versions
- **Team consistency**: Version is locked in package.json
- **CI/CD friendly**: Dependencies are explicitly declared
- **No global pollution**: Doesn't affect system-wide npm packages

### When to Use Each

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

## Known Issues

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

## Requirements and Limitations

### Directory Structure Requirements

This tool expects a standard WordPress installation structure:

- **WordPress root** with `wp-config.php`, `wp-content/`, `wp-includes/`, `wp-admin/`
- **Theme location:** `wp-content/themes/`
- **Plugin location:** `wp-content/plugins/`

### Source File Conventions

**Themes must follow this structure:**

- `src/scripts.js` - Main JavaScript entry point
- `src/styles.scss` - Main stylesheet
- `src/editor-styles.scss` - Editor styles
- `functions.php` - WordPress theme functions (auto-generated)
- `header.php` - Theme header template (auto-generated)
- `footer.php` - Theme footer template (auto-generated)
- `index.php` - Main theme file (auto-generated)
- `style.css` - WordPress theme header (auto-generated)

**Plugins must follow this structure:**

- `src/scripts.js` - Main JavaScript entry point
- `src/styles.scss` - Main stylesheet
- `src/editor-styles.scss` - Editor-specific styles
- `plugin.php` - Main plugin file (auto-generated)

### Configuration Dependencies

The setup creates configuration files at specific locations that themes/plugins depend on:

- **Root-level configs:** `.eslintrc.json`, `.stylelintrc.json`, `.prettierrc`, `phpcs.xml.dist`
- **Relative paths:** Theme/plugin lint scripts reference configs 3 levels up (`../../../.eslintrc.json`)
- **Build output:** All themes/plugins output to `build/` directory

### WordPress Integration

Generated themes and plugins include WordPress-specific integration:

- **Theme functions:** Auto-generated PHP functions based on theme name
- **Asset enqueuing:** `functions.php` references `/build/styles.css` and `/build/scripts.js`
- **Plugin headers:** Auto-generated plugin headers in `plugin.php`

⚠️ **Important:** Changing file locations or names after setup may break the build system. See [HEAVY.md](./HEAVY.md) for detailed information about configuration dependencies.

## Documentation

For detailed documentation, see [DOCS.md](./DOCS.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
