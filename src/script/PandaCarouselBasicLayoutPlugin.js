function PandaCarouselBasicLayoutPlugin(carousel) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;
	
	// Set up some listeners
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.postGotoPageEventId = this.carousel.addEventListener("postgotopage", this.showPage.bind(this));
	
	// Init our pages
	this.pageElements = [];
	this.pageElementsInitialDisplayValue = [];
	this.initPages();
	
}

// Set up or update the pages
PandaCarouselBasicLayoutPlugin.prototype.initPages = function() {

	// Slice so that nothing else can change our array without us knowing
	this.pageElements = Array.prototype.slice.call(this.carousel.element.children, 0);
	this.carousel.setPageCount(this.pageElements.length);
	
	// Hide all the pages except the current one
	for (var e = this.pageElements.length - 1; e >= 0; e--) {
		this.pageElementsInitialDisplayValue[e] = this.pageElements[e].style.display;
		this.pageElements[e].style.display = this.carousel.currentPage == e ? 'block' : 'none';
	}
	
};

// Move from one page to another in just about the simplest way possible
PandaCarouselBasicLayoutPlugin.prototype.showPage = function(previousPage, page) {

	this.pageElements[previousPage].style.display = 'none';
	this.pageElements[page].style.display = 'block';

};

// Tidy up
PandaCarouselBasicLayoutPlugin.prototype.destroy = function() {

	// Remove any listeners we were using
	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("postgotopage", this.postGotoPageEventId);
	
	// Put all the original styles back
	for (var e = this.pageElements.length - 1; e >= 0; e--) {
		this.pageElements[e].style.display = this.pageElementsInitialDisplayValue[e];
	}
	
	// Remove our reference to the PandaCarousel instance
	this.carousel = null;
	
};