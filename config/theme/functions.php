<?php
/**
 * Monorepo Theme functions and definitions
 *
 * @package Monorepo Theme
 */

// Prevent direct access
if (!defined('ABSPATH')) {
	exit;
}

// Theme setup
function Monorepo_Theme_setup() {
	// Add theme support for various features
	add_theme_support('post-thumbnails');
	add_theme_support('title-tag');
	add_theme_support('html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	));
}
add_action('after_setup_theme', 'Monorepo_Theme_setup');

// Enqueue scripts and styles
function Monorepo_Theme_scripts() {
	wp_enqueue_style(
		'monorepo-theme-style',
		get_template_directory_uri() . '/build/styles.css',
		array(),
		'1.0.0'
	);

	wp_enqueue_script(
		'monorepo-theme-script',
		get_template_directory_uri() . '/build/scripts.js',
		array(),
		'1.0.0',
		true
	);
}
add_action('wp_enqueue_scripts', 'Monorepo_Theme_scripts');
