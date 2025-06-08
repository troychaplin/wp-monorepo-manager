# WordPress Monorepo Manager

A modern WordPress development setup using a monorepo architecture with Turbo for build orchestration and npm workspaces for package management. This project provides a structured approach to developing custom WordPress themes and plugins with modern tooling and best practices.

## Prerequisites

- Node.js >= 20
- npm >= 10.0.0
- WordPress >= 6.4
- Composer (for theme dependencies)

## Code Standards

This project follows WordPress Coding Standards using:

- ESLint with `@wordpress/eslint-plugin`
- Stylelint with `@wordpress/stylelint-config`
- PHP with `wp-coding-standards/wpcs`

## Project Structure

    wordpress/                      # WordPress installation (ignored except for custom code)
    ├── wp-content/
    │   ├── plugins/
    │   │   └── monorepo-plugin/    # Custom blocks plugin
    │   └── themes/
    │       └── monorepo-theme/     # Custom theme
    ├── .gitignore                  # Git ignore rules
    ├── .eslintrc.json              # ESLint configuration
    ├── .prettierrc.json            # Prettier configuration
    ├── .stylelintrc.json           # Stylelint configuration
    ├── package.json                # Root package configuration
    ├── phpcs.xml.dist              # PHP CodeSniffer configuration
    ├── turbo.json                  # Turbo pipeline configuration
    └── README.md                   # This file

## Getting Started

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd wp-monorepo-manager
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up WordPress**

    - Place your WordPress installation in the `wordpress/` directory
    - The theme and plugin directories are already configured and tracked in Git

4. **Development**
    ```bash
    npm run start    # Start development mode with file watching
    ```

## Common Commands

### Building

```
npm run build          # Build all workspaces
npm run build:dev      # Build with development settings
npm run build:prod     # Build with production settings
npm run build:theme    # Build theme only
npm run build:plugin   # Build plugin only
```

### Maintenance

```
npm run clean          # Clean all workspaces
npm run format         # Format all code
npm run lint           # Run all linters
npm run size           # Check bundle sizes
```

## Contributing

Commits must follow the conventional commit format:

```
type: commit note
```

### Available Types

- `add:` New features
- `change:` Changes to existing functionality
- `deprecate:` Soon-to-be removed features
- `doc:` Documentation only changes
- `fix:` Bug fixes
- `finish:` Finishing touches
- `refactor:` Code restructuring
- `release:` Version changes
- `revert:` Revert previous commits
- `test:` Adding/updating tests
- `upgrade:` Dependencies updates

## Troubleshooting

If you encounter build issues:

```
# Clean everything and reinstall
npm run clean
rm -rf .turbo
npm install
```

For theme template issues:

```
cd wordpress/wp-content/themes/monorepo-theme
composer install
```

## Key Features

- **Monorepo Architecture** - Manage theme and plugin in a single repository
- **Modern Build Tools** - Uses Turbo for fast, cached builds
- **WordPress Standards** - Follows WordPress coding standards with automated linting
- **Hot Reloading** - Development mode with automatic rebuilds
- **Size Monitoring** - Bundle size limits to keep assets optimized
- **Git Integration** - Smart `.gitignore` that tracks only your custom code
