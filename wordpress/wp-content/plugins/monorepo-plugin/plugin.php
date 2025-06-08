<?php
/**
 * Plugin Name:       Monorepo Starter Plugin
 * Description:       A starter plugin for a monorepo WordPress project
 * Requires at least: 6.6
 * Requires PHP:      8.2
 * Version:           0.1.0
 * Author:            Troy Chaplin
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       monorepo-plugin
 *
 * @package Monorepo_Plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin Version.
if ( ! defined( 'MONOREPO_PLUGIN_VERSION' ) ) {
	define( 'MONOREPO_PLUGIN_VERSION', '0.0.1' );
}

// Define plugin constants.
define( 'MONOREPO_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'MONOREPO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include Composer's autoload file.
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

// Instantiate the classes.
$monorepo_plugin_classes = array(
	\Monorepo\Plugin\PluginPaths::class,
	\Monorepo\Plugin\Enqueues::class,
	\Monorepo\Plugin\RegisterBlocks::class,
);

foreach ( $monorepo_plugin_classes as $monorepo_plugin_class ) {
	new $monorepo_plugin_class();
}
