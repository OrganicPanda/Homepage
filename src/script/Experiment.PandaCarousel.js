window.onload = function() {
  'use strict';

  var galleryCarousel
    , createButton = document.getElementById('gallery-create')
    , destroyButton = document.getElementById('gallery-destroy')
    , createGalleryCarousel = function() {

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

  createButton.addEventListener('click', createGalleryCarousel);
  destroyButton.addEventListener('click', function() {
    if (galleryCarousel) {
      galleryCarousel.destroy();
      galleryCarousel = null;
    }
  });

  createGalleryCarousel();
};