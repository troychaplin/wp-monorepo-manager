# Heavy-Handed Configuration Issues

This document tracks places where the WordPress Dependency Manager is "heavy-handed" - meaning it requires specific file names, directory structures, or naming conventions that could break the setup if changed.

These items will be reviewed over time to provide additional flexibility.

## Critical Hard-Coded Paths and Names

### 1. WordPress Directory Structure Requirements

**Impact: HIGH** - Setup will fail if WordPress doesn't follow standard structure

- **wp-content/themes/** - Hardcoded in multiple places
- **wp-content/plugins/** - Hardcoded in multiple places
- **wp-config.php**, **wp-includes**, **wp-admin** - Required for WordPress detection
- **phpcs.xml.dist** - Fixed filename for PHP CodeSniffer configuration

**Files affected:**

- `scripts/setup-theme.js` line 62: `path.join(TARGET_DIR, 'wp-content/themes')`
- `scripts/setup-plugin.js` line 82: `path.join(TARGET_DIR, 'wp-content/plugins')`
- `scripts/utils.js` line 47: WordPress detection logic
- `config/composer/composer.json` lines 12-13: Lint paths

### 2. Source Directory Structure

**Impact: HIGH** - Build will fail if source files aren't in expected locations

#### Required Theme Structure:

- **src/scripts/index.js** - Main JavaScript entry point (updated path)
- **src/styles.scss** - Main stylesheet
- **src/editor-styles.scss** - Editor styles
- **functions.php** - WordPress theme requirements
- **index.php** - WordPress theme requirements
- **style.css** - WordPress theme requirements

#### Required Plugin Structure:

- **src/scripts/index.js** - Main JavaScript entry point
- **src/styles.scss** - Main stylesheet
- **src/editor-styles.scss** - Editor-specific styles
- **plugin.php** - Main plugin file

**Files affected:**

- `config/webpack/webpack.config.js` (base configuration)
- `scripts/setup-theme.js` lines 232-271: File creation
- `scripts/setup-plugin.js` lines 156-215: File creation

### 3. Build Output Directories

**Impact: MEDIUM** - Consistent across themes and plugins but differs from documentation

#### Current Output Structure:

- **dist/** directory (from webpack config)
- Theme functions.php references: `'/dist/scripts.js'`, `'/dist/styles.css'`
- Plugin enqueuing references: `'/dist/scripts.js'`, `'/dist/styles.css'`

**Files affected:**

- `config/webpack/webpack.config.js`: Output configuration
- `scripts/setup-theme.js`: Asset enqueuing paths in functions.php
- `scripts/setup-plugin.js`: Asset enqueuing paths in plugin.php

### 4. Configuration File Names

**Impact: MEDIUM** - Setup expects specific filenames

Required at project root:

- **.eslintrc.json**
- **.stylelintrc.json**
- **.prettierrc**
- **.prettierignore**
- **.stylelintignore**
- **phpcs.xml.dist**
- **turbo.json**
- **package.json**
- **composer.json**

**Files affected:**

- `scripts/setup-monorepo.js` lines 11-20: CONFIG_FILES object
- `config/package/package-theme.json`: Build and lint script paths
- `config/package/package-plugin.json`: Build and lint script paths

### 5. CLI Command Structure

**Impact: MEDIUM** - Commands use wp-monorepo, not wp-dependency

Current command structure:

- `wp-monorepo setup` - Create monorepo structure
- `wp-monorepo setup:theme` - Create a new theme
- `wp-monorepo setup:plugin` - Create a new plugin
- `wp-monorepo build` - Build for production
- `wp-monorepo build:force` - Force rebuild (bypasses turbo cache)

**Files affected:**

- `bin/wp-monorepo.js` - Main CLI entry point
- `package.json` - bin configuration

### 6. Webpack Configuration Paths

**Impact: MEDIUM** - Entry points are configured in base config

#### Current Webpack Structure:

```javascript
entry: {
    main: path.resolve(cwd, 'src/scripts/index.js'),
    styles: path.resolve(cwd, 'src/styles.scss'),
    'editor-styles': path.resolve(cwd, 'src/editor-styles.scss'),
}
```

**Files affected:**

- `config/webpack/webpack.config.js` - Base configuration
- `bin/wp-monorepo.js` - Build command implementation

### 7. Turbo Configuration Assumptions

**Impact: MEDIUM** - Cache and build orchestration depends on specific files

Theme/Plugin turbo.json inputs:

- `["src/**", "package.json"]` - Standard input patterns
- Output patterns: `["dist/**"]`

**Files affected:**

- `config/turbo/turbo-theme.json`
- `config/turbo/turbo-plugin.json`
- `scripts/utils.js` - Turbo configuration generation

### 8. PHP Function Naming Conventions

**Impact: MEDIUM** - Generated function names could conflict

Theme setup creates PHP functions using sanitized theme name:

- `${sanitizedName}_setup()`
- `${sanitizedName}_scripts()`

Sanitization only replaces non-alphanumeric with underscores, could create conflicts.

**Files affected:**

- `scripts/setup-theme.js` lines 71, 197, 209

## README Accuracy Issues

### 1. Implemented vs Documented Commands

**Status: ACCURATE** - Current README correctly shows implemented commands:

```bash
wp-monorepo setup              # Create monorepo structure
wp-monorepo setup:theme        # Create a new theme
wp-monorepo setup:plugin       # Create a new plugin
wp-monorepo build              # Build for production
wp-monorepo build:force        # Force rebuild (bypasses turbo cache)
```

Future commands are properly marked as "planned for future release":
- `wp-monorepo start` - Development server
- `wp-monorepo lint` - Linting
- `wp-monorepo format` - Code formatting
- `wp-monorepo clean` - Clean build artifacts

### 2. Build Directory References

**Status: NEEDS UPDATE** - README shows inconsistent directory references:

**Issue:** Some examples show `build/` while actual configuration uses `dist/`

**Current Reality:**
- Webpack outputs to `dist/` directory
- Theme/plugin functions reference `/dist/` paths
- Turbo configuration expects `dist/**` outputs

### 3. Composer Script Structure

**Status: ACCURATE** - Setup creates generic lint scripts:

```json
"lint-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes ./wp-content/plugins",
"format-php": "./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes ./wp-content/plugins || true"
```

### 4. Force Build Documentation

**Status: PARTIALLY DOCUMENTED** - `build:force` command exists and is documented in Known Issues section but could be more prominent.

## Recommendations

### High Priority Fixes:

1. **Update documentation consistency** - Ensure all README examples use `dist/` directory
2. **Validate CLI command naming** - Ensure all references use `wp-monorepo` not `wp-dependency`
3. **Standardize entry point paths** - Confirm `src/scripts/index.js` is used consistently
4. **Document safety features** - The setup now includes `--dry-run` and `--safe` flags that provide better user control

### Medium Priority Improvements:

1. **Make directory structure configurable** - Allow customization of source/output paths
2. **Abstract WordPress paths** - Don't assume `wp-content/themes` location
3. **Better function naming** - Prevent PHP function name conflicts
4. **Template-based file generation** - Use templates instead of hardcoded content

### Low Priority Enhancements:

1. **Validate directory structure** - Check for required paths before setup
2. **Configuration detection** - Auto-detect existing webpack/turbo configs
3. **Enhanced backup system** - The current backup system is well-implemented but could be expanded

## Safety Features Assessment

**Status: WELL IMPLEMENTED** - The project now includes comprehensive safety features:

- **Backup system** - Automatic timestamped backups in `.wp-monorepo-backups/`
- **Dry run mode** - `--dry-run` flag for previewing changes
- **Safe mode** - `--safe` flag for skipping existing files
- **User confirmation** - Interactive prompts for potentially destructive operations
- **Clear documentation** - Help system includes safety flag documentation

These features address the original concern about "overwriting without warning" from the low priority recommendations.
