<?php
/**
 * Plugin Name: {{PLUGIN_NAME}}
 * Description: {{PLUGIN_DESCRIPTION}}
 * Version: 1.0.0
 * Author: Your Name
 *
 * @package {{PLUGIN_NAME}}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin initialization
function {{SANITIZED_NAME}}_init()
{
    // Plugin initialization code here
}
add_action('init', '{{SANITIZED_NAME}}_init');

// Enqueue scripts and styles
function {{SANITIZED_NAME}}_enqueue_scripts()
{
    wp_enqueue_script(
        '{{KEBAB_NAME}}-script',
        plugin_dir_url(__FILE__) . 'build/scripts.js',
        array(),
        '1.0.0',
        true
    );

    wp_enqueue_style(
        '{{KEBAB_NAME}}-style',
        plugin_dir_url(__FILE__) . 'build/scripts.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', '{{SANITIZED_NAME}}_enqueue_scripts');
