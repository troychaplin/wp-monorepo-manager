# WordPress Monorepo Manager Issues

## Setup Script Issues

- **Missing Module**: The build process failed due to a missing module `@wordpress/browserslist-config`. This module is required by the build process and needs to be installed in the test environment.
- **Build Failure**: Both the `test-theme` and `test-plugin` builds failed with the error `Cannot find module '@wordpress/browserslist-config'`. This indicates that the module is not available in the test environment.
- **Next Steps**: Ensure that `@wordpress/browserslist-config` is included in the dependencies of the test environment or consider using a different browserslist configuration.
