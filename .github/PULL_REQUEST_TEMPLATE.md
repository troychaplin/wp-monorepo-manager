# Pull Request

## Description
<!-- Briefly describe what this PR does -->

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 🔧 Refactoring (code change that neither fixes a bug nor adds a feature)
- [ ] 📚 Documentation update
- [ ] ⚙️ Configuration updates
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Related Issues
<!-- Link any related issues -->
Fixes #(issue number)
Related to #(issue number)

## Changes Made
<!-- List the main changes made -->
- 
- 
- 

## Testing

### Environment Tested
- [ ] Node.js version: 
- [ ] WordPress version: 
- [ ] Operating System: 

### Core Functionality
- [ ] `wp-dependency setup` works correctly
- [ ] `wp-dependency setup:theme` creates proper theme structure
- [ ] `wp-dependency setup:plugin` creates proper plugin structure
- [ ] `npm run build` works for themes and plugins
- [ ] `npm run build:force` bypasses cache correctly

### Safety Features
- [ ] `--dry-run` flag works and shows preview
- [ ] `--safe` flag respects existing files
- [ ] Automatic backups are created when files exist
- [ ] File conflict detection works properly

### WordPress Integration
- [ ] Generated themes load properly in WordPress
- [ ] Generated plugins activate properly in WordPress
- [ ] Asset enqueuing works (CSS/JS files load in browser)
- [ ] No PHP errors in WordPress debug log

### Configuration Management
- [ ] Configuration files copied from templates correctly
- [ ] Root-level dependencies managed properly
- [ ] Webpack configurations work for both themes and plugins

## Manual Testing Steps
<!-- Describe the specific steps you took to test this change -->
1. 
2. 
3. 

## Screenshots/Output
<!-- Add screenshots of CLI output, generated files, or WordPress integration if relevant -->

## Impact Assessment

### Configuration Changes
- [ ] No configuration changes
- [ ] New configuration templates added
- [ ] Existing configuration templates modified

### Backward Compatibility
- [ ] No breaking changes
- [ ] Breaking changes documented with migration path

### Documentation
- [ ] README.md updated (if needed)
- [ ] DOCS.md updated (if needed)
- [ ] REVIEW.md updated (if needed)

## Code Quality Checklist
- [ ] Code follows project conventions (see CONTRIBUTING.md)
- [ ] Uses templates instead of hardcoded configuration
- [ ] Error handling is consistent and user-friendly
- [ ] No console.log statements left in code
- [ ] Dependencies managed appropriately (no unnecessary additions)

## Additional Notes
<!-- Any additional information that reviewers should know -->

---
*For comprehensive testing procedures, see [TEST.md](../TEST.md)*