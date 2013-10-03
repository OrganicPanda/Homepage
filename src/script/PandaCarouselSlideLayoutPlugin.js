// Provide a simple side-to-side sliding carousel
function PandaCarouselSlideLayoutPlugin(carousel) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;
	
	// Set up some listeners
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.postGotoPageEventId = this.carousel.addEventListener("postgotopage", this.showPage.bind(this));
	
	// Init our pages
	this.pageElements = [];
	this.pageElementsOriginalStyles = {};
	this.initPages();
	this.setInitialStyles();
	
}

// Set up or update the pages
PandaCarouselSlideLayoutPlugin.prototype.initPages = function() {

	// Slice so that nothing else can change our array without us knowing
	this.pageElements = Array.prototype.slice.call(this.carousel.element.children, 0);
	this.carousel.setPageCount(this.pageElements.length);
	
};

// Modify each page's styles so that it's ready for action
PandaCarouselSlideLayoutPlugin.prototype.setInitialStyles = function() {

	// Set up the storage for these styles
	this.pageElementsOriginalStyles['position'] = [];
	this.pageElementsOriginalStyles['top'] = [];
	this.pageElementsOriginalStyles['left'] = [];
	var e;

	// Change the carousel styles first
	this.carousel.element.style.position = 'relative';
	this.carousel.element.style.overflow = 'hidden';

	// First cache the original style
	for (e = this.pageElements.length - 1; e >= 0; e--) {
		this.pageElementsOriginalStyles['position'][e] = this.pageElements[e].style.position;
		this.pageElementsOriginalStyles['top'][e] = this.pageElements[e].style.top;
		this.pageElementsOriginalStyles['left'][e] = this.pageElements[e].style.left;
	}
	
	// Hide all the pages except the current one
	for (e = this.pageElements.length - 1; e >= 0; e--) {
		this.pageElements[e].style.position = 'absolute';
		this.pageElements[e].style.top = 0;
		this.pageElements[e].style.left = 0;
	}

};

// Move from one page to another in just about the simplest way possible
PandaCarouselSlideLayoutPlugin.prototype.showPage = function(previousPage, page) {

	//this.pageElements[page].style.display = this.pageElementsOriginalStyles['display'][page];

};

// Modify each page's styles so that they are as before we started
PandaCarouselSlideLayoutPlugin.prototype.resetOriginalStyles = function() {

	// Put all the original styles back
	for (var e = this.pageElements.length - 1; e >= 0; e--) {
		this.pageElements[e].style.position = this.pageElementsOriginalStyles['position'][e];
		this.pageElements[e].style.top = this.pageElementsOriginalStyles['top'][e];
		this.pageElements[e].style.left = this.pageElementsOriginalStyles['left'][e];
	}

	// Change the carousel styles back
	this.carousel.element.style.position = null;
	this.carousel.element.style.overflow = null;

};

// Tidy up
PandaCarouselSlideLayoutPlugin.prototype.destroy = function() {

	// Remove any listeners we were using
	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("postgotopage", this.postGotoPageEventId);

	// Undo our style changes
	this.resetOriginalStyles();
	
	// Remove our reference to the PandaCarousel instance
	this.carousel = null;
	
};