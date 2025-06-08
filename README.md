# WordPress Monorepo

This monorepo contains the WordPress theme and custom blocks plugin for International Documents Canada, using Turbo for build orchestration and npm workspaces for package management.

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

    wordpress/
    ├── wp-content/
    │   ├── plugins/
    │   │   └── starter-plugin/     # Custom plugin
    │   └── themes/
    │       └── starter-theme/      # Custom theme
    ├── .github/                    # CI/CD workflows
    ├── .husky/                     # Git hooks
    ├── .eslintrc.json              # ESLint configuration
    ├── .prettierrc.json            # Prettier configuration
    ├── .stylelintrc.json           # Stylelint configuration
    ├── .size-limit.json            # Bundle size limits
    ├── package.json                # Root package configuration
    ├── turbo.json                  # Turbo pipeline configuration
    └── README.md                   # This file

## Getting Started

Add info

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
cd wp-content/themes/starter-theme
composer install
```