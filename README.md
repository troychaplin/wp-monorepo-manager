# WordPress Dependency Manager

> ⚠️ **Development Status**: This is a prototype tool currently in active development. Features and APIs may change without notice. Not recommended for production use.

A build tool for managing WordPress themes and plugins in a monorepo structure. This package provides standardized configurations and build tools for efficient WordPress development.

## Features

- **Monorepo Management**: Use Turborepo to manage multiple WordPress themes and plugins
- **Standardized Configurations**: Pre-configured settings for ESLint, StyleLint, PHPCS, and Webpack
- **Build Tools**: Unified build process for all themes and plugins
- **Development Workflow**: Consistent development experience across projects
- **Code Quality**: Enforced coding standards across all projects

## Installation & Testing

> 📦 **Package Status**: This package is not yet published to npm. For testing and development, please see [TEST.md](./docs/TEST.md) for setup instructions using local development methods.

## Quick Start

### Global Installation (Recommended)

```bash
# Install globally
npm install -g wp-dependency-manager

# Navigate to your WordPress installation
cd /path/to/your/wordpress-site

# Set up monorepo structure
wp-dependency setup

# Create a theme (optional)
wp-dependency setup:theme

# Create a plugin (optional)
wp-dependency setup:plugin

# Build all projects
npm run build
```

### Local Installation

```bash
# Navigate to your WordPress installation
cd /path/to/your/wordpress-site

# Install locally
npm install wp-dependency-manager

# Set up monorepo structure
npx wp-dependency setup

# Create projects and build
npx wp-dependency setup:theme
npm run build
```

## Available Commands

### CLI Commands
- `wp-dependency setup` - Create monorepo structure
- `wp-dependency setup:theme` - Create a new theme
- `wp-dependency setup:plugin` - Create a new plugin

### NPM Scripts (after setup)
- `npm run build` - Build all themes and plugins
- `npm run build:force` - Force rebuild (bypasses turbo cache)

## Project Structure

After setup, your WordPress installation will include:

```
your-wordpress-site/
├── package.json             # Monorepo configuration
├── turbo.json               # Build orchestration
├── composer.json            # PHP dependencies
├── .eslintrc.json           # Code quality configs
├── .stylelintrc.json
├── .prettierrc
├── phpcs.xml.dist
├── wp-content/
│   ├── themes/your-theme/   # Generated themes
│   │   ├── src/             # Source files
│   │   └── dist/            # Built assets
│   └── plugins/your-plugin/ # Generated plugins
│       ├── src/             # Source files
│       └── dist/            # Built assets
```

## Safety Features

The setup includes automatic backup and safety options:

- **Automatic backups** of existing config files
- **`--dry-run`** - Preview changes without modifying files
- **`--safe`** - Only create files that don't exist
- **Recovery instructions** for restoring backups

## Requirements

- Node.js 14+ and npm
- Existing WordPress installation
- Standard WordPress directory structure (`wp-content/themes/`, `wp-content/plugins/`)

## Documentation

- **[DOCS.md](./docs/DOCS.md)** - Complete documentation, configuration details, and advanced usage
- **[TEST.md](./docs/TEST.md)** - Test scenarios and validation procedures
- **[REVIEW.md](./docs/REVIEW.md)** - Known limitations, hard-coded dependencies, and improvement areas

## Known Issues

**Build Cache Issues**: New themes/plugins may not build correctly on first attempt. Use `npm run build:force` to bypass cache and rebuild properly.

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and review [REVIEW.md](./REVIEW.md) to understand current limitations.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
