function PandaCarouselPagedLayoutPlugin(carousel, options) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;	
	this.options = options || {};

	this.transitionDurationProperty = this.getStyleProperty(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration', 'msTransitionDuration', 'KhtmlTransitionDuration']);
	this.offset = 0;
	
	this.cacheElementWidth = 0;
	this.cacheElementHeight = 0;
	this.cacheDimensions();
	
	this.childrenPerPage = (options.childrenPerPage === undefined) ? 1 : options.childrenPerPage;
	this.horizontalLayout = (options.horizontalLayout === undefined) ? true : options.horizontalLayout;
	this.childCount = 0;
	this.childWidth = [];
	this.childHeight = [];
	this.childFromTop = [];
	this.childFromLeft = [];
	this.pages = [];
	this.pageCount = 0;
	this.pageWidth = 0;
	this.pageHeight = 0;
	
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.preSetChildrenEventId = this.carousel.addEventListener("presetchildren", this.setChildren.bind(this));
	
};

PandaCarouselPagedLayoutPlugin.prototype.cacheDimensions = function() {

	this.cacheElementWidth = this.carousel.element.offsetWidth;
	this.cacheElementHeight = this.carousel.element.offsetHeight;

};

/** Finish this */
PandaCarouselPagedLayoutPlugin.prototype.setChildren = function() {

	// Keep a note of the current page/child so we can try and keep them in view if the layout changes
	var currentPage = (this.pages.length > 0) ? this.pages[this.currentPage] : null;
	var currentChild = (currentPage && currentPage.length) > 0 ? currentPage[0] : null;

	// Reset everything
	this.pages = [];
	this.children = children;
	this.childCount = children.length;

	// Group the children by page
	for (var i = 0; i < this.childCount; i += this.childrenPerPage) {
		this.pages.push(children.slice(i, i + this.childrenPerPage));
	}

	this.pageCount = this.pages.length;
	this.pageWidth = this.cacheElementWidth;
	this.pageHeight = this.cacheElementHeight;

	this.childWidth = [];
	this.childHeight = [];
	this.childFromTop = [];
	this.childFromLeft = [];

	var pageChildren;
	var totalFromLeft = 0;
	var child = 0;
	var widthPx, heightPx, topPx, leftPx;

	// Do all the calculations
	for (var p = 0, pl = this.pageCount; p < pl; p++) {

		for (var c = 0, cl = this.pages[p].length; c < cl; c++) {

			// Divide up the width/height as per this.childrenPerPage
			// If there's not enough children then give each child more space	

			// First work out the sizes in pixels
			widthPx = this.horizontalLayout ? this.pageWidth / this.pages[p].length : this.pageWidth;
			heightPx = this.horizontalLayout ? this.pageHeight : this.pageHeight / this.pages[p].length;
			topPx = this.horizontalLayout ? 0 : heightPx * c;
			leftPx = this.horizontalLayout ? totalFromLeft : this.pageWidth * p;

			// This allows us to now convert and store the values as percentages
			// We need to do this as a two step process because CSS percentage transforms 
			// are relative to the size of the child, not the container. This means that we need 
			// the 'real' (pixel) values from which we can generate the relative percent values
			this.childWidth[child] = (widthPx / this.pageWidth) * 100;
			this.childHeight[child] = (heightPx / this.pageHeight) * 100;
			this.childFromTop[child] = (topPx / this.pageHeight) * 100;
			this.childFromLeft[child] = (leftPx / this.pageWidth) * 100;

			totalFromLeft += widthPx;
			child++;

		}

	}

	// Apply the width / height settings
	for (var c = 0, cl = this.childCount; c < cl; c++) {

		this.children[c].style.width = String(this.childWidth[c]) + '%';
		this.children[c].style.height = String(this.childHeight[c]) + '%';

	}

	// Try and find the current page/child
	var found = false;
	for (var p = 0, pl = this.pageCount; p < pl && !found; p++) {
		for (var c = 0, cl = this.pages[p].length; c < cl && !found; c++) {

			if (this.pages[p][c] === currentChild) {

				// Found the child; move to it's page (which may have changed)
				found = true;
				this.gotoPage(p);

			}

		}
	}

	// Couldn't find the child (possibly removed). Go back to the start
	if (!found) {
		this.gotoPage(0);
	}
	
};

PandaCarouselPagedLayoutPlugin.prototype.destroy = function() {

	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("presetchildren", this.preSetChildrenEventId);

	// Remove all the event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};
	
};