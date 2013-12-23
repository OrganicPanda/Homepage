window.onload = function() {

	var galleryCarousel;

	var createGalleryCarousel = function() {

		if (!galleryCarousel) {
			galleryCarousel = new PandaCarousel(document.getElementById('gallery'), {
				previousButton : document.getElementById('gallery-previous'),
				nextButton : document.getElementById('gallery-next'),
				plugins : [
					PandaCarouselSwipePlugin,
					PandaCarouselButtonsPlugin,
					PandaCarouselSlideLayoutPlugin,
					PandaCarouselResizePlugin
				]
			});
		}

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

};