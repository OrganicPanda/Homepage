// Provide auto window resizing support for the carousel
function PandaCarouselResizePlugin(carousel) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;
	
	// Set up some listeners
	this.resizeFunction = this.carousel.updateDimensions.bind(this.carousel);
	window.addEventListener('resize', this.resizeFunction);
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	
}

// Tidy up
PandaCarouselResizePlugin.prototype.destroy = function() {

	// Remove any listeners we were using
	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	window.removeEventListener('resize', this.resizeFunction);
	
	// Remove our reference to the PandaCarousel instance
	this.carousel = null;
	
};