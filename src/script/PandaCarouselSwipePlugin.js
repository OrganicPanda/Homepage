function PandaCarouselSwipePlugin(carousel, options) {

	// Store a reference to the PandaCarousel instance
	this.carousel = carousel;	
	this.options = options || {};

	this.initEvents();
	
	this.preDestroyEventId = this.carousel.addEventListener("predestroy", this.destroy.bind(this));
	
};

PandaCarouselSwipePlugin.prototype.initEvents = function() {

	this.lastXY = {};
	this.distanceXY = {};
	this.axisLocked = false;
	this.AXIS_X = 0;
	this.AXIS_Y = 1;
	this.axis = this.AXIS_X;
	this.swipeSnapPercent = (this.options.swipeSnapPercent === undefined) ? 15 : this.options.swipeSnapPercent;
	
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

	var _this = this;
	this.listeners = [];
	
	for (var e = 0, el = this.events.length; e < el; e++) {
		this.listeners.push([this.carousel.element, this.events[e],
			function(e) {
				_this.handleEvent(e);
			},
			false
		]);
	}
	
	for (var l = this.listeners.length - 1; l >= 0; l--) {
		this.listeners[l][0].addEventListener(this.listeners[l][1], this.listeners[l][2], this.listeners[l][3]);
	};

};

// ne to: http://blogs.msdn.com/b/ie/archive/2011/10/19/handling-multi-touch-and-mouse-input-in-all-browsers.aspx
PandaCarouselSwipePlugin.prototype.handleEvent = function(eventObject) {

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
					if (this.carousel.element === relTarget || relTarget === null) {
						return;
					}
					while (relTarget && relTarget !== this.carousel.element) {
						relTarget = relTarget.parentNode;
					}
					if (this.carousel.element === relTarget) {
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

PandaCarouselSwipePlugin.prototype.startDraw = function(eventObject, id, x, y) {

	// Turn animation off during draw
	this.carousel.stopAnimation();

	// Start recording the distance
	this.distanceXY[id] = {
		x: 0,
		y: 0
	};

};

PandaCarouselSwipePlugin.prototype.extendDraw = function(eventObject, id, x, y, deltaX, deltaY) {

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

		this.carousel.setRelativeOffset(-((deltaX / this.carousel.cacheElementWidth) * 100));

	}

};

PandaCarouselSwipePlugin.prototype.endDraw = function(eventObject, id) {

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
		if (((Math.abs(this.distanceXY[id].x) / this.carousel.cacheElementWidth) * 100) > this.swipeSnapPercent) {

			// Yes! Which way was the swipe?
			// Move in that direction
			if (this.distanceXY[id].x > 0) {
				this.carousel.previous();
			} else {
				this.carousel.next(); 
			}

		} else {

			// No, stay on the current page
			this.carousel.gotoPage(this.carousel.currentPage);

		}

	}

	// End this touch
	this.axisLocked = false;
	delete this.distanceXY[id];

};

PandaCarouselSwipePlugin.prototype.destroy = function() {

	this.carousel.removeEventListener("predestroy", this.preDestroyEventId);

	// Remove all the event listeners
	var listener;
	while (listener = this.listeners.pop()) {

		listener[0].removeEventListener(listener[1], listener[2]);

	};
	
};