# WordPress Monorepo Manager Testing

This document outlines the testing process for the WordPress Monorepo Manager package during development.

## Prerequisites

- Node.js >= 20
- npm >= 10.0.0
- WordPress development environment
- Git

## Development Testing Workflow

This section covers testing the package during development, before publishing.

### Step 1: Local Package Development

1. **Clone and set up the development environment:**

    ```bash
    # Clone the repository
    git clone https://github.com/troychaplin/wp-monorepo-manager.git
    cd wp-monorepo-manager

    # Install dependencies
    npm install

    # Create a global link to the package
    npm link
    ```

2. **Test the setup scripts:**

    ```bash
    # Create the basic monorepo structure
    npm run setup-monorepo

    # Create a theme (optional)
    npm run setup-theme

    # Create a plugin (optional)
    npm run setup-plugin
    ```

3. **Verify the development environment:**

    ```bash
    # Check that the CLI command is available
    wp-monorepo --help

    # Verify the package is linked correctly
    npm list -g wp-monorepo-manager

    # Test that you can run setup commands
    wp-monorepo setup --help
    ```

4. **Cleanup when done testing:**

    ```bash
    # Remove the global link
    npm unlink -g wp-monorepo-manager
    ```

### Understanding npm link

`npm link` creates a symbolic link between your local package and the global npm packages directory, making it available globally for testing.

**What it does:**

- Makes your local package available globally as if it were installed
- Enables CLI testing from anywhere
- Provides immediate feedback for changes

**Usage:**

```bash
# From wp-monorepo-manager directory
npm link
# Creates: /usr/local/lib/node_modules/wp-monorepo-manager -> /path/to/your/local/package

# Cleanup when done
npm unlink -g wp-monorepo-manager
```

### Step 2: Test Local Package Installation

1. **Create a test project directory:**

    ```bash
    # From parent directory of wp-monorepo-manager
    mkdir wp-monorepo-test
    cd wp-monorepo-test
    ```

2. **Test the CLI commands:**

    ```bash
    # Test help command
    wp-monorepo --help

    # Test setup command
    wp-monorepo setup

    # Test theme setup
    wp-monorepo setup:theme

    # Test plugin setup
    wp-monorepo setup:plugin
    ```

### Step 3: Verify Package Functionality

1. **Check package installation:**

    ```bash
    # Verify the package is linked
    npm list wp-monorepo-manager
    ```

2. **Test build process:**

    ```bash
    # Build all projects
    npm run build

    # Build specific theme (replace with actual theme name)
    npm run build --workspace=wp-content/themes/your-theme

    # Build specific plugin (replace with actual plugin name)
    npm run build --workspace=wp-content/plugins/your-plugin
    ```

## Test Project Directory Structure

Your test directory structure should look like this:

```
parent-directory/
│
├── wp-monorepo-manager/     # The package repository (development)
│   ├── package.json
│   ├── config/
│   ├── scripts/
│   └── ...
│
└── wp-monorepo-test/        # Test directory
    ├── package.json
    ├── turbo.json
    └── wp-content/
        ├── plugins/
        │   └── [your-plugin]/     # Created with setup:plugin
        │       ├── package.json
        │       ├── [plugin-name].php
        │       └── src/
        │           ├── scripts/
        │           │   └── index.js
        │           └── styles.scss
        └── themes/
            └── [your-theme]/      # Created with setup:theme
                ├── package.json
                ├── index.php
                ├── style.css
                └── src/
                    ├── scripts/
                    │   └── index.js
                    └── styles.scss
```

## Comprehensive Test Cases

### 1. Package Development Setup

```bash
# From wp-monorepo-manager directory
npm install
npm link

# Verify the package is properly set up and linked
npm list
which wp-monorepo
```

**Expected:** All dependencies should install without errors, the package should be linkable, and the `wp-monorepo` command should be available globally.

### 2. Configuration Files

Test each configuration file in the test project:

```bash
# ESLint
npx eslint --print-config .eslintrc.js

# StyleLint
npx stylelint --print-config .stylelintrc.js

# Webpack
node -e "console.log(require('./webpack.config.js'))"
```

**Expected:** Each command should output a valid configuration.

### 3. Development Mode

Test development workflow:

```bash
# Start development mode
npm run start
```

**Expected:**

- Development server should start
- File watching should work
- Changes should trigger rebuilds

### 4. Linting and Formatting

Test linting and formatting commands:

```bash
# Lint all projects
npm run lint

# Format all projects
npm run format

# Lint specific theme (replace 'your-theme' with actual theme name)
npm run lint --workspace=wp-content/themes/your-theme

# Format specific plugin (replace 'your-plugin' with actual plugin name)
npm run format --workspace=wp-content/plugins/your-plugin
```

**Expected:**

- Linting should run without errors
- Code should be formatted according to standards
- Known issues should be reported appropriately

## Expected Output

After running all tests, you should have:

### 1. Working Build Process

- Compiled JS files in `dist/scripts/` directories
- Compiled CSS files in `dist/styles/` directories
- No empty files
- Proper file structure maintained

### 2. Working Development Environment

- Hot reloading functionality
- Source maps for debugging
- Clear error reporting
- File watching across all workspaces

### 3. Working Linting and Formatting

- Consistent code style across all files
- No linting errors in JavaScript, CSS, and PHP
- Proper formatting according to project standards

## Common Issues and Troubleshooting

### Build Failures

- **Check webpack configuration** in `config/webpack/webpack.config.js`
- **Verify entry points** in individual `package.json` files
- **Check file paths** and ensure all source files exist
- **Review build logs** for specific error messages

### Linting Errors

- **Verify ESLint configuration** in `config/eslint/`
- **Check StyleLint rules** in `config/stylelint/`
- **Review PHPCS settings** in `config/phpcs/phpcs.xml.dist`
- **Ensure all dependencies** are properly installed

### Development Server Issues

- **Check port availability** (default: 3000)
- **Verify WordPress installation** is accessible
- **Check file permissions** on generated files
- **Review browser console** for JavaScript errors

### CLI Command Issues

- **Verify npm link** is properly set up
- **Check PATH environment** includes npm global binaries
- **Ensure package.json** has correct `bin` configuration
- **Test with `which wp-monorepo`** to confirm command location

## Test Data Templates

For testing themes and plugins, use the provided templates in the `templates/` directory:

- **Theme templates:** `templates/theme/`
- **Plugin templates:** `templates/plugin/`

These templates provide the basic structure needed for testing the build process and development workflow.

## Development vs Published Package Testing

### Development Testing (Current Focus)

This document focuses on **development testing** - testing the package while you're developing it:

- **Local linking**: Uses `npm link` to test the package as if it were installed
- **Direct script execution**: Runs setup scripts directly from the package directory
- **Immediate feedback**: Changes to the package are immediately available for testing
- **Pre-publishing**: Done before the package is published

### Published Package Testing (Post-Publishing)

After publishing, you would test the actual published package:

```bash
# Install the published package
npm install -g wp-monorepo-manager

# Test in a real project
mkdir real-project
cd real-project
wp-monorepo setup
```

**Note:** Published package testing is not covered in this document as it's done after the package is published to npm.

## Final Checklist

Before publishing:

- [ ] All test cases pass
- [ ] Documentation is complete
- [ ] Package.json is properly configured
- [ ] Dependencies are correctly specified
- [ ] No sensitive information in the package
- [ ] License file is included
- [ ] README.md is up to date
- [ ] Version number is correct
- [ ] Changelog is updated
