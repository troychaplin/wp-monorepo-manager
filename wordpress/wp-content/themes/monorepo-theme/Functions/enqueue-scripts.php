<?php

namespace WPHS\Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class EnqueueScripts {

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_theme_assets' ), 100 );
	}

	/**
	 * Enqueue scripts and styles on the front end
	 */
	public function enqueue_theme_assets() {
		wp_enqueue_style(
			'monorepo-theme-css',
			get_template_directory_uri() . '/build/styles.css',
			array(),
			'1.0.0'
		);

		wp_enqueue_script(
			'monorepo-theme-js',
			get_template_directory_uri() . '/build/scripts.js',
			array(),
			'1.0.0',
			true
		);
	}
}
