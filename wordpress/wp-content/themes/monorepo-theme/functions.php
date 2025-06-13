<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load Composer dependencies
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
} else {
	add_action(
		'admin_notices',
		function () {
			echo '<div class="error"><p>Composer autoload not found. Run <code>composer install</code> in the theme directory.</p></div>';
		}
	);
	return;
}

// Include function files
require_once plugin_dir_path( __FILE__ ) . 'Functions/enqueue-scripts.php';
require_once plugin_dir_path( __FILE__ ) . 'Functions/theme-supports.php';
require_once plugin_dir_path( __FILE__ ) . 'Functions/timber-twig.php';

// Instantiate the classes
new WPHS\Theme\EnqueueScripts();
new WPHS\Theme\ThemeSupports();
new WPHS\Theme\TimberTwig();
