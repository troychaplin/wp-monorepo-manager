# WordPress Monorepo Manager Testing

This document outlines the testing process for the WordPress Monorepo Manager package before publishing.

## Prerequisites

- Node.js >= 20
- npm >= 10.0.0
- WordPress development environment
- Git

## Testing Environment Setup

1. Create a test directory at the same level as the wp-monorepo-manager repository:

    ```bash
    # Assuming you're in the parent directory of wp-monorepo-manager
    mkdir wp-monorepo-test
    cd wp-monorepo-test
    ```

2. Initialize a new npm project:

    ```bash
    npm init -y
    ```

3. Install the package locally:

    ```bash
    npm install ../wp-monorepo-manager
    ```

4. Install required peer dependencies:
    ```bash
    npm install --save-dev turbo
    ```

## Test Project Directory Structure

Your directory structure should look like this:

```
parent-directory/
│
├── wp-monorepo-manager/     # The package repository
│   ├── package.json
│   ├── config/
│   └── ...
│
└── wp-monorepo-test/        # Your test directory
    ├── package.json
    ├── turbo.json
    └── wp-content/
        ├── plugins/
        │   └── test-plugin/
        │       ├── package.json
        │       └── src/
        │           ├── scripts/
        │           │   └── index.js
        │           ├── styles.scss
        │           └── editor-styles.scss
        └── themes/
            └── test-theme/
                ├── package.json
                └── src/
                    ├── scripts/
                    │   └── index.js
                    ├── styles.scss
                    └── editor-styles.scss
```

## Test Cases

### 1. Package Installation

```bash
# Verify package installation
npm list wp-monorepo-manager
```

Expected: Package should be listed in dependencies.

### 2. Configuration Files

Test each configuration file:

```bash
# ESLint
npx eslint --print-config .eslintrc.js

# StyleLint
npx stylelint --print-config .stylelintrc.js

# Webpack
node -e "console.log(require('./webpack.config.js'))"
```

Expected: Each command should output a valid configuration.

### 3. Build Process

Test the build process for both theme and plugin:

```bash
# Build all projects
npm run build

# Build specific theme
npm run build --workspace=wp-content/themes/test-theme

# Build specific plugin
npm run build --workspace=wp-content/plugins/test-plugin
```

Expected:

- `dist` directories should be created
- JS and CSS files should be generated
- No build errors should occur

### 4. Development Mode

Test development workflow:

```bash
# Start development mode
npm run start
```

Expected:

- Development server should start
- File watching should work
- Changes should trigger rebuilds

### 5. Linting

Test linting commands:

```bash
# Lint all projects
npm run lint

# Lint specific theme
npm run lint --workspace=wp-content/themes/test-theme

# Lint specific plugin
npm run lint --workspace=wp-content/plugins/test-plugin
```

Expected:

- Linting should run without errors
- Known issues should be reported

### 6. Formatting

Test formatting commands:

```bash
# Format all projects
npm run format

# Format specific theme
npm run format --workspace=wp-content/themes/test-theme

# Format specific plugin
npm run format --workspace=wp-content/plugins/test-plugin
```

Expected:

- Code should be formatted according to standards
- No formatting errors should occur

## Test Data

### Theme Test Files

1. `wp-content/themes/test-theme/src/scripts/index.js`:

```javascript
console.log('Theme script loaded');
```

2. `wp-content/themes/test-theme/src/styles.scss`:

```scss
body {
	background: #fff;
}
```

3. `wp-content/themes/test-theme/src/editor-styles.scss`:

```scss
.editor-styles-wrapper {
	background: #fff;
}
```

### Plugin Test Files

1. `wp-content/plugins/test-plugin/src/scripts/index.js`:

```javascript
console.log('Plugin script loaded');
```

2. `wp-content/plugins/test-plugin/src/styles.scss`:

```scss
.plugin-container {
	padding: 20px;
}
```

3. `wp-content/plugins/test-plugin/src/editor-styles.scss`:

```scss
.block-editor-block-list__block {
	margin: 20px 0;
}
```

## Expected Output

After running all tests, you should have:

1. Working build process:

    - Compiled JS files
    - Compiled CSS files
    - No empty files
    - Proper file structure

2. Working development environment:

    - Hot reloading
    - Source maps
    - Error reporting

3. Working linting and formatting:
    - Consistent code style
    - No linting errors
    - Proper formatting

## Common Issues

1. **Build Failures**

    - Check webpack configuration
    - Verify entry points
    - Check file paths

2. **Linting Errors**

    - Verify ESLint configuration
    - Check StyleLint rules
    - Review PHPCS settings

3. **Development Server Issues**
    - Check port availability
    - Verify WordPress installation
    - Check file permissions

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
