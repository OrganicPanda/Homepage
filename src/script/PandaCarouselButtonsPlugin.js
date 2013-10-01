function PandaCarouselButtonsPlugin(carousel) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;

	// The buttons may already exist
	this.previousButton = (this.carousel.options.previousButton === undefined) ? null : this.carousel.options.previousButton;
	this.nextButton = (this.carousel.options.nextButton === undefined) ? null : this.carousel.options.nextButton;
	
	// Add the buttons if required
	this.addButtons();
	
	// Set up any DOM events the buttons may need
	this.listeners = [];
	this.initEvents();
	
	// Set up some listeners
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.postGotoPageEventId = this.carousel.addEventListener("postgotopage", this.updateButtons.bind(this));
	this.postSetPageCountEventId = this.carousel.addEventListener("postsetpagecount", this.updateButtons.bind(this));
	
}

// Create and add the buttons if required
PandaCarouselButtonsPlugin.prototype.addButtons = function() {

	// The buttons may have already been created
	if (!this.previousButton) {
		this.previousButton = document.createElement('button');
		this.previousButton.className = 'previous';
		this.previousButton.innerHTML = 'Previous';
		this.carousel.element.parentNode.appendChild(this.previousButton);
	}

	if (!this.nextButton) {
		this.nextButton = document.createElement('button');
		this.nextButton.className = 'next';
		this.nextButton.innerHTML = 'Next';
		this.carousel.element.parentNode.appendChild(this.nextButton);
	}

};

// Remove the button DOM elents
PandaCarouselButtonsPlugin.prototype.removeButtons = function() {

	// You should also remove the events!
	this.previousButton.parentNode.removeChild(this.previousButton);
	this.nextButton.parentNode.removeChild(this.nextButton);

	this.previousButton = null;
	this.nextButton = null;

};

// We will add classes depending on the page we're on
PandaCarouselButtonsPlugin.prototype.updateButtons = function() {

	if (this.carousel.canGoPrevious()) {

		this.carousel.addClass('pandacarousel-with-previous');

	} else {

		this.carousel.removeClass('pandacarousel-with-previous');

	}

	if (this.carousel.canGoNext()) {

		this.carousel.addClass('pandacarousel-with-next');

	} else {

		this.carousel.removeClass('pandacarousel-with-next');

	}

};

PandaCarouselButtonsPlugin.prototype.initEvents = function() {

	this.listeners.push([this.previousButton, 'click', this.carousel.previous.bind(this.carousel), false]);
	this.listeners.push([this.nextButton, 'click', this.carousel.next.bind(this.carousel), false]);

	for (var l = this.listeners.length - 1; l >= 0; l--) {
		this.listeners[l][0].addEventListener(this.listeners[l][1], this.listeners[l][2], this.listeners[l][3]);
	}

};

PandaCarouselButtonsPlugin.prototype.destroy = function() {

	// Remove any listeners we were using
	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("postgotopage", this.postGotoPageEventId);
	this.carousel.removeEventListener("postsetpagecount", this.postSetPageCountEventId);
	
	// Remove all the DOM event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	}
	
	// Remove the buttons
	this.removeButtons();
	
	// Remove our reference to the PandaCarousel instance
	this.carousel.removeClass('pandacarousel-with-previous');
	this.carousel.removeClass('pandacarousel-with-next');
	this.carousel = null;
	
};