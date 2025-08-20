# Contributing to WordPress Dependency Manager

Thank you for your interest in contributing to WordPress Dependency Manager! This guide will help you understand our development process and how to contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Conventions](#development-conventions)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Git
- A WordPress installation for testing

### Understanding the Project

Before contributing, please read:

- [README.md](./README.md) - Project overview and quick start
- [DOCS.md](./DOCS.md) - Detailed documentation
- [REVIEW.md](./REVIEW.md) - Known limitations and improvement areas
- [TEST.md](./TEST.md) - Testing procedures

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/wp-dependency-manager.git
cd wp-dependency-manager
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install
```

### 3. Link for Testing

```bash
# Link the package globally for testing
npm link

# Verify the CLI works
wp-dependency --help
```

### 4. Set Up Test Environment

```bash
# Navigate to a WordPress installation for testing
cd /path/to/test-wordpress-site

# Test the setup process
wp-dependency setup --dry-run
```

## Project Structure

```
wp-dependency-manager/
├── bin/
│   └── wp-dependency.js          # CLI entry point
├── config/                      # Configuration templates
│   ├── composer/               # Composer configurations
│   ├── editorconfig/           # Editor configuration
│   ├── eslint/                 # ESLint configuration
│   ├── package/                # Package.json templates
│   ├── phpcs/                  # PHP CodeSniffer configuration
│   ├── prettier/               # Prettier configuration
│   ├── stylelint/              # StyleLint configuration
│   ├── turbo/                  # Turborepo configurations
│   └── webpack/                # Webpack configurations
├── scripts/                    # Setup and utility scripts
│   ├── setup-monorepo.js       # Main monorepo setup
│   ├── setup-plugin.js         # Plugin creation script
│   ├── setup-theme.js          # Theme creation script
│   └── utils.js                # Shared utilities
├── templates/                  # Template files for themes/plugins
└── docs/                       # Documentation files
```

## Development Conventions

### 1. Configuration Management

**✅ DO:**
- Copy configuration templates from the `config/` directory
- Keep all shared dependencies at the root level
- Use template placeholders like `{{PROJECT_NAME}}` for dynamic content

**❌ DON'T:**
- Generate configuration content inline
- Duplicate dependencies in theme/plugin package.json files
- Hardcode project-specific values in templates

```javascript
// ✅ Good: Copy template file
fs.copyFileSync(
    path.join(__dirname, '../config/eslint/.eslintrc.json'),
    path.join(targetDir, '.eslintrc.json')
);

// ❌ Avoid: Inline configuration generation
const eslintConfig = {
    extends: ['@wordpress/eslint-plugin/recommended'],
    // ... more config
};
fs.writeFileSync(targetPath, JSON.stringify(eslintConfig));
```

### 2. Script Organization

**✅ DO:**
- Add lint/format scripts to root composer.json
- Use descriptive script names
- Suppress verbose WordPress block creation output

**❌ DON'T:**
- Add lint scripts to individual theme/plugin composer files
- Use generic script names that could conflict

```json
// ✅ Good: Root composer.json
{
    "scripts": {
        "lint-theme-php-mytheme": "./vendor/bin/phpcs --standard=phpcs.xml.dist ./wp-content/themes/mytheme",
        "format-theme-php-mytheme": "./vendor/bin/phpcbf --standard=phpcs.xml.dist ./wp-content/themes/mytheme"
    }
}
```

### 3. User Experience

**✅ DO:**
- Provide clear, high-level summary output
- Include safety features (backups, dry-run, confirmation)
- Use consistent error handling and user prompts

**❌ DON'T:**
- Show verbose WordPress block creation messages
- Overwrite files without warning or backup
- Use unclear or technical error messages

```javascript
// ✅ Good: Clear summary output
console.log('✅ Theme setup completed successfully!');
console.log('📁 Created files: package.json, index.php, style.css');

// ❌ Avoid: Verbose technical output
console.log('Creating WordPress theme block...');
console.log('Generating theme header with metadata...');
console.log('Configuring webpack entry points...');
```

### 4. Implementation Approach

**✅ DO:**
- Implement features incrementally
- Test between each step
- Maintain backward compatibility
- Document any breaking changes

**❌ DON'T:**
- Make large, monolithic changes
- Skip testing intermediate steps
- Break existing functionality without notice

## Making Changes

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 2. Development Workflow

```bash
# Make your changes
# Test frequently
wp-dependency setup --dry-run

# Test with actual WordPress installation
cd /path/to/test-wordpress
wp-dependency setup:theme
npm run build
```

### 3. Code Style

We follow these standards:

- **JavaScript**: ESLint with WordPress coding standards
- **Configuration files**: Consistent formatting and structure
- **Documentation**: Clear, concise markdown

### 4. Commit Messages

Use conventional commit format:

```bash
feat: add development server command
fix: resolve cache issues with new themes
docs: update installation instructions
refactor: simplify configuration template system
```

## Testing

### Manual Testing

1. **Test setup process:**
   ```bash
   # Test in clean WordPress installation
   wp-dependency setup --dry-run
   wp-dependency setup
   ```

2. **Test theme creation:**
   ```bash
   wp-dependency setup:theme
   cd wp-content/themes/new-theme
   npm run build
   ```

3. **Test plugin creation:**
   ```bash
   wp-dependency setup:plugin
   cd wp-content/plugins/new-plugin
   npm run build
   ```

4. **Test safety features:**
   ```bash
   # Test backup functionality
   wp-dependency setup
   # Verify .wp-dependency-backups/ directory
   
   # Test dry-run
   wp-dependency setup:theme --dry-run
   
   # Test safe mode
   wp-dependency setup:plugin --safe
   ```

### Testing Checklist

Before submitting a PR, verify:

- [ ] Setup works in clean WordPress installation
- [ ] Theme creation generates all required files
- [ ] Plugin creation generates all required files
- [ ] Build process works for both themes and plugins
- [ ] Safety features (backup, dry-run) work correctly
- [ ] Configuration files are properly copied from templates
- [ ] Dependencies are managed at root level
- [ ] CLI commands show appropriate output
- [ ] No breaking changes to existing functionality

### Test Documentation

Follow the procedures in [TEST.md](./TEST.md) for comprehensive testing.

## Submitting Changes

### 1. Before Submitting

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated (if applicable)
- [ ] Code follows project conventions
- [ ] No console.log statements left in code

### 2. Create Pull Request

1. Push your branch to GitHub
2. Create a pull request with:
   - Clear title and description
   - Reference any related issues
   - Include testing instructions
   - Add screenshots if UI changes

### 3. Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested setup process
- [ ] Tested theme creation
- [ ] Tested plugin creation
- [ ] Tested build process
- [ ] Tested safety features

## Checklist
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Tests pass
```

## Code Review Process

### What We Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Follows project conventions?
3. **Testing**: Adequately tested?
4. **Documentation**: Clear and complete?
5. **Backward Compatibility**: No breaking changes?

### Review Timeline

- Initial review within 2-3 days
- Follow-up reviews within 1-2 days
- Merge after approval and passing checks

## Release Process

### Version Strategy

We follow semantic versioning (semver):

- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Release Checklist

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag the release
5. Publish to npm

## Getting Help

### Questions and Discussions

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Code Review**: Comments on pull requests

### Issue Guidelines

When opening an issue:

1. **Search existing issues** first
2. **Use issue templates** when available
3. **Provide clear reproduction steps**
4. **Include system information** (Node.js version, OS, etc.)
5. **Add relevant labels**

### Feature Requests

Before requesting a feature:

1. Check if it aligns with project goals
2. Consider if it should be configurable
3. Think about backward compatibility
4. Provide use cases and examples

## Areas for Contribution

### High Priority

- [ ] Development server implementation
- [ ] Lint command implementation
- [ ] Format command implementation
- [ ] Clean command implementation
- [ ] Improved error handling

### Medium Priority

- [ ] Custom template support
- [ ] Configuration validation
- [ ] Better WordPress detection
- [ ] Enhanced backup system

### Low Priority

- [ ] Plugin dependency management
- [ ] Theme inheritance support
- [ ] Custom build pipelines
- [ ] GUI interface

### Documentation

- [ ] API documentation
- [ ] Video tutorials
- [ ] Migration guides
- [ ] Best practices guide

## Thank You

Thank you for contributing to WordPress Dependency Manager! Your contributions help make WordPress development better for everyone.

For questions about contributing, please open a GitHub Discussion or reach out through GitHub Issues.