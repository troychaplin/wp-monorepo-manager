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
├── package.json          # Created by setup
├── turbo.json           # Created by setup
├── composer.json        # Created by setup
├── .eslintrc.json       # Created by setup
├── .stylelintrc.json    # Created by setup
├── .prettierrc          # Created by setup
├── phpcs.xml.dist       # Created by setup
├── .editorconfig        # Created by setup
├── .gitignore           # Created by setup
├── wp-config.php        # Existing WordPress file
├── wp-content/          # Existing WordPress directory
│   ├── plugins/         # Existing plugins directory
│   └── themes/          # Existing themes directory
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

### Git Configuration

A `.gitignore` file is automatically created to exclude common files and directories:

```
# Dependencies
node_modules/

# Build artifacts
dist/

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
```

### Composer Configuration

A `composer.json` file is automatically created to manage PHP dependencies and coding standards:

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
		"lint-plugin-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/plugins/test-plugin",
		"format-plugin-php": "./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/plugins/test-plugin || true",
		"lint-theme-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/test-theme",
		"format-theme-php": "./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes/test-theme || true"
	}
}
```

This includes PHP CodeSniffer and WordPress Coding Standards for PHP code quality.

## Available Commands

### CLI Commands (wp-monorepo)

- `wp-monorepo setup` - Create monorepo structure
- `wp-monorepo setup:theme` - Create a new theme
- `wp-monorepo setup:plugin` - Create a new plugin

**Note:** Build commands (`wp-monorepo build`, `wp-monorepo build:dev`, `wp-monorepo build:prod`) are planned for future releases.

### NPM Scripts (after setup)

- `npm run build` - Build all themes and plugins
- `npm run build:dev` - Build in development mode
- `npm run build:prod` - Build in production mode

**Note:** Development server, linting, formatting, and cleaning commands are planned for future releases.

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

## Documentation

For detailed documentation, see [DOCS.md](./DOCS.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
