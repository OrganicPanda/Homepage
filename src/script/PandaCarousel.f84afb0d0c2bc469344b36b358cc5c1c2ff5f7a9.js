function PandaCarousel(element, options) {
  'use strict';

  // This is the container element that will will make in to a carousel
  this.element = element;

  // This is the user config object
  this.options = options || {};

  // Store all of the event handlers under the event name
  this.eventListeners = {};

  // Store a few details about page state
  // A page is just an index from 0 to this.pageCount - 1,
  // it can be displayed in any way.
  // Layout plugins are expected to react to page changes and
  // display the current page as they see fit
  this.pageCount = 0;
  this.previousPage = 0;
  this.currentPage = 0;

  // Do we have plugins to set up?
  // Thanks to bespoke.js (A much better carousel,
  // but you didn't hear that from me!) for this idea
  if (typeof options.plugins != 'undefined') {
    for (var i = 0, l = options.plugins.length; i < l; i++) {
      options.plugins[i] = new options.plugins[i](this);
    }
  }

  // We are now live
  this.addClass('pandacarousel');

  // Cache our dimentions incase they are needed
  this.updateDimensions();
}

PandaCarousel.prototype.updateDimensions = function() {
  'use strict';

  this.dispatchEvent(
    'preupdatedimensions', this.cacheElementWidth, this.cacheElementHeight
  );

  this.cacheElementWidth = this.element.offsetWidth;
  this.cacheElementHeight = this.element.offsetHeight;

  this.dispatchEvent(
    'postupdatedimensions', this.cacheElementWidth, this.cacheElementHeight
  );
};

// Store the total number of pages
PandaCarousel.prototype.setPageCount = function(pageCount) {
  'use strict';

  // No negative numbers please
  if (pageCount >= 0) {
    var oldPageCount = this.pageCount;

    this.dispatchEvent('presetpagecount', this.pageCount, pageCount);

    this.pageCount = pageCount;

    this.dispatchEvent('postsetpagecount', oldPageCount, this.pageCount);
  }
};

// Go to a specific page. All page moves should come through here
PandaCarousel.prototype.gotoPage = function(page) {
  'use strict';

  // Check the destination page exists
  if (page >= 0 && page < this.pageCount) {
    this.dispatchEvent('pregotopage', this.currentPage, page);

    this.previousPage = this.currentPage;
    this.currentPage = page;

    this.dispatchEvent('postgotopage', this.previousPage, this.currentPage);
  }
};

// Can we move to the previous page?
PandaCarousel.prototype.canGoPrevious = function() {
  'use strict';
  return ((this.currentPage - 1) >= 0);
};

// Can we move to the next page?
PandaCarousel.prototype.canGoNext = function() {
  'use strict';
  return ((this.currentPage + 1) < this.pageCount);
};

// Go to the first page
PandaCarousel.prototype.first = function() {
  'use strict';
  this.gotoPage(0);
};

// Go to the last page
PandaCarousel.prototype.last = function() {
  'use strict';
  this.gotoPage(this.pageCount - 1);
};

// Go to the next page, if possible
PandaCarousel.prototype.next = function() {
  'use strict';

  // Room to go next?
  if (this.canGoNext()) {
    this.gotoPage(this.currentPage + 1);
  } else {
    // No, stay on the current child
    this.gotoPage(this.currentPage);
  }
};

// Go to the previous page, if possible
PandaCarousel.prototype.previous = function() {
  'use strict';

  // Room to go previous?
  if (this.canGoPrevious()) {
    this.gotoPage(this.currentPage - 1);
  } else {
    // No, stay on the current child
    this.gotoPage(this.currentPage);
  }
};

// Tidy everything up and hopefully leave no traces
PandaCarousel.prototype.destroy = function() {
  'use strict';

  this.dispatchEvent('predestroy');

  // Remove any classes that many have been added
  this.removeClass('pandacarousel');

  // Even though this is called postdestroy it needs to be called
  // now before we lose this.element and the ability to do events
  // with this.eventListeners
  this.dispatchEvent('postdestroy');

  // Remove our reference to the main carousel element.
  // After this nothing will work properly
  this.element = null;

  // Remove all the PandaCarousel event listeners
  this.eventListeners = null;
};

PandaCarousel.prototype.dispatchEvent = function(eventName){
  'use strict';

  var callbacks = this.eventListeners[eventName] || []
    , callback
    , eventArgs = Array.prototype.slice.call(arguments, 1)
    , c;

  for (c = callbacks.length - 1; c >= 0; c--) {
    callback = callbacks[c];

    if (callback) {
      callback.apply(this, eventArgs);
    }
  }
};

PandaCarousel.prototype.addEventListener = function(eventName, callback) {
  'use strict';

  if (!this.eventListeners[eventName]) {
    this.eventListeners[eventName] = [];
  }

  return this.eventListeners[eventName].push(callback);
};

PandaCarousel.prototype.removeEventListener = function(eventName, id) {
  'use strict';
  return this.eventListeners[eventName][id] = null; // jshint ignore:line
};

// Visual debugging function
PandaCarousel.prototype.debug = function() {
  'use strict';

  var debugElement = document.getElementById('debug');
  if (debugElement) {
    var d = new Date().toUTCString();
    debugElement.innerHTML = d + ': ' +
      Array.prototype.slice.call(arguments).join(', ') +
      '</br>' + debugElement.innerHTML;
  }
};

// Does element have classname?
PandaCarousel.prototype.hasClass = function(clsName) {
  'use strict';

  var regex = new RegExp('(^|\\s)' + clsName + '(\\s|$)');
  return regex.test(this.element.className);
};

// Add classname to element
PandaCarousel.prototype.addClass = function(clsName) {
  'use strict';

  if (!this.hasClass(clsName)) {
    this.element.className += ' ' + clsName;
  }
};

// Remove classname from element, if it exists
PandaCarousel.prototype.removeClass = function(clsName) {
  'use strict';

  var regex = new RegExp('(^|\\s)' + clsName + '(\\s|$)');
  this.element.className = this.element.className.replace(regex, ' ');
};