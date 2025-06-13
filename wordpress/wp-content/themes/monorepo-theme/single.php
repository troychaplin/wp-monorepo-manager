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
			echo '<p>Published on ' . get_the_date() . ' by ' . the_author() . '</p>';
			the_content();
		echo '</article>';
endwhile;
	else :
		echo '<p>No content found.</p>';
	endif;

	get_footer();
