(function() {

	var standardCarousel;

	var createStandardCarousel = function() {

		standardCarousel = new PandaCarousel(document.getElementById('standard-carousel'), {
			childrenPerPage : 4,
			/*reviousButton : document.getElementById('standard-carousel-previous'),
			nextButton : document.getElementById('standard-carousel-next'),*/
			plugins : [
				PandaCarouselSwipePlugin,
				PandaCarouselButtonsPlugin
			]
		});

	};

	var createButton = document.getElementById('standard-carousel-create');
	createButton.addEventListener("click", createStandardCarousel);

	var destroyButton = document.getElementById('standard-carousel-destroy');
	destroyButton.addEventListener("click", function() {

		console.log('destroying standardCarousel');

		if (standardCarousel) {
			standardCarousel.destroy();
			standardCarousel = null;
		}

		console.log('destroyed standardCarousel');

	});
	
	createStandardCarousel();

})();