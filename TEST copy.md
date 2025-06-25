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

`npm link` is a development tool that creates a symbolic link between your local package and the global npm packages directory. Here's how it works:

#### What npm link does:

1. **Creates a global link**: Makes your local package available globally as if it were installed
2. **Enables CLI testing**: Allows you to run `wp-monorepo` commands from anywhere
3. **Provides immediate feedback**: Changes to your local package are immediately available

#### The linking process:

```bash
# From wp-monorepo-manager directory
npm link
# This creates: /usr/local/lib/node_modules/wp-monorepo-manager -> /path/to/your/local/package
```

#### How it works in testing:

1. **Global availability**: Your local package becomes available as a global command
2. **Test project usage**: Test projects can use the linked package
3. **Real-time updates**: Changes to your package are immediately reflected in test projects

#### When to use npm link:

- **During development**: To test your package as if it were published
- **Before publishing**: To verify the package works correctly
- **Local testing**: To test CLI commands and functionality

#### Cleaning up:

```bash
# Remove the global link when done
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

## Test Cases

### 1. Package Development Setup

```bash
# From wp-monorepo-manager directory
npm install
npm link

# Verify the package is properly set up and linked
npm list
which wp-monorepo
```

Expected: All dependencies should install without errors, the package should be linkable, and the `wp-monorepo` command should be available globally.

**Note**: The `npm link` command makes your local package available globally for testing. See the "Understanding npm link" section above for details.

### 2. CLI Command Testing

Test the CLI functionality from the test directory:

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

Expected: All commands should execute without errors and provide appropriate output.

### 3. Configuration Files

Test each configuration file in the test project:

```bash
# ESLint
npx eslint --print-config .eslintrc.js

# StyleLint
npx stylelint --print-config .stylelintrc.js

# Webpack
node -e "console.log(require('./webpack.config.js'))"
```

Expected: Each command should output a valid configuration.

### 4. Build Process

Test the build process for themes and plugins (after creating them):

```bash
# Build all projects
npm run build

# Build specific theme (replace 'your-theme' with actual theme name)
npm run build --workspace=wp-content/themes/your-theme

# Build specific plugin (replace 'your-plugin' with actual plugin name)
npm run build --workspace=wp-content/plugins/your-plugin
```

Expected:

- `dist` directories should be created
- JS and CSS files should be generated
- No build errors should occur

### 5. Development Mode

Test development workflow:

```bash
# Start development mode
npm run start
```

Expected:

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

Expected:

- Linting should run without errors
- Code should be formatted according to standards
- Known issues should be reported appropriately

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

**Note**: Published package testing is not covered in this document as it's done after the package is published to npm.

## Test Data

### Theme Test Files

1. `wp-content/themes/your-theme/src/scripts/index.js`:

```javascript
console.log('Theme script loaded');
```

2. `wp-content/themes/your-theme/src/styles.scss`:

```scss
body {
	color: #333;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

3. `wp-content/themes/your-theme/index.php`:

```php
<?php
/**
 * Your Theme
 *
 * @package YourTheme
 */

get_header(); ?>

<main id="main" class="site-main">
	<?php
	if (have_posts()) :
		while (have_posts()) :
			the_post();
			get_template_part('template-parts/content', get_post_type());
		endwhile;
	else :
		get_template_part('template-parts/content', 'none');
	endif;
	?>
</main>

<?php
get_sidebar();
get_footer();
```

4. `wp-content/themes/your-theme/style.css`:

```css
/*
Theme Name: Your Theme
Description: A custom WordPress theme
Version: 1.0.0
Author: Your Name
*/

/* This file is required by WordPress but styles are compiled from src/styles.scss */
```

### Plugin Test Files

1. `wp-content/plugins/your-plugin/src/scripts/index.js`:

```javascript
console.log('Plugin script loaded');
```

2. `wp-content/plugins/your-plugin/src/styles.scss`:

```scss
/* Your Plugin Styles */

.plugin-your-plugin {
	/* Plugin styles here */
}
```

3. `wp-content/plugins/your-plugin/your-plugin.php`:

```php
<?php
/**
 * Plugin Name: Your Plugin
 * Description: A custom WordPress plugin
 * Version: 1.0.0
 * Author: Your Name
 *
 * @package YourPlugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Plugin initialization
function your_plugin_init() {
	// Plugin initialization code here
}
add_action('init', 'your_plugin_init');

// Enqueue scripts and styles
function your_plugin_enqueue_scripts() {
	wp_enqueue_script(
		'your-plugin-script',
		plugin_dir_url(__FILE__) . 'dist/scripts/index.js',
		array(),
		'1.0.0',
		true
	);

	wp_enqueue_style(
		'your-plugin-style',
		plugin_dir_url(__FILE__) . 'dist/styles/index.css',
		array(),
		'1.0.0'
	);
}
add_action('wp_enqueue_scripts', 'your_plugin_enqueue_scripts');
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
