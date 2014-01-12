function PandaCarouselButtonsPlugin(carousel) {
  'use strict';

  // Store a reference to the PandaCarousel instance
  this.carousel = carousel;

  // The buttons may already exist
  this.previousButton = this.carousel.options.previousButton || null;
  this.nextButton = this.carousel.options.nextButton || null;
  this.createdThePreviousButton = false;
  this.createdTheNextButton = false;

  // Add the buttons if required
  this.addButtons();

  // Set up any DOM events the buttons may need
  this.listeners = [];
  this.initEvents();

  // Set up some listeners
  this.preDestroyEventId = this.carousel.addEventListener(
    'predestroy', this.destroy.bind(this)
  );
  this.postGotoPageEventId = this.carousel.addEventListener(
    'postgotopage', this.updateButtons.bind(this)
  );
  this.postSetPageCountEventId = this.carousel.addEventListener(
    'postsetpagecount', this.updateButtons.bind(this)
  );
}

// Create and add the buttons if required
PandaCarouselButtonsPlugin.prototype.addButtons = function() {
  'use strict';

  // The buttons may have already been created
  if (!this.previousButton) {
    this.previousButton = document.createElement('button');
    this.previousButton.className = 'previous';
    this.previousButton.innerHTML = 'Previous';
    this.carousel.element.parentNode.appendChild(this.previousButton);
    this.createdThePreviousButton = true;
  }

  if (!this.nextButton) {
    this.nextButton = document.createElement('button');
    this.nextButton.className = 'next';
    this.nextButton.innerHTML = 'Next';
    this.carousel.element.parentNode.appendChild(this.nextButton);
    this.createdTheNextButton = true;
  }
};

// Remove the button DOM elents
PandaCarouselButtonsPlugin.prototype.removeButtons = function() {
  'use strict';

  // You should also remove the events!
  if (this.createdThePreviousButton) {
    this.previousButton.parentNode.removeChild(this.previousButton);
  }
  if (this.createdTheNextButton) {
    this.nextButton.parentNode.removeChild(this.nextButton);
  }

  this.previousButton = null;
  this.nextButton = null;
};

// We will add classes depending on the page we're on
PandaCarouselButtonsPlugin.prototype.updateButtons = function() {
  'use strict';

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
  'use strict';

  var l;

  this.listeners.push([
    this.previousButton, 'click',
    this.carousel.previous.bind(this.carousel), false
  ]);
  this.listeners.push([
    this.nextButton, 'click',
    this.carousel.next.bind(this.carousel), false
  ]);

  for (l = this.listeners.length - 1; l >= 0; l--) {
    this.listeners[l][0].addEventListener(
      this.listeners[l][1], this.listeners[l][2], this.listeners[l][3]
    );
  }
};

PandaCarouselButtonsPlugin.prototype.destroy = function() {
  'use strict';

  // Remove any listeners we were using
  this.carousel.removeEventListener(
    'predestroy', this.preDestroyEventId
  );
  this.carousel.removeEventListener(
    'postgotopage', this.postGotoPageEventId
  );
  this.carousel.removeEventListener(
    'postsetpagecount', this.postSetPageCountEventId
  );

  // Remove all the DOM event listeners
  var listener;
  while (listener = this.listeners.pop()) { // jshint ignore:line
    listener[0].removeEventListener(listener[1], listener[2]);
  }

  // Remove the buttons
  this.removeButtons();

  // Remove our reference to the PandaCarousel instance
  this.carousel.removeClass('pandacarousel-with-previous');
  this.carousel.removeClass('pandacarousel-with-next');
  this.carousel = null;
};