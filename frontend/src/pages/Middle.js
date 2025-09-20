import React, { useState, useEffect, useRef } from "react";
import "./style/middle.css";

function Middle() {
  const slides = [
    { image: '/banner1.jpg', caption: 'Banner 1: Welcome to Our Site' },
    { image: '/banner2.jpg', caption: 'Banner 2: Your Success Partner' },
    { image: '/banner3.jpg', caption: 'Banner 3: Grow With Us' },
    { image: '/banner4.jpg', caption: 'Banner 4: Smart Solutions' },
    { image: '/banner5.jpg', caption: 'Banner 5: Let’s Build Together' },
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  const pauseAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className="banner-slider"
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <img
        src={slides[index].image}
        alt={`Banner ${index + 1}`}
        className="banner-image"
      />
      <div className="banner-caption">{slides[index].caption}</div>

      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>
    </div>
  );
}

export default Middle;
