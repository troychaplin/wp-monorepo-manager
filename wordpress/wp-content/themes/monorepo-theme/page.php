<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		echo '<article>';
			echo '<h1>' . esc_html( the_title() ) . '</h1>';
			the_content();
		echo '</article>';
	endwhile;
	else :
		echo '<p>No content found.</p>';
	endif;

	get_footer();
