const path = require('path');

// Export paths to configuration files
const configs = {
	eslint: path.join(__dirname, 'config/eslint/.eslintrc.json'),
	stylelint: path.join(__dirname, 'config/stylelint/.stylelintrc.json'),
	phpcs: path.join(__dirname, 'config/phpcs/phpcs.xml.dist'),
	webpack: path.join(__dirname, 'config/webpack/webpack.config.js'),
};

// Export utility functions
const utils = {
	/**
	 * Get the path to a configuration file
	 * @param {string} type - The type of configuration ('eslint', 'stylelint', 'phpcs', 'webpack')
	 * @return {string} The absolute path to the configuration file
	 */
	getConfigPath: type => {
		if (!configs[type]) {
			throw new Error(`Unknown configuration type: ${type}`);
		}
		return configs[type];
	},

	/**
	 * Get all configuration paths
	 * @return {Object} Object containing paths to all configuration files
	 */
	getAllConfigPaths: () => ({ ...configs }),
};

module.exports = {
	configs,
	utils,
};
