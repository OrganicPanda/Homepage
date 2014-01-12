// Provide a simple show and hide carousel
function PandaCarouselBasicLayoutPlugin(carousel) {
  'use strict';

  // Store a reference to the PandaCarousel instance
  this.carousel = carousel;

  // Set up some listeners
  this.preDestroyEventId = this.carousel.addEventListener(
    'predestroy', this.destroy.bind(this)
  );
  this.postGotoPageEventId = this.carousel.addEventListener(
    'postgotopage', this.showPage.bind(this)
  );

  // Init our pages
  this.pageElements = [];
  this.pageElementsOriginalStyles = {};
  this.initPages();
  this.setInitialStyles();
}

// Set up or update the pages
PandaCarouselBasicLayoutPlugin.prototype.initPages = function() {
  'use strict';

  // Slice so that nothing else can change our array without us knowing
  this.pageElements = Array.prototype.slice.call(
    this.carousel.element.children, 0
  );
  this.carousel.setPageCount(this.pageElements.length);

};

// Modify each page's styles so that it's ready for action
PandaCarouselBasicLayoutPlugin.prototype.setInitialStyles = function() {
  'use strict';

  // Set up the storage for these styles
  this.pageElementsOriginalStyles.display = [];
  var e;

  // First cache the original style
  for (e = this.pageElements.length - 1; e >= 0; e--) {
    this.pageElementsOriginalStyles.display[e] =
      this.pageElements[e].style.display;
  }

  // Hide all the pages except the current one
  for (e = this.pageElements.length - 1; e >= 0; e--) {
    this.pageElements[e].style.display =
      this.carousel.currentPage == e ?
        this.pageElementsOriginalStyles.display[e] :
        'none';
  }

};

// Move from one page to another in just about the simplest way possible
PandaCarouselBasicLayoutPlugin.prototype.showPage = function(
  previousPage, page) {
  'use strict';

  this.pageElements[previousPage].style.display = 'none';
  this.pageElements[page].style.display =
    this.pageElementsOriginalStyles.display[page];
};

// Modify each page's styles so that they are as before we started
PandaCarouselBasicLayoutPlugin.prototype.resetOriginalStyles = function() {
  'use strict';

  var e;

  // Put all the original styles back
  for (e = this.pageElements.length - 1; e >= 0; e--) {
    this.pageElements[e].style.display =
      this.pageElementsOriginalStyles.display[e];
  }
};

// Tidy up
PandaCarouselBasicLayoutPlugin.prototype.destroy = function() {
  'use strict';

  // Remove any listeners we were using
  this.carousel.removeEventListener('predestroy', this.preDestroyEventId);
  this.carousel.removeEventListener('postgotopage', this.postGotoPageEventId);

  // Undo our style changes
  this.resetOriginalStyles();

  // Remove our reference to the PandaCarousel instance
  this.carousel = null;
};