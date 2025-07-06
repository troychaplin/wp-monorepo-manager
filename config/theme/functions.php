<?php
/**
 * {{THEME_NAME}} functions and definitions
 *
 * @package {{THEME_NAME}}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme setup
function {{SANITIZED_NAME}}_setup()
{
    // Add theme support for various features
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support(
        'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        )
    );
}
add_action('after_setup_theme', '{{SANITIZED_NAME}}_setup');

// Enqueue scripts and styles
function {{SANITIZED_NAME}}_scripts()
{
    wp_enqueue_style(
        '{{KEBAB_NAME}}-style',
        get_template_directory_uri() . '/build/styles.css',
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        '{{KEBAB_NAME}}-script',
        get_template_directory_uri() . '/build/scripts.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', '{{SANITIZED_NAME}}_scripts');
