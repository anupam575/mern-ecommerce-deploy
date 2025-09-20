import React from "react";
import "./style/featured.css";

// 🖼️ Import category images
import cat1 from "../images/product1.jpg";
import cat2 from "../images/product2.jpg";
import cat3 from "../images/product3.jpg";
import cat4 from "../images/product4.jpg";

// 🧾 Categories Data
const categories = [
  { id: 1, name: "Headphones", image: cat1 },
  { id: 2, name: "Watches", image: cat2 },
  { id: 3, name: "Shoes", image: cat3 },
  { id: 4, name: "Gaming", image: cat4 },
];

//

function FeaturedProducts() {
  return (
    <div className="shop-section">
      {/* 🔹 Shop by Category */}
      <div className="category-section">
        <h2 className="section-title">FeaturedProducts</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat.id}>
              <img src={cat.image} alt={cat.name} className="category-img" />
              <h3 className="category-name">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}

export default FeaturedProducts;
