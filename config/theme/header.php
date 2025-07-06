<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); // Hook for plugins and theme scripts. 
    ?>
</head>

<body <?php body_class(); ?>>
    <header class="site-header">
        <p class="site-title"><?php echo bloginfo('blog_name'); ?></p>
    </header>