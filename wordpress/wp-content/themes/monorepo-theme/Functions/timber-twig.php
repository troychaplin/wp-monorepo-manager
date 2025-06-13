<?php

namespace WPHS\Theme;

use Timber\Timber;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class TimberTwig {

	public function __construct() {
		if ( class_exists( '\Timber\Timber' ) ) {
			Timber::init();
			Timber::$dirname = array( 'twig' );
			add_filter( 'timber/cache/mode', array( $this, 'set_cache_mode' ) );
		} else {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="error"><p>Timber is not activated. Ensure it is installed via Composer in the theme.</p></div>';
				}
			);
		}
	}

	/**
	 * Set the caching mode for Timber.
	 *
	 * @return bool
	 */
	public function set_cache_mode() {
		return false;
	}
}
