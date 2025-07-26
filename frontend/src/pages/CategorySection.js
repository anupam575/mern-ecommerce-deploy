import React from "react";
import "./style/category.css";

// 🖼️ Image imports from src/images
import menImg from "../images/men.jpg";
import womenImg from "../images/women.jpg";
import electronicsImg from "../images/electronics.jpg";
import homeImg from "../images/home.jpg";

const categories = [
  {
    name: "Men's Fashion",
    image: menImg,
  },
  {
    name: "Women's Fashion",
    image: womenImg,
  },
  {
    name: "Electronics",
    image: electronicsImg,
  },
  {
    name: "Home Appliances",
    image: homeImg,
  },
];

function CategorySection() {
  return (
    <div className="category-section">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.name} className="category-img" />
            <h3 className="category-name">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
