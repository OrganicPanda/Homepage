function PandaCarousel(element, options) {

	// Some browsers are still behind a prefix and some have no support at all.
	// Grab the best properties we can
	
	this.eventListeners = {};
	this.element = element;
	

	this.listeners = [];
	this.requestAnimationFrameId = null;

	

	this.currentPage = 0;
	

	this.debug = function() {
		var debugElement = document.getElementById('debug');
		if (debugElement) {
			var d = new Date().toUTCString();
			debugElement.innerHTML = d + ": " + Array.prototype.slice.call(arguments).join(", ") + "</br>" + debugElement.innerHTML;
		}
	};

	// We are now live
	this.addClass('pandacarousel-live');

	this.updateChildren();

	this.initEvents();

	// Do we have plugins to set up?
	// Thanks to bespoke.js (A much better carousel, but you didn't hear that from me!) for this idea
	if (typeof options.plugins != 'undefined') {
		for (var i = 0, l = options.plugins.length; i < l; i++) {
			options.plugins[i] = new options.plugins[i](this, options);
		};
	}

};

PandaCarousel.prototype.dispatchEvent = function(eventName, eventArgs){
	
	var callbacks = this.eventListeners[eventName] || [];
	var callback;

	for (var c = callbacks.length - 1; c >= 0; c--) {

		callback = callbacks[c];

		if (callback) {
			callback.call(eventArgs);
		}

	};

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

// Thanks to: http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
// Returns null when no support is found 
PandaCarousel.prototype.getStyleProperty = function(prefixes) {

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

};

PandaCarousel.prototype.updateChildren = function() {

	this.dispatchEvent("preupdatechildren");

	this.setChildren(Array.prototype.slice.call(this.element.children, 0));
	
	this.dispatchEvent("postupdatechildren");

};

PandaCarousel.prototype.setChildren = function(children) {

	this.dispatchEvent("presetchildren");	
	this.dispatchEvent("postsetchildren");	

};

PandaCarousel.prototype.setOffset = function(offset) {

	this.offset = offset;

};

PandaCarousel.prototype.setRelativeOffset = function(delta) {

	this.offset += delta;

};

PandaCarousel.prototype.setOffsetToPage = function(page) {

	this.setOffset(page * 100);

};

PandaCarousel.prototype.setOffsetToCurrentPage = function() {

	this.setOffset(this.currentPage * 100);

};

PandaCarousel.prototype.startAnimation = function() {

	if (this.transitionDurationProperty !== null) {

		for (var c = 0, cl = this.childCount; c < cl; c++) {

			if (this.children[c]) {
				this.children[c].style[this.transitionDurationProperty] = '0.3s';
			}

		}

	}

};

PandaCarousel.prototype.stopAnimation = function() {

	if (this.transitionDurationProperty !== null) {

		for (var c = 0, cl = this.childCount; c < cl; c++) {

			if (this.children[c]) {
				this.children[c].style[this.transitionDurationProperty] = '0s';
			}

		}

	}

};

PandaCarousel.prototype.applyChildStyles = function() {

	for (var c = 0, cl = this.childCount; c < cl; c++) {

		if (this.children[c]) {

			this.children[c].style.left = String(this.childFromLeft[c] - this.offset) + '%';
			this.children[c].style.top = String(this.childFromTop[c]) + '%';

		}

	}

};

PandaCarousel.prototype.undoChildStyles = function() {

	for (var c = 0, cl = this.childCount; c < cl; c++) {

		if (this.children[c]) {

			this.children[c].style.top = null;
			this.children[c].style.left = null;
			this.children[c].style.width = null;
			this.children[c].style.height = null;

		}

	}

};

PandaCarousel.prototype.gotoPage = function(page) {

	if (page >= 0 && page < this.pageCount) {
		
		this.dispatchEvent("pregotopage", page);
		
		this.startAnimation();

		this.currentPage = page;
		this.setOffsetToCurrentPage();
		
		this.dispatchEvent("postgotopage", page);

	}

};

PandaCarousel.prototype.canGoPrevious = function() {

	return ((this.currentPage - 1) >= 0);

};

PandaCarousel.prototype.canGoNext = function() {

	return ((this.currentPage + 1) < this.pageCount);

};

PandaCarousel.prototype.first = function() {

	this.gotoPage(0);

}

PandaCarousel.prototype.next = function() {

	// Room to go next?
	if (this.canGoNext()) {
		this.gotoPage(this.currentPage + 1);
	} else {
		// No, stay on the current child
		this.gotoPage(this.currentPage);
	}

};

PandaCarousel.prototype.previous = function() {

	// Room to go previous?
	if (this.canGoPrevious()) {
		this.gotoPage(this.currentPage - 1);
	} else {
		// No, stay on the current child
		this.gotoPage(this.currentPage);
	}

};

PandaCarousel.prototype.last = function() {

	this.gotoPage(this.pageCount - 1);

};

PandaCarousel.prototype.setLayout = function(childrenPerPage, horizontal) {

	this.childrenPerPage = childrenPerPage;
	this.horizontalLayout = horizontal === false ? false : true;
	this.updateChildren();

};

PandaCarousel.prototype.initEvents = function() {

	var _this = this;

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

};

PandaCarousel.prototype.destroy = function() {

	this.dispatchEvent("predestroy");

	// Remove any style we applied to the children
	this.undoChildStyles();

	// Remove the children (the leaves the elements where they are but removes our reference to them)
	this.setChildren([]);

	// Remove all the browser event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};

	// Cancel the animation
	if (this.requestAnimationFrameId !== null) {

		window.cancelAnimationFrame(this.requestAnimationFrameId);
		this.requestAnimationFrameId = null;

	}

	// Remove any classes that many have been added
	this.removeClass('pandacarousel-live');

	// Finally remove our reference to the main carousel element
	// After this nothing will work properly
	this.element = null;

	this.dispatchEvent("postdestroy");
	
	// Remove all the PandaCarousel event listeners
	this.eventListeners = null;

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