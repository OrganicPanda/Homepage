// Provide a simple side-to-side sliding carousel
function PandaCarouselSlideLayoutPlugin(carousel) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;

	// Set up some listeners
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.postGotoPageEventId = this.carousel.addEventListener("postgotopage", this.render.bind(this));
	this.postUpdateDimentionsEventId = this.carousel.addEventListener("postupdatedimensions", this.computeOffsetStyles.bind(this));
	this.renderOffsetEventId = this.carousel.addEventListener("renderoffset", this.render.bind(this));
	this.renderEventId = this.carousel.addEventListener("render", this.render.bind(this));
	this.gotoPageNearestOffsetEventId = this.carousel.addEventListener("gotopagenearestoffset", this.gotoPageNearestOffset.bind(this));

	// Init our pages
	this.pageElements = [];
	this.pageElementsPixelWidths = [];
	this.pageElementsPixelOffsets = [];
	this.pageElementsPercentWidths = [];
	this.pageElementsPercentOffsets = [];
	this.pageElementsOriginalStyles = {};
	this.initPages();
	this.storeOriginalStyles();
	this.setInitialStyles();

}

// Set up or update the pages
PandaCarouselSlideLayoutPlugin.prototype.initPages = function() {

	// Slice so that nothing else can change our array without us knowing
	this.pageElements = Array.prototype.slice.call(this.carousel.element.children, 0);
	this.carousel.setPageCount(this.pageElements.length);

};

// Make sure we record the styles before we change anything
PandaCarouselSlideLayoutPlugin.prototype.storeOriginalStyles = function() {

	// Set up the storage for these styles
	this.pageElementsOriginalStyles['position'] = [];
	this.pageElementsOriginalStyles['top'] = [];
	this.pageElementsOriginalStyles['left'] = [];
	var e;

	// First cache the original styles
	for (e = 0; e < this.pageElements.length; e++) {
		this.pageElementsOriginalStyles['position'][e] = this.pageElements[e].style.position;
		this.pageElementsOriginalStyles['top'][e] = this.pageElements[e].style.top;
		this.pageElementsOriginalStyles['left'][e] = this.pageElements[e].style.left;
	}

};

// Modify each page's styles so that it's ready for action
PandaCarouselSlideLayoutPlugin.prototype.setInitialStyles = function() {

	// Change the carousel styles first
	this.carousel.addClass('pandacarousel-slide-layout');

	for (var e = 0; e < this.pageElements.length; e++) {
		this.pageElements[e].style.position = 'absolute';
		this.pageElements[e].style.top = 0;
		this.pageElements[e].style.left = 0;
	}

};

// Put the page elements where they should be
PandaCarouselSlideLayoutPlugin.prototype.computeOffsetStyles = function() {

	var e;

	// Collect the width for each page
	// Also record the pixel offset of each
	var currentPixelWidth = 0;
	var currentPixelOffset = 0;
	for (e = 0; e < this.pageElements.length; e++) {
		currentPixelWidth = this.pageElements[e].offsetWidth;
		this.pageElementsPixelWidths[e] = currentPixelWidth;
		this.pageElementsPixelOffsets[e] = currentPixelOffset;
		currentPixelOffset += currentPixelWidth;
	}

	// Translate those widths in to percentages based on the current size of the carousel
	var totalPixelWidth = this.carousel.cacheElementWidth;
	var currentPercentWidth = 0;
	var currentPercentOffset = 0;
	for (e = 0; e < this.pageElements.length; e++) {
		currentPercentWidth = (100 / totalPixelWidth) * this.pageElementsPixelWidths[e];
		this.pageElementsPercentOffsets[e] = currentPercentOffset;
		currentPercentOffset += currentPercentWidth;
	}

	// Apply the offsets
	this.render();

};

// Render with the given active page
PandaCarouselSlideLayoutPlugin.prototype.render = function(carouselOffsetX, carouselOffsetY) {

	// We have the current page offset as well as any pixel offset on top of that
	// which could be caused by a drag/slide
	carouselOffsetX = carouselOffsetX || 0;
	carouselOffsetY = carouselOffsetY || 0;
	var carouselOffsetXPercent = (100 / this.carousel.cacheElementWidth) * carouselOffsetX;
	var targetOffset = this.pageElementsPercentOffsets[this.carousel.currentPage];

	// Shift everything over by that amount
	for (var e = 0; e < this.pageElements.length; e++) {
		this.pageElements[e].style.left = (this.pageElementsPercentOffsets[e] - targetOffset + carouselOffsetXPercent) + '%';
	}

};

// Work out which page is closest to the given offset and go there
PandaCarouselSlideLayoutPlugin.prototype.gotoPageNearestOffset = function(carouselOffsetX, carouselOffsetY) {

	carouselOffsetX = carouselOffsetX || 0;
	carouselOffsetY = carouselOffsetY || 0;

	// Work out where we want to be
	var currentPageOffset = this.pageElementsPixelOffsets[this.carousel.currentPage];
	var target = currentPageOffset + -carouselOffsetX;

	// Find the closest thing to that point
	// There's probably a better way to write this loop but it works!
	if (this.pageElementsPixelOffsets.length > 0) {
		var previousDiff = Math.abs(this.pageElementsPixelOffsets[0] - target);
		var thisDiff;
		for (var e = 1; e < this.pageElements.length; e++) {
			thisDiff = Math.abs(this.pageElementsPixelOffsets[e] - target);

			if (previousDiff > thisDiff) {
				if (this.pageElements[e + 1]) {
					// Getting closer so try again
					previousDiff = thisDiff;
				} else {
					// Last one so take it
					this.carousel.gotoPage(e);
					break;
				}
			} else {
				// The previous one was closer
				this.carousel.gotoPage(e - 1);
				break;
			}
		}
	}

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
	this.carousel.removeClass('pandacarousel-slide-layout');

};

// Tidy up
PandaCarouselSlideLayoutPlugin.prototype.destroy = function() {

	// Remove any listeners we were using
	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("postgotopage", this.postGotoPageEventId);
	this.carousel.removeEventListener("postupdatedimensions", this.postUpdateDimentionsEventId);
	this.carousel.removeEventListener("renderoffset", this.renderOffsetEventId);
	this.carousel.removeEventListener("render", this.renderEventId);
	this.carousel.removeEventListener("gotopagenearestoffset", this.gotoPageNearestOffsetEventId);

	// Undo our style changes
	this.resetOriginalStyles();

	// Remove our reference to the PandaCarousel instance
	this.carousel = null;

};