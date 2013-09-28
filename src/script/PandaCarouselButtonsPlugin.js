function PandaCarouselButtonsPlugin(carousel, options) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;	
	this.options = options || {};

	this.previousButton = (this.options.previousButton === undefined) ? null : this.options.previousButton;
	this.nextButton = (this.options.nextButton === undefined) ? null : this.options.nextButton;
	
	console.log('buttons', this.previousButton, this.nextButton);
	
	this.addButtons();
	
	this.initEvents();
	
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	this.postGotoPageEventId = this.carousel.addEventListener("postgotopage", this.updateButtons.bind(this));
	this.postUpdateChildrenEventId = this.carousel.addEventListener("postupdatechildren", this.updateButtons.bind(this));
	
};

PandaCarouselButtonsPlugin.prototype.addButtons = function() {

	// The buttons may have already been created
	if (!this.previousButton) {
		this.previousButton = document.createElement('button');
		this.previousButton.className = 'previous';
		this.previousButton.innerHTML = '‹';
		this.carousel.element.parentNode.appendChild(this.previousButton);
	}

	if (!this.nextButton) {
		this.nextButton = document.createElement('button');
		this.nextButton.className = 'next';
		this.nextButton.innerHTML = '›';
		this.carousel.element.parentNode.appendChild(this.nextButton);
	}

};

PandaCarouselButtonsPlugin.prototype.removeButtons = function() {

	// You should also remove the events!

	// Make sure the buttons are connected to the DOM first
	if (this.previousButton.parentNode === this.carousel.element.parentNode) {
		this.carousel.element.parentNode.removeChild(this.previousButton);
	}
	if (this.nextButton.parentNode === this.carousel.element.parentNode) {
		this.carousel.element.parentNode.removeChild(this.nextButton);
	}

	this.previousButton = null;
	this.nextButton = null;

};

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

	// These classes may have introduced styles that changed the width of the carousel
	this.carousel.cacheDimensions();

};

PandaCarouselButtonsPlugin.prototype.initEvents = function() {

	var _this = this;
	this.listeners = [];

	this.listeners.push([this.previousButton, 'click',
		function() {
			_this.carousel.previous();
		},
		false
	]);
	this.listeners.push([this.nextButton, 'click',
		function() {
			_this.carousel.next();
		},
		false
	]);

	for (var l = this.listeners.length - 1; l >= 0; l--) {
		this.listeners[l][0].addEventListener(this.listeners[l][1], this.listeners[l][2], this.listeners[l][3]);
	};

};

PandaCarouselButtonsPlugin.prototype.destroy = function() {

	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);
	this.carousel.removeEventListener("postgotopage", this.postGotoPageEventId);
	this.carousel.removeEventListener("postupdatechildren", this.postUpdateChildrenEventId);

	// Remove all the event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};
	
	this.carousel.removeClass('pandacarousel-with-previous');
	this.carousel.removeClass('pandacarousel-with-next');
	
	// Remove the buttons
	this.removeButtons();
	
};