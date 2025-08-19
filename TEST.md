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
    git clone https://github.com/troychaplin/wp-dependency-manager.git
    cd wp-dependency-manager

    # Install dependencies
    npm install

    # Create a global link to the package
    npm link
    ```

2. **Test the CLI commands:**

    ```bash
    # Check that the CLI command is available
    wp-dependency --help

    # Verify the package is linked correctly
    npm list -g wp-dependency-manager

    # Test setup commands and new safety features
    wp-dependency setup --help
    wp-dependency setup --dry-run
    wp-dependency setup --safe
    wp-dependency setup:theme --help
    wp-dependency setup:plugin --help
    ```

3. **Cleanup when done testing:**

    ```bash
    # Remove the global link
    npm unlink -g wp-dependency-manager
    ```

### Understanding npm link

`npm link` creates a symbolic link between your local package and the global npm packages directory, making it available globally for testing.

**What it does:**

- Makes your local package available globally as if it were installed
- Enables CLI testing from anywhere
- Provides immediate feedback for changes

**Usage:**

```bash
# From wp-dependency-manager directory
npm link
# Creates: /usr/local/lib/node_modules/wp-dependency-manager -> /path/to/your/local/package

# Cleanup when done
npm unlink -g wp-dependency-manager
```

### Step 2: Test CLI Commands in Different Contexts

The CLI tool supports two different setup scenarios:

#### Scenario A: Initialize in Existing WordPress Installation

1. **Navigate to a WordPress installation:**

    ```bash
    # Go to an existing WordPress installation
    cd /path/to/wordpress-installation
    ```

2. **Test the setup command:**

    ```bash
    # Test preview mode first (safe to run)
    wp-dependency setup --dry-run

    # This should detect WordPress and initialize monorepo structure
    wp-dependency setup

    # Test help command (should work without errors)
    wp-dependency --help

    # Test theme setup
    wp-dependency setup:theme

    # Test plugin setup
    wp-dependency setup:plugin
    ```

**Expected behavior:**

- Detects WordPress installation (wp-config.php, wp-content, etc.)
- Creates `package.json` at WordPress root
- Creates `turbo.json` for monorepo configuration
- Installs dependencies including wp-dependency-manager
- Sets up workspace configuration for themes and plugins

#### Scenario B: Create New Project Structure

1. **Navigate to an empty directory:**

    ```bash
    # Go to an empty directory (not a WordPress installation)
    cd /path/to/empty-directory
    ```

2. **Test the setup command:**

    ```bash
    # Test preview mode first (safe to run)
    wp-dependency setup --dry-run

    # This should create a new project structure
    wp-dependency setup

    # Test help command (should work without errors)
    wp-dependency --help
    ```

**Expected behavior:**

- Creates new directory structure with monorepo configuration
- Sets up complete development environment
- Links the development package for testing

### Step 2.5: Test Setup Safety Features

The setup process now includes multiple safety features to protect existing configurations. Test these scenarios:

#### Test Dry Run Mode

1. **Test in clean directory:**

    ```bash
    cd /tmp && mkdir test-clean && cd test-clean
    wp-dependency setup --dry-run
    ```

    **Expected behavior:**
    - Shows ✨ icons with "(would create)" for all files
    - No files are actually created
    - Exit without making changes
    - Provides clear instructions for actual setup

2. **Test in existing setup:**

    ```bash
    # Go to a directory with existing configuration files
    cd /path/to/existing-wordpress-with-monorepo
    wp-dependency setup --dry-run
    ```

    **Expected behavior:**
    - Shows 📝 icons with "(would overwrite)" for existing files
    - No files are actually modified
    - Clear distinction between new vs existing files

#### Test Safe Mode

1. **Test safe mode in existing setup:**

    ```bash
    # Go to a directory with existing configuration files
    cd /path/to/existing-wordpress-with-monorepo
    wp-dependency setup --safe
    ```

    **Expected behavior:**
    - Shows warning about existing files with modification timestamps
    - Creates backup before proceeding (if user confirms)
    - Skips all existing files with "⏭️ Skipped" messages
    - Still runs npm install and composer install
    - Reports successful completion

2. **Test safe mode in clean directory:**

    ```bash
    cd /tmp && mkdir test-safe && cd test-safe
    wp-dependency setup --safe
    ```

    **Expected behavior:**
    - No existing files detected
    - Creates all configuration files normally
    - No backup needed

#### Test Backup System

1. **Modify an existing configuration file:**

    ```bash
    # Go to existing WordPress installation
    cd /path/to/existing-wordpress-with-monorepo

    # Make a small modification to test backup detection
    echo "// Test modification" >> .eslintrc.json
    ```

2. **Run normal setup to trigger backup:**

    ```bash
    wp-dependency setup
    # When prompted, answer 'y' to proceed with backup
    ```

    **Expected behavior:**
    - Shows updated modification timestamp for changed file
    - Creates backup in `.wp-dependency-backups/[timestamp]/`
    - All existing config files backed up before overwriting
    - Displays backup location confirmation

3. **Verify backup contents:**

    ```bash
    # List backup directories
    ls -la .wp-dependency-backups/

    # Check backup contents (replace timestamp with actual)
    ls -la .wp-dependency-backups/2025-07-06T10-30-00/

    # Verify modification is preserved in backup
    cat .wp-dependency-backups/*/​.eslintrc.json
    ```

#### Test User Cancellation

1. **Test declining setup:**

    ```bash
    # In directory with existing files
    echo "n" | wp-dependency setup
    ```

    **Expected behavior:**
    - Shows existing files warning
    - Accepts 'n' response
    - Exits with helpful message
    - No files modified or backed up

#### Test CLI Flag Integration

1. **Test help system includes new flags:**

    ```bash
    wp-dependency --help
    wp-dependency setup unknown-flag
    ```

    **Expected behavior:**
    - Help shows new `--dry-run` and `--safe` flags
    - Unknown flag shows available options
    - Examples include new flag usage

2. **Test flag combinations:**

    ```bash
    # These should work (flags are independent)
    wp-dependency setup --dry-run
    wp-dependency setup --safe

    # Multiple flags (if both provided, dry-run should take precedence)
    wp-dependency setup --dry-run --safe
    ```

### Recovery Testing

Test the backup recovery process:

```bash
# List available backups
ls -la .wp-dependency-backups/

# Simulate recovery (replace timestamp with actual backup)
cp -r .wp-dependency-backups/2025-07-06T10-30-00/* .

# Verify files are restored
cat .eslintrc.json
```

### Step 3: Test Theme and Plugin Creation

1. **Test theme creation:**

    ```bash
    # From project root (after running wp-dependency setup)
    wp-dependency setup:theme
    ```

**Expected behavior:**

- Prompts for theme name (e.g., "My Awesome Theme")
- Prompts for theme folder name (e.g., "my-awesome-theme")
- Creates theme structure in appropriate directory
- Does NOT install dependencies (monorepo architecture)

2. **Test plugin creation:**

    ```bash
    # From project root (after running wp-dependency setup)
    wp-dependency setup:plugin
    ```

**Expected behavior:**

- Prompts for plugin name (e.g., "My Awesome Plugin")
- Prompts for plugin folder name (e.g., "my-awesome-plugin")
- Creates plugin structure in appropriate directory
- Does NOT install dependencies (monorepo architecture)

### Step 4: Verify Package Functionality

1. **Check package installation:**

    ```bash
    # Verify the package is linked
    npm list wp-dependency-manager
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

### Scenario A: Existing WordPress Installation

Your WordPress directory structure should look like this after setup:

```
wordpress-installation/
│
├── wp-config.php              # Existing WordPress config
├── wp-content/                # Existing WordPress content
├── wp-admin/                  # Existing WordPress admin
├── wp-includes/               # Existing WordPress includes
├── package.json               # Created by wp-dependency setup
├── turbo.json                 # Created by wp-dependency setup
├── node_modules/              # Created by npm install
├── .wp-dependency-backups/      # Created when overwriting existing config files
│   └── 2025-07-06T10-30-00/   # Timestamped backup directories
│       ├── .eslintrc.json     # Backed up configuration files
│       ├── package.json       # (before overwriting)
│       └── ...                # Other backed up files
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

### Scenario B: New Project Structure

Your test directory structure should look like this:

```
parent-directory/
│
├── wp-dependency-manager/     # The package repository (development)
│   ├── package.json
│   ├── config/
│   ├── scripts/
│   └── ...
│
└── your-project/            # Test directory (created by setup)
    ├── package.json
    ├── turbo.json
    ├── .wp-dependency-backups/      # Backup directory (if config files existed)
    │   └── [timestamp]/           # Timestamped backup folders
    ├── wp-content/
    │   ├── plugins/
    │   │   └── [your-plugin]/     # Created with setup:plugin
    │   │       ├── package.json
    │   │       ├── [plugin-name].php
    │   │       └── src/
    │   │           ├── scripts/
    │   │           │   └── index.js
    │   │           └── styles.scss
    │   └── themes/
    │       └── [your-theme]/      # Created with setup:theme
    │           ├── package.json
    │           ├── index.php
    │           ├── style.css
    │           └── src/
    │               ├── scripts/
    │               │   └── index.js
    │               └── styles.scss
    └── plugins/             # Alternative location for non-WordPress projects
        └── [your-plugin]/
```

## Comprehensive Test Cases

### 1. Package Development Setup

```bash
# From wp-dependency-manager directory
npm install
npm link

# Verify the package is properly set up and linked
npm list
which wp-dependency
```

**Expected:** All dependencies should install without errors, the package should be linkable, and the `wp-dependency` command should be available globally.

### 2. Setup Safety Features Testing

Comprehensive testing of the new safety features:

```bash
# Test dry run mode
wp-dependency setup --dry-run
# Should preview changes without modification

# Test safe mode
wp-dependency setup --safe
# Should skip existing files and create backup

# Test normal setup with backup
wp-dependency setup
# Should warn about existing files and create backup

# Test user cancellation
echo "n" | wp-dependency setup
# Should exit gracefully without changes

# Verify backup system
ls -la .wp-dependency-backups/
# Should show timestamped backup directories

# Test backup recovery
cp -r .wp-dependency-backups/[timestamp]/* .
# Should restore backed up files
```

**Expected:**

- Dry run shows preview without making changes
- Safe mode skips existing files but still installs dependencies
- Normal setup creates automatic backups before overwriting
- User can cancel setup safely
- Backups are properly organized and recoverable
- All modes provide clear, helpful output

### 2. CLI Command Testing

Test CLI commands from different contexts:

```bash
# Test help command from anywhere (should work without errors)
wp-dependency --help

# Test setup command with safety features
wp-dependency setup --dry-run          # Preview mode
wp-dependency setup --safe             # Safe mode (skip existing)

# Test setup command from WordPress installation
cd /path/to/wordpress
wp-dependency setup --dry-run          # Preview first
wp-dependency setup                    # Normal setup with backup

# Test setup command from empty directory
cd /path/to/empty-directory
wp-dependency setup --dry-run          # Should show "would create"
wp-dependency setup                    # Should create new files
```

**Expected:**

- Help command should work from any directory without webpack configuration errors
- `--dry-run` should preview changes without modifying files
- `--safe` should skip existing files and still install dependencies
- Setup command should detect context and behave appropriately
- No package.json should be required before running setup
- Backup system should activate when existing files are detected

### 3. Theme and Plugin Creation Testing

```bash
# Test theme creation
wp-dependency setup:theme
# Should prompt for theme name and folder name
# Should create theme structure without installing dependencies

# Test plugin creation
wp-dependency setup:plugin
# Should prompt for plugin name and folder name
# Should create plugin structure without installing dependencies
```

**Expected:**

- Prompts for both display name and folder name
- Creates appropriate directory structure
- Does NOT run npm install in individual theme/plugin directories
- Provides helpful next steps for monorepo workflow

### 4. Configuration Files

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

### 5. Development Mode

Test development workflow:

```bash
# Start development mode
npm run start
```

**Expected:**

- Development server should start
- File watching should work
- Changes should trigger rebuilds

### 6. Linting and Formatting

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
- **Test with `which wp-dependency`** to confirm command location

### Setup Command Issues

- **WordPress detection**: Ensure you're in a WordPress root directory (contains wp-config.php, wp-content, etc.)
- **Package.json conflicts**: If package.json already exists, the setup will use the existing one
- **Permission issues**: Ensure you have write permissions in the target directory
- **Network issues**: Check internet connection for npm install

### Safety Features Issues

- **Backup creation fails**: Check write permissions for `.wp-dependency-backups` directory
- **Dry run shows incorrect status**: Verify file existence and permissions
- **Safe mode still overwrites**: Check if files are being created by dependencies installation
- **Backup recovery issues**: Ensure backup directory exists and contains expected files
- **Interactive prompts hang**: Check if stdin is properly connected (avoid pipe conflicts)

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
npm install -g wp-dependency-manager

# Test in a real project
mkdir real-project
cd real-project
wp-dependency setup
```

**Note:** Published package testing is not covered in this document as it's done after the package is published to npm.

## Safety Features Testing Scenarios

Test the safety features against real-world scenarios:

### Scenario 1: Existing Project with Custom Configurations

1. **Set up test environment:**

    ```bash
    # Create a WordPress site with custom configurations
    cd /path/to/test-wordpress

    # Create custom .eslintrc.json with project-specific rules
    echo '{"extends": ["custom-config"], "rules": {"no-console": "error"}}' > .eslintrc.json

    # Create custom package.json with existing dependencies
    echo '{"name": "my-project", "dependencies": {"lodash": "^4.0.0"}}' > package.json
    ```

2. **Test dry run mode:**

    ```bash
    wp-dependency setup --dry-run
    # Should show these files would be overwritten
    # Should not modify the custom configurations
    ```

3. **Test safe mode:**

    ```bash
    wp-dependency setup --safe
    # Should skip existing files, preserving custom configurations
    # Should still install monorepo dependencies
    ```

4. **Test backup and recovery:**

    ```bash
    wp-dependency setup
    # Should backup custom configurations
    # Verify custom content is preserved in backup
    cat .wp-dependency-backups/*/​.eslintrc.json

    # Test recovery
    cp .wp-dependency-backups/*/​.eslintrc.json .eslintrc.json.custom
    # Verify custom config is recoverable
    ```

### Scenario 2: Team Development Environment

1. **Simulate team member onboarding:**

    ```bash
    # Team member clones existing project
    git clone [project-repo]
    cd [project]

    # Project already has monorepo setup, member wants to update
    wp-dependency setup --dry-run
    # Should show what would change

    wp-dependency setup --safe
    # Should preserve team's existing configurations
    ```

### Scenario 3: CI/CD Environment

1. **Test automated setup:**

    ```bash
    # Simulate CI environment (non-interactive)
    echo "y" | wp-dependency setup
    # Should handle automated confirmation

    # Test with existing files in CI
    echo "n" | wp-dependency setup
    # Should exit gracefully for CI failure handling
    ```

### Scenario 4: Migration from Other Build Systems

1. **Test migration safety:**

    ```bash
    # Create existing build configuration files
    echo '{"scripts": {"build": "webpack"}}' > package.json
    echo 'module.exports = {/*custom webpack config*/}' > webpack.config.js

    # Test migration path
    wp-dependency setup --dry-run
    # Should show what would be replaced

    wp-dependency setup
    # Should backup existing build configuration
    # Should allow recovery of custom webpack config
    ```

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
- [ ] CLI works in both WordPress and non-WordPress contexts
- [ ] Setup command properly detects and handles different environments
- [ ] Theme and plugin creation works with proper prompts
- [ ] Monorepo architecture is properly implemented (no individual dependency installation)
- [ ] **Safety features work correctly:**
    - [ ] `--dry-run` flag previews changes without modification
    - [ ] `--safe` flag skips existing files appropriately
    - [ ] Backup system creates timestamped backups before overwriting
    - [ ] User can cancel setup without modifications
    - [ ] Help documentation includes new flags and examples
    - [ ] CLI properly passes flags to setup scripts
    - [ ] Backup recovery process works correctly
