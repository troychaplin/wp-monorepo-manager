<?php

namespace WPHS\Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class ThemeSupports {

	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'set_theme_supports' ) );
	}

	public function set_theme_supports() {
		// Add support for editor styles
		add_theme_support( 'editor-styles' );
		add_editor_style( 'build/editor-styles.css' );

		// Add theme support for post thumbnails
		add_theme_support( 'post-thumbnails' );

		// Add custom image sizes
		// add_image_size('example', '600', '400', true);

		// Disable core block patterns
		remove_theme_support( 'core-block-patterns' );

		// Let WordPress manage the document title
		add_theme_support( 'title-tag' );

		// Switch default core markup to output valid HTML5
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);
	}
}
