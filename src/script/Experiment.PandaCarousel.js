(function() {

	var standardCarousel;

	var createStandardCarousel = function() {

		standardCarousel = new PandaCarousel(document.getElementById('standard-carousel'), {
			childrenPerPage : 4,
			previousButton : document.getElementById('standard-carousel-previous'),
			nextButton : document.getElementById('standard-carousel-next'),
			plugins : [
				PandaCarouselSwipePlugin,
				PandaCarouselButtonsPlugin,
				PandaCarouselPagedLayoutPlugin
			]
		});

	};

	var createButton = document.getElementById('standard-carousel-create');
	createButton.addEventListener("click", createStandardCarousel);

	var destroyButton = document.getElementById('standard-carousel-destroy');
	destroyButton.addEventListener("click", function() {

		if (standardCarousel) {
			standardCarousel.destroy();
			standardCarousel = null;
		}

	});
	
	createStandardCarousel();

})();