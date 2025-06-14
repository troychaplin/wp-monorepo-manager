# WordPress Monorepo Manager

A reusable package that provides standardized build tools and coding standards for WordPress themes and plugins in a monorepo structure. This package includes pre-configured ESLint, StyleLint, PHPCS, and Webpack configurations that follow WordPress best practices.

## Features

- **Standardized Configurations**

    - ESLint configuration for JavaScript
    - StyleLint configuration for CSS/SCSS
    - PHPCS configuration for PHP
    - Webpack configuration for asset building

- **WordPress Best Practices**

    - Follows WordPress coding standards
    - Optimized for block editor development
    - Supports modern JavaScript features

- **Easy Integration**
    - Simple installation process
    - Extensible configurations
    - Utility functions for configuration management

## Installation

```bash
npm install wp-monorepo-manager --save-dev
```

## Quick Start

1. **Install the package**

    ```bash
    npm install wp-monorepo-manager --save-dev
    ```

2. **Extend the configurations in your project**

    ESLint (.eslintrc.json):

    ```json
    {
    	"extends": ["wp-monorepo-manager/config/eslint/.eslintrc.json"]
    }
    ```

    StyleLint (.stylelintrc.json):

    ```json
    {
    	"extends": ["wp-monorepo-manager/config/stylelint/.stylelintrc.json"]
    }
    ```

    PHPCS (phpcs.xml.dist):

    ```xml
    <?xml version="1.0"?>
    <ruleset name="WordPress Coding Standards">
      <rule ref="wp-monorepo-manager/config/phpcs/phpcs.xml.dist"/>
    </ruleset>
    ```

    Webpack (webpack.config.js):

    ```javascript
    const { merge } = require('webpack-merge');
    const defaultConfig = require('wp-monorepo-manager/config/webpack/webpack.config.js');

    module.exports = merge(defaultConfig, {
    	// Your custom configuration
    });
    ```

## Usage

### Accessing Configuration Paths

```javascript
const { utils } = require('wp-monorepo-manager');

// Get path to ESLint config
const eslintConfigPath = utils.getConfigPath('eslint');

// Get all config paths
const allConfigPaths = utils.getAllConfigPaths();
```

### Available Configurations

- `eslint`: JavaScript linting
- `stylelint`: CSS/SCSS linting
- `phpcs`: PHP coding standards
- `webpack`: Asset building

## Requirements

- Node.js >= 20
- npm >= 10.0.0
- WordPress >= 6.4

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
