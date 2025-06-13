<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); // Hook for plugins and theme scripts. 
    ?>
</head>

<body <?php body_class(); ?>>
    <header class="sticky top-0 z-50 w-full p-8 text-black transition-opacity duration-500 opacity-100 bg-slate-300">
        <p>This is the header.php file</p>
    </header>