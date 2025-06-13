<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Ensure Timber is available
if ( class_exists( 'Timber\Timber' ) ) {
	$context = Timber\Timber::context();
	Timber\Timber::render( 'templates/index.twig', $context );
} else {
	get_header();

	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			echo '<article ' . post_class() . '>';
			the_title( '<h1>', '</h1>' );
			the_content();
			echo '</article>';
		endwhile;
	else :
		echo '<p>No content found.</p>';
	endif;

	get_footer();
}
