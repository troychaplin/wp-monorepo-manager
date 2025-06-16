# WordPress Monorepo Manager

A build tool for managing WordPress themes and plugins in a monorepo structure. This package provides standardized configurations and build tools for efficient WordPress development.

## Features

- **Monorepo Management**: Use Turborepo to manage multiple WordPress themes and plugins
- **Standardized Configurations**: Pre-configured settings for ESLint, StyleLint, PHPCS, and Webpack
- **Build Tools**: Unified build process for all themes and plugins
- **Development Workflow**: Consistent development experience across projects
- **Code Quality**: Enforced coding standards across all projects

## Quick Start

1. Install the package:

    ```bash
    npm install --save-dev wp-monorepo-manager
    ```

2. Set up your monorepo structure:

    ```
    my-wordpress-project/
    ├── package.json
    ├── turbo.json
    ├── wp-content/
    │   ├── plugins/
    │   │   └── my-plugin/
    │   └── themes/
    │       └── my-theme/
    ```

3. Configure your root package.json:

    ```json
    {
    	"name": "my-wordpress-project",
    	"private": true,
    	"workspaces": ["wp-content/plugins/*", "wp-content/themes/*"],
    	"scripts": {
    		"build": "turbo run build",
    		"start": "turbo run start",
    		"lint": "turbo run lint",
    		"format": "turbo run format"
    	},
    	"devDependencies": {
    		"wp-monorepo-manager": "^0.1.0",
    		"turbo": "^2.0.0"
    	}
    }
    ```

4. Run your first build:
    ```bash
    npm run build
    ```

## Available Commands

- `npm run build` - Build all themes and plugins
- `npm run build:dev` - Build in development mode
- `npm run build:prod` - Build in production mode
- `npm run start` - Start development mode
- `npm run lint` - Lint all projects
- `npm run format` - Format all projects
- `npm run clean` - Clean build artifacts

## Documentation

For detailed documentation, see [DOCS.md](./DOCS.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
