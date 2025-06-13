<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$context = Timber\Timber::context();
Timber\Timber::render( 'templates/index.twig', $context );
