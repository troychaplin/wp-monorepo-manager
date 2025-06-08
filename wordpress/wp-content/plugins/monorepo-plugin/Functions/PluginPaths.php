<?php
/**
 * Plugin Paths
 *
 * @package Monorepo_Plugin
 */

namespace Monorepo\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Plugin_Paths
 *
 * This class provides methods to handle and retrieve various paths related to the plugin.
 *
 * @package Monorepo_Plugin
 */
class PluginPaths {

	/**
	 * Get the URL to the plugin directory.
	 *
	 * @return string The URL to the plugin directory.
	 */
	public static function plugin_url() {
		// Ensure the constant is defined before using it.
		if ( ! defined( 'MONOREPO_PLUGIN_URL' ) ) {
			return '';
		}
		return MONOREPO_PLUGIN_URL;
	}

	/**
	 * Get the path to the plugin directory.
	 *
	 * @return string The path to the plugin directory.
	 */
	public static function plugin_path() {
		// Ensure the constant is defined before using it.
		if ( ! defined( 'MONOREPO_PLUGIN_PATH' ) ) {
			return '';
		}
		return MONOREPO_PLUGIN_PATH;
	}
}
