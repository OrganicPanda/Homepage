function PandaCarousel(element, childrenPerPage) {

	// Some browsers are still behind a prefix and some have no support at all.
	// Grab the best properties we can
	this.transitionDurationProperty = this.getStyleProperty(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration', 'msTransitionDuration', 'KhtmlTransitionDuration']);

	this.element = element;
	this.cacheElementWidth = 0;
	this.cacheElementHeight = 0;
	this.updateDimensions();

	this.listeners = [];
	this.requestAnimationFrameId = null;

	this.childrenPerPage = (childrenPerPage === undefined) ? 1 : childrenPerPage;
	this.horizontalLayout = true;
	this.childCount = 0;
	this.childWidth = [];
	this.childHeight = [];
	this.childFromTop = [];
	this.childFromLeft = [];
	this.pages = [];
	this.pageCount = 0;
	this.pageWidth = 0;
	this.pageHeight = 0;

	this.currentPage = 0;
	this.offset = 0;
	this.snapPercent = 15;

	this.debug = function() {
		var debugElement = document.getElementById('debug');
		if (debugElement) {
			var d = new Date().toUTCString();
			debugElement.innerHTML = d + ": " + Array.prototype.slice.call(arguments).join(", ") + "</br>" + debugElement.innerHTML;
		}
	};

	// Pointers encapsulate the other stuff so check for them
	if (window.navigator.msPointerEnabled) {

		this.events = [

			// Events for starting
			"MSPointerDown",

			// Events for continuing
			"MSPointerMove",

			// Events for ending
			"MSPointerUp", "MSPointerCancel", "MSPointerOut"

		];

	} else {

		this.events = [

			// Events for starting
			"touchstart", "mousedown",

			// Events for continuing
			"touchmove", "mousemove",

			// Events for ending
			"touchend", "touchcancel", "touchleave", "mouseup", "mouseleave", "mouseout"

		];

	}

	this.lastXY = {};
	this.distanceXY = {};
	this.axisLocked = false;
	this.AXIS_X = 0;
	this.AXIS_Y = 1;
	this.axis = this.AXIS_X;

	// We are now live
	this.addClass('pandacarousel-live');

	this.previousButton = null;
	this.nextButton = null;
	this.addButtons();

	this.updateChildren();

	this.initEvents();

};

PandaCarousel.prototype.updateDimensions = function() {

	this.cacheElementWidth = this.element.offsetWidth;
	this.cacheElementHeight = this.element.offsetHeight;

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

	this.setChildren(Array.prototype.slice.call(this.element.children, 0));
	this.updateButtons();

};

PandaCarousel.prototype.setChildren = function(children) {

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

		this.startAnimation();

		this.currentPage = page;
		this.setOffsetToCurrentPage();

		this.updateButtons();

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

PandaCarousel.prototype.addButtons = function() {

	this.previousButton = document.createElement('button');
	this.nextButton = document.createElement('button');

	this.previousButton.className = 'previous';
	this.nextButton.className = 'next';

	this.previousButton.innerHTML = '‹';
	this.nextButton.innerHTML = '›';

	this.element.parentNode.appendChild(this.previousButton);
	this.element.parentNode.appendChild(this.nextButton);

};

PandaCarousel.prototype.removeButtons = function() {

	// You should also remove the events!

	// Make sure the buttons are connected to the DOM first
	if (this.previousButton.parentNode === this.element.parentNode) {
		this.element.parentNode.removeChild(this.previousButton);
	}
	if (this.nextButton.parentNode === this.element.parentNode) {
		this.element.parentNode.removeChild(this.nextButton);
	}

	this.previousButton = null;
	this.nextButton = null;

};

PandaCarousel.prototype.updateButtons = function() {

	if (this.canGoPrevious()) {

		this.addClass('pandacarousel-with-previous');

	} else {

		this.removeClass('pandacarousel-with-previous');

	}

	if (this.canGoNext()) {

		this.addClass('pandacarousel-with-next');

	} else {

		this.removeClass('pandacarousel-with-next');

	}

	// These classes may have introduced styles that changed the width of the carousel
	this.updateDimensions();

};

PandaCarousel.prototype.setLayout = function(childrenPerPage, horizontal) {

	this.childrenPerPage = childrenPerPage;
	this.horizontalLayout = horizontal === false ? false : true;
	this.updateChildren();

};

PandaCarousel.prototype.initEvents = function() {

	var _this = this;

	for (var e = 0, el = this.events.length; e < el; e++) {
		this.listeners.push([this.element, this.events[e],
			function(e) {
				_this.handleEvent(e);
			},
			false
		]);
	}

	this.listeners.push([window, 'resize',
		function(e) {
			_this.updateDimensions();
		},
		false
	]);

	this.listeners.push([this.previousButton, 'click',
		function() {
			_this.previous();
		},
		false
	]);
	this.listeners.push([this.nextButton, 'click',
		function() {
			_this.next();
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

	// Remove any style we applied to the children
	this.undoChildStyles();

	// Remove the children (the leaves the elements where they are but removes our reference to them)
	this.setChildren([]);

	// Remove all the event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};

	// Cancel the animation
	if (this.requestAnimationFrameId !== null) {

		window.cancelAnimationFrame(this.requestAnimationFrameId);
		this.requestAnimationFrameId = null;

	}

	// Remove the buttons
	this.removeButtons();

	// Remove any classes that many have been added
	this.removeClass('pandacarousel-live');
	this.removeClass('pandacarousel-with-previous');
	this.removeClass('pandacarousel-with-next');

	// Finally remove our reference to the main carousel element
	// After this nothing will work properly
	this.element = null;

};

// ne to: http://blogs.msdn.com/b/ie/archive/2011/10/19/handling-multi-touch-and-mouse-input-in-all-browsers.aspx
PandaCarousel.prototype.handleEvent = function(eventObject) {

	// If we have an array of changedTouches, use it, else create an array of one with our eventObject
	var touchPoints = (typeof eventObject.changedTouches != 'undefined') ? eventObject.changedTouches : [eventObject];
	for (var i = 0; i < touchPoints.length; ++i) {

		var touchPoint = touchPoints[i];

		// Pick up the unique touchPoint id if we have one or use 1 as the default
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;

		if (eventObject.type.match(/(down|start)$/i)) {

			// Process mousedown, MSPointerDown, and touchstart
			this.lastXY[touchPointId] = {
				x: touchPoint.pageX,
				y: touchPoint.pageY
			};
			this.startDraw(eventObject, touchPointId, touchPoint.pageX, touchPoint.pageY, 0, 0);

		} else if (eventObject.type.match(/move$/i)) {

			// Process mousemove, MSPointerMove, and touchmove
			if (this.lastXY[touchPointId] && !(this.lastXY[touchPointId].x == touchPoint.pageX && this.lastXY[touchPointId].y == touchPoint.pageY)) {
				var cacheLastXY = this.lastXY[touchPointId];
				this.lastXY[touchPointId] = {
					x: touchPoint.pageX,
					y: touchPoint.pageY
				};
				this.extendDraw(
					eventObject,
					touchPointId,
					touchPoint.pageX,
					touchPoint.pageY,
					touchPoint.pageX - cacheLastXY.x,
					touchPoint.pageY - cacheLastXY.y);
			}

		} else if (eventObject.type.match(/(cancel|leave|up|end|lost|out)$/i)) {

			if (this.lastXY[touchPointId]) {

				// Mouseout needs to be verified first as it can fire when passing in to/out of child elements
				if (eventObject.type === "mouseout") {

					var relTarget = eventObject.relatedTarget;

					// Exit early if we haven't actually left the element
					if (this.element === relTarget || relTarget === null) {
						return;
					}
					while (relTarget && relTarget !== this.element) {
						relTarget = relTarget.parentNode;
					}
					if (this.element === relTarget) {
						return;
					}

				}

				// Process mouseup, MSPointerUp, and touchend
				delete this.lastXY[touchPointId];
				this.endDraw(eventObject, touchPointId);

			}

		}

	}

};

PandaCarousel.prototype.startDraw = function(eventObject, id, x, y) {

	// Turn animation off during draw
	this.stopAnimation();

	// Start recording the distance
	this.distanceXY[id] = {
		x: 0,
		y: 0
	};

};

PandaCarousel.prototype.extendDraw = function(eventObject, id, x, y, deltaX, deltaY) {

	// Add on the movement
	this.distanceXY[id].x += deltaX;
	this.distanceXY[id].y += deltaY;

	if ((this.distanceXY[id].x > 5 || this.distanceXY[id].x < -5) && this.axisLocked == false) {

		this.axis = (Math.abs(this.distanceXY[id].y) > Math.abs(this.distanceXY[id].x)) ? this.AXIS_Y : this.AXIS_X;

		this.axisLocked = true;

	}

	// Only take action if the axis is locked to X
	if (this.axisLocked && this.axis == this.AXIS_X) {

		// Stop panning and zooming so we can draw
		if (eventObject.preventManipulation) {
			eventObject.preventManipulation();
		}

		// We are handling this event
		if (eventObject.preventDefault) {
			eventObject.preventDefault();
		}

		this.setRelativeOffset(-((deltaX / this.cacheElementWidth) * 100));

	}

};

PandaCarousel.prototype.endDraw = function(eventObject, id) {

	// Only take action if the axis is locked to X
	if (this.axisLocked && this.axis == this.AXIS_X) {

		// Stop panning and zooming so we can draw
		if (eventObject.preventManipulation) {
			eventObject.preventManipulation();
		}

		// We are handling this event
		if (eventObject.preventDefault) {
			eventObject.preventDefault();
		}

		// Did we move enough?
		if (((Math.abs(this.distanceXY[id].x) / this.cacheElementWidth) * 100) > this.snapPercent) {

			// Yes! Which way was the swipe?
			// Move in that direction
			if (this.distanceXY[id].x > 0) {
				this.previous();
			} else {
				this.next(); 
			}

		} else {

			// No, stay on the current page
			this.gotoPage(this.currentPage);

		}

	}

	// End this touch
	this.axisLocked = false;
	delete this.distanceXY[id];

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