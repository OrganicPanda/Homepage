(function() {

	var galleryCarousel;

	var createGalleryCarousel = function() {

		galleryCarousel = new PandaCarousel(document.getElementById('gallery'), {
			//childrenPerPage : 4,
			// previousButton : document.getElementById('gallery-previous'),
			// nextButton : document.getElementById('gallery-next'),
			plugins : [
				//PandaCarouselSwipePlugin,
				PandaCarouselButtonsPlugin,
				//PandaCarouselBasicLayoutPlugin
				PandaCarouselSlideLayoutPlugin
			]
		});

	};

	var createButton = document.getElementById('gallery-create');
	createButton.addEventListener("click", createGalleryCarousel);

	var destroyButton = document.getElementById('gallery-destroy');
	destroyButton.addEventListener("click", function() {

		if (galleryCarousel) {
			galleryCarousel.destroy();
			galleryCarousel = null;
		}

	});
	
	createGalleryCarousel();

})();