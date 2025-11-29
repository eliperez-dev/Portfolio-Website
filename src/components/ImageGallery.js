import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, altText = "Project gallery image" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="image-gallery">
      <div className="gallery-main">
        <img
          src={images[currentImageIndex]}
          alt={`${altText} ${currentImageIndex + 1}`}
          className="gallery-main-image"
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
              title="Previous"
            >
              ‹
            </button>
            <button 
              className="gallery-nav gallery-next"
              onClick={goToNext}
              aria-label="Next image"
              title="Next"
            >
              ›
            </button>
            
            <div className="gallery-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to image ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  goToImage(index);
                }
              }}
            >
              <img src={image} alt={`${altText} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;