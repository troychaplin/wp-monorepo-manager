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

/**
 * Enqueues scripts and styles for the plugin.
 *
 * This function should be hooked to the appropriate WordPress action
 * to load necessary JavaScript and CSS files for the plugin's functionality.
 *
 * @return void
 */
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

/**
 * Registers custom Gutenberg blocks for the plugin.
 *
 * This function should be hooked into WordPress' initialization actions
 * to ensure that custom blocks are properly registered and available
 * within the block editor.
 *
 * @return void
 */
function {{SANITIZED_NAME}}_register_blocks()
{
    global $wp_filesystem;

    if (empty($wp_filesystem) ) {
        include_once ABSPATH . 'wp-admin/includes/file.php';
        WP_Filesystem();
    }

    $blocks_dirs = array(
        plugin_dir_path(__FILE__) . 'build/blocks/',
    );

    foreach ( $blocks_dirs as $blocks_dir ) {
        $block_folders = glob($blocks_dir . '*', GLOB_ONLYDIR);

        if (function_exists('wp_register_block_metadata_collection') ) {
            wp_register_block_metadata_collection(
                $blocks_dir,
                plugin_dir_path(__FILE__) . 'build/blocks-manifest.php'
            );
        }

        foreach ( $block_folders as $block_path ) {
            $block_json = $block_path . '/block.json';

            if ($wp_filesystem->exists($block_json) ) {
                $block_json_content = $wp_filesystem->get_contents($block_json);

                if (false === $block_json_content ) {
                    continue;
                }

                $metadata = json_decode($block_json_content, true);

                if (json_last_error() !== JSON_ERROR_NONE ) {
                    continue;
                }

                // Special handling for interactive blocks.
                if (isset($metadata['viewScriptModule']) ) {
                    add_filter('should_load_separate_core_block_assets', '__return_true');
                }

                register_block_type($block_path);
            }
        }
    }
}
add_action('init', '{{SANITIZED_NAME}}_register_blocks');
