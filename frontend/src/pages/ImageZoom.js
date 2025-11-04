import React, { useState, useRef } from "react";
import "./ImageZoom.css";

const ImageZoom = ({ src }) => {
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef();

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPos({ x, y });
  };

  return (
    <div
      className="zoom-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img src={src} ref={imageRef} alt="Product" className="zoom-image" />
      {showZoom && imageRef.current && (
        <div
          className="zoom-result"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${(zoomPos.x / imageRef.current.offsetWidth) * 100}% ${
              (zoomPos.y / imageRef.current.offsetHeight) * 100
            }%`,
            backgroundSize: `${imageRef.current.offsetWidth * 2}px ${
              imageRef.current.offsetHeight * 2
            }px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
