function PandaCarousel(element, options) {
	
	// This is the container element that will will make in to a carousel
	this.element = element;
	
	// This is the user config object
	this.options = options || {};
	
	// Store all of the event handlers under the event name
	this.eventListeners = {};

	// Store a few details about page state
	// A page is just an index from 0 to this.pageCount - 1, it can be displayed in any way.
	// Layout plugins are expected to react to page changes and 
	// display the current page as they see fit 
	this.pageCount = 0;
	this.previousPage = 0;
	this.currentPage = 0;

	// Do we have plugins to set up?
	// Thanks to bespoke.js (A much better carousel, but you didn't hear that from me!) for this idea
	if (typeof options.plugins != 'undefined') {
		for (var i = 0, l = options.plugins.length; i < l; i++) {
			options.plugins[i] = new options.plugins[i](this);
		}
	}
	
	// We are now live
	this.addClass('pandacarousel-live');

}



// API functions

// Store the total number of pages
PandaCarousel.prototype.setPageCount = function(pageCount) {

	// No negative numbers please
	if (pageCount >= 0) {
		
		var oldPageCount = this.pageCount;
		
		this.dispatchEvent("presetpagecount", this.pageCount, pageCount);
		
		this.pageCount = pageCount;
		
		this.dispatchEvent("postsetpagecount", oldPageCount, this.pageCount);
		
	}

};

// Go to a specific page. All page moves should come through here
PandaCarousel.prototype.gotoPage = function(page) {

	// Check the destination page exists
	if (page >= 0 && page < this.pageCount) {
		
		this.dispatchEvent("pregotopage", this.currentPage, page);

		this.previousPage = this.currentPage;
		this.currentPage = page;
		
		this.dispatchEvent("postgotopage", this.previousPage, this.currentPage);

	}

};

// Can we move to the previous page?
PandaCarousel.prototype.canGoPrevious = function() {

	return ((this.currentPage - 1) >= 0);

};

// Can we move to the next page?
PandaCarousel.prototype.canGoNext = function() {

	return ((this.currentPage + 1) < this.pageCount);

};

// Go to the first page
PandaCarousel.prototype.first = function() {

	this.gotoPage(0);

};

// Go to the last page
PandaCarousel.prototype.last = function() {

	this.gotoPage(this.pageCount - 1);

};

// Go to the next page, if possible
PandaCarousel.prototype.next = function() {

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

	this.dispatchEvent("predestroy");

	// Remove any classes that many have been added
	this.removeClass('pandacarousel-live');

	// Even though this is called postdestroy it needs to be called now before we lose this.element
	// and the ability to do events with this.eventListeners
	this.dispatchEvent("postdestroy");

	// Remove our reference to the main carousel element.
	// After this nothing will work properly
	this.element = null;
	
	// Remove all the PandaCarousel event listeners
	this.eventListeners = null;

};

// Event handling code

PandaCarousel.prototype.dispatchEvent = function(eventName){
	
	var callbacks = this.eventListeners[eventName] || [];
	var callback;
	var eventArgs = Array.prototype.slice.call(arguments, 1);

	for (var c = callbacks.length - 1; c >= 0; c--) {

		callback = callbacks[c];

		if (callback) {
			callback.apply(this, eventArgs);
		}

	}

};

PandaCarousel.prototype.addEventListener = function(eventName, callback) {

	if (!this.eventListeners[eventName]) {
		this.eventListeners[eventName] = [];
	}

	return this.eventListeners[eventName].push(callback);

};

PandaCarousel.prototype.removeEventListener = function(eventName, id) {

	return this.eventListeners[eventName][id] = null;

};


// Utility Functions

// Thanks to: http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
// Returns null when no support is found 
/*andaCarousel.prototype.getStyleProperty = function(prefixes) {

	var prefix,
		div = document.createElement('div');

	// Loop until we find some support
	for (var i = 0; i < prefixes.length; i++) {
		if (div.style[prefixes[i]] != undefined) {
			return prefixes[i];
		}
	}

	// No support found
	return null;

};*/

// Visual debugging function
PandaCarousel.prototype.debug = function() {
	var debugElement = document.getElementById('debug');
	if (debugElement) {
		var d = new Date().toUTCString();
		debugElement.innerHTML = d + ": " + Array.prototype.slice.call(arguments).join(", ") + "</br>" + debugElement.innerHTML;
	}
};

// Does element have classname?
PandaCarousel.prototype.hasClass = function(clsName) {
	var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
	return regex.test(this.element.className);
};

// Add classname to element
PandaCarousel.prototype.addClass = function(clsName) {
	if (!this.hasClass(clsName)) {
		this.element.className += " " + clsName;
	}
};

// Remove classname from element, if it exists 
PandaCarousel.prototype.removeClass = function(clsName) {
	var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
	this.element.className = this.element.className.replace(regex, " ");
};





// Not sure about this

/*var _this = this;

this.requestAnimationFrameId = null;
this.listeners = [];

this.listeners.push([window, 'resize',
	function(e) {
		_this.cacheDimensions();
	},
	false
]);

for (var l = this.listeners.length - 1; l >= 0; l--) {
	this.listeners[l][0].addEventListener(this.listeners[l][1], this.listeners[l][2], this.listeners[l][3]);
};

var frame;
frame = function(e) {

	// Todo: don't render if nothing has changed
	_this.applyChildStyles();

	window.requestAnimationFrame(frame);

};
this.requestAnimationFrameId = window.requestAnimationFrame(frame);

// Remove all the browser event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};

	// Cancel the animation
	if (this.requestAnimationFrameId !== null) {

		window.cancelAnimationFrame(this.requestAnimationFrameId);
		this.requestAnimationFrameId = null;

	}*/
