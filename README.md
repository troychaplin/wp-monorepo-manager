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
    npm install wp-monorepo-manager
    ```

2. Set up your monorepo structure:

    ```bash
    # Create the basic monorepo structure
    npm run setup-test

    # Create a theme (optional)
    npm run setup-theme

    # Create a plugin (optional)
    npm run setup-plugin
    ```

3. Your project structure will look like this:

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

4. Configure your root package.json:

    ```json
    {
    	"name": "my-wordpress-project",
    	"version": "1.0.0",
    	"private": true,
    	"workspaces": ["wp-content/themes/*", "wp-content/plugins/*"],
    	"scripts": {
    		"build": "turbo run build",
    		"build:dev": "turbo run build:dev",
    		"build:prod": "turbo run build:prod",
    		"start": "turbo run start",
    		"lint": "turbo run lint",
    		"format": "turbo run format",
    		"clean": "turbo run clean"
    	},
    	"dependencies": {
    		"@wordpress/browserslist-config": "^6.25.0",
    		"@wordpress/eslint-plugin": "22.11.0",
    		"@wordpress/scripts": "30.18.0",
    		"css-loader": "^7.1.2",
    		"eslint-config-wordpress": "2.0.0",
    		"postcss-import": "^16.1.0",
    		"prettier": "3.5.3",
    		"sass": "^1.71.0",
    		"sass-loader": "^16.0.5",
    		"stylelint": "16.20.0",
    		"stylelint-scss": "^6.11.1",
    		"turbo": "2.5.4"
    	},
    	"packageManager": "npm@10.2.4"
    }
    ```

5. Run your first build:
    ```bash
    npm run build
    ```

## Configuration

The package includes pre-configured settings for various development tools. These configurations are located in the `config/` directory:

### ESLint Configuration

ESLint is configured to enforce JavaScript/TypeScript coding standards. Create a `.eslintrc.json` file in your project root:

```json
{
	"extends": ["wp-monorepo-manager/config/eslint"]
}
```

### StyleLint Configuration

StyleLint ensures consistent CSS/SCSS coding standards. Create a `.stylelintrc.json` file in your project root:

```json
{
	"extends": ["wp-monorepo-manager/config/stylelint"]
}
```

You may also want to create a `.stylelintignore` file to exclude certain files:

```
node_modules
dist
build
```

### Prettier Configuration

Prettier provides code formatting rules. Create a `.prettierrc` file in your project root:

```json
{
	"extends": ["wp-monorepo-manager/config/prettier"]
}
```

Optionally create a `.prettierignore` file to exclude files from formatting:

```
node_modules
dist
build
```

### PHPCS Configuration

PHP_CodeSniffer enforces PHP coding standards. Create a `phpcs.xml` file in your project root:

```xml
<?xml version="1.0"?>
<ruleset name="WordPress Monorepo Standards">
    <rule ref="wp-monorepo-manager/config/phpcs"/>
</ruleset>
```

### Webpack Configuration

Webpack is configured for asset bundling. Create a `webpack.config.js` file in your project root:

```javascript
const { webpackConfig } = require('wp-monorepo-manager/config/webpack');

module.exports = webpackConfig;
```

### Editor Configuration

The package includes `.editorconfig` settings for consistent coding styles across different editors and IDEs. Create an `.editorconfig` file in your project root:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,yml,yaml,md}]
indent_size = 2
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
