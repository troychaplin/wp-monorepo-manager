<?php
/**
 * Enqueues class for the plugin.
 *
 * @package Monorepo_Plugin
 */

namespace Monorepo\Plugin;

use Monorepo\Plugin\PluginPaths;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Enqueues
 *
 * This class is responsible for enqueueing scripts and styles for the plugin.
 *
 * @package Monorepo_Plugin
 */
class Enqueues {

	/**
	 * Constructor for the class.
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	/**
	 * Enqueues the block assets for the editor
	 */
	public function enqueue_block_assets() {
		$asset_file = include PluginPaths::plugin_path() . 'build/monorepo-plugin-editor.asset.php';

		wp_enqueue_script(
			'monorepo-plugin-editor-js',
			PluginPaths::plugin_url() . 'build/monorepo-plugin-editor.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			false
		);
	}

	/**
	 * Enqueues the block assets for the frontend
	 */
	public function enqueue_frontend_assets() {
		$asset_file = include PluginPaths::plugin_path() . 'build/monorepo-plugin-frontend.asset.php';

		wp_enqueue_script(
			'monorepo-plugin-frontend-js',
			PluginPaths::plugin_url() . 'build/monorepo-plugin-frontend.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}
}
