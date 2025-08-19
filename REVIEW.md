# Heavy-Handed Configuration Issues

This document tracks places where the WordPress Monorepo Manager is "heavy-handed" - meaning it requires specific file names, directory structures, or naming conventions that could break the setup if changed.

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

- **src/scripts.js** - Main JavaScript entry point
- **src/styles.scss** - Main stylesheet
- **src/editor-styles.scss** - Editor styles
- **functions.php** - WordPress theme requirements
- **index.php** - WordPress theme requirements
- **style.css** - WordPress theme requirements

#### Required Plugin Structure:

- **src/scripts/index.js** - Main JavaScript entry point
- **src/styles.scss** - Main stylesheet
- **src/blocks/index.js** - Gutenberg blocks entry
- **plugin.php** - Main plugin file

**Files affected:**

- `config/webpack/webpack-theme.js` lines 10-12: Entry points
- `config/webpack/webpack-plugin.js` line 7: Script entry
- `scripts/setup-theme.js` lines 232-271: File creation
- `scripts/setup-plugin.js` lines 156-215: File creation

### 3. Build Output Directories

**Impact: MEDIUM** - Inconsistent between themes and plugins

#### Theme Output:

- **build/** directory (from webpack-theme.js)
- Referenced in functions.php: `'/build/styles.css'`, `'/build/scripts.js'`

#### Plugin Output:

- **build/** directory (from webpack-plugin.js)
- Turbo configs expect **dist/** in some places

**Files affected:**

- `config/webpack/webpack-theme.js` line 14: `path.resolve(__dirname, 'build')`
- `config/webpack/webpack-plugin.js` line 11: `path.resolve(__dirname, 'build')`
- `scripts/utils.js` lines 90, 94, 98: `outputs: ['dist/**']`
- `scripts/setup-theme.js` lines 214, 222: References to `/build/` in functions.php

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
- `config/package/package-theme.json` lines 15-16: Lint script paths
- `config/package/package-plugin.json` lines 18-19: Lint script paths

### 5. NPM Script Dependencies

**Impact: MEDIUM** - Lint scripts assume specific config paths

Theme/plugin package.json files reference config files three levels up:

- `--config ../../../.eslintrc.json`
- `--config ../../../.stylelintrc.json`

**Files affected:**

- `config/package/package-theme.json` lines 15-16
- `config/package/package-plugin.json` lines 18-19

### 6. Webpack Configuration Paths

**Impact: MEDIUM** - Entry points are hardcoded

#### Theme Webpack:

```javascript
entry: {
    scripts: [path.resolve(__dirname, 'src/scripts.js')],
    styles: [path.resolve(__dirname, 'src/styles.scss')],
    'editor-styles': [path.resolve(__dirname, 'src/editor-styles.scss')],
}
```

#### Plugin Webpack:

```javascript
entry: {
    scripts: path.resolve(__dirname, 'src/scripts/index.js'),
}
```

**Files affected:**

- `config/webpack/webpack-theme.js` lines 10-12
- `config/webpack/webpack-plugin.js` line 7

### 7. Turbo Configuration Assumptions

**Impact: MEDIUM** - Cache and build orchestration depends on specific files

Theme turbo.json inputs:

- `["src/**", "webpack.config.js", "package.json", "functions.php"]`

Plugin turbo.json would need similar file dependencies.

**Files affected:**

- `config/turbo/turbo-theme.json` line 5

### 8. PHP Function Naming Conventions

**Impact: MEDIUM** - Generated function names could conflict

Theme setup creates PHP functions using sanitized theme name:

- `${sanitizedName}_setup()`
- `${sanitizedName}_scripts()`

Sanitization only replaces non-alphanumeric with underscores, could create conflicts.

**Files affected:**

- `scripts/setup-theme.js` lines 71, 197, 209

## README Accuracy Issues

### 1. Outdated Command References

**Issue:** README shows individual lint scripts that are no longer created:

```json
"lint-plugin-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/plugins/test-plugin",
"lint-theme-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/test-theme",
```

**Reality:** Setup now only creates generic scripts:

```json
"lint-php": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes ./wp-content/plugins",
"format-php": "./vendor/bin/phpcbf --standard=phpcs.xml.dist -v --report-summary --report-source ./wp-content/themes ./wp-content/plugins || true"
```

### 2. Missing Command Documentation

**Issue:** README lists commands not yet implemented:

- `wp-dependency build` - "planned for future releases"
- `wp-dependency start` - "not implemented yet"
- `wp-dependency lint` - "not implemented yet"
- `wp-dependency format` - "not implemented yet"
- `wp-dependency clean` - "not implemented yet"

### 3. Inconsistent Build Directory References

**Issue:** README mentions both `build/` and `dist/` directories:

- Project structure shows `dist/` in examples
- Actual webpack configs output to `build/`
- Theme functions.php references `/build/` paths

### 4. Missing Force Build Documentation

**Issue:** CLI shows `build:force` command but README doesn't document it properly.

## Recommendations

### High Priority Fixes:

1. **Standardize output directories** - Choose either `build/` or `dist/` consistently
2. **Make directory structure configurable** - Allow customization of source/output paths
3. **Abstract WordPress paths** - Don't assume `wp-content/themes` location
4. **Update README examples** - Remove outdated individual lint scripts

### Medium Priority Improvements:

1. **Flexible configuration paths** - Allow different config file locations
2. **Customizable entry points** - Make webpack entries configurable
3. **Better function naming** - Prevent PHP function name conflicts
4. **Template-based file generation** - Use templates instead of hardcoded content

### Low Priority Enhancements:

1. **Validate directory structure** - Check for required paths before setup
2. **Configuration detection** - Auto-detect existing webpack/turbo configs
3. **Backup existing configs** - Don't overwrite without warning
