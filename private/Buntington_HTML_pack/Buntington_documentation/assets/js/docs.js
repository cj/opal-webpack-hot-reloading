jQuery( function( $ ) {

	var CHEF = window.CHEF || {};
	
	// tooltips
	CHEF.toolTips = function() {
		$( '.container' ).tooltip( {
			selector: "*[data-toggle=tooltip]"
		} );
		
		$('*[data-toggle=tooltip]')
			.mouseover( function() {
				$( 'i', this ).stop().animate( { opacity: 1 }, 100 ); 
			} )
			.mouseout( function() {
				$( 'i', this ).stop().animate( { opacity: 0.5 }, 100 );
			} );
	}
	
	// popovers
	CHEF.popOvers = function( e ) {
		$( '.k-pop-over' ).popover();
		$( '.k-pop-over' ).on( 'click', function( e ) {
			e.preventDefault();
		} );
	}
	
	// scroll to...
	CHEF.pageScrollTo = function() {
		$( "#page-scroll-to li a[href^='#']" ).on( 'click', function( e ) {
		   e.preventDefault();
		   $( 'html, body' ).animate( { scrollTop: $( this.hash ).offset().top }, 300 );
		} );
	}
	
	// responsive videos
	CHEF.responsiveVideos = function() {
		if( $( '.video-container' ).length ) {
			$( '.video-container' ).fitVids( {
				customSelector: "iframe[src^='http://blip.tv']" 
			} );
		}
	}
	
	// modal window upon close
	CHEF.modalClose = function() {
		$( '.modal' ).on( 'hide.bs.modal', function() {
			if( jQuery( '.k-pop-over', this ).length ) $( '.k-pop-over' ).popover( 'hide' ); // any popovers left unclosed in modal?
		} );
	}
	
	/* fancy title */
	CHEF.fancyTitler = function() {
		if( $( '.k-fancy-title' ).length ) {
			$( '.k-fancy-title' ).wrap( '<div class="k-fancy-title-wrap" />' );
			$( '.k-fancy-title-wrap' ).prepend( '<span class="k-fancy-title-tit"></span>' );
		}
		if( $( '#k-sidebar .widget-title' ).length ) {
			$( '#k-sidebar .widget-title' ).append( '<span class="k-widget-title-tit"></span>' );
		}
	}
	
	$( document ).ready( function() {
		CHEF.toolTips();
		CHEF.popOvers();
		CHEF.responsiveVideos();
		CHEF.fancyTitler();
		CHEF.modalClose();
		CHEF.pageScrollTo();
		
		$( '.navbar' ).scrollspy();
		window.prettyPrint && prettyPrint();
	} );
	
	$( window ).load( function() {
		$( '.k-equal-height' ).eqHeights();
	} );
	
} );