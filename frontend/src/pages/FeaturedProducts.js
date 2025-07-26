import React from "react";
import "./style/featured.css";

// 🖼️ Import product images from src/images/
import product1 from "../images/product1.jpg";
import product2 from "../images/product2.jpg";
import product3 from "../images/product3.jpg";
import product4 from "../images/product4.jpg";

// 🧾 Product Data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    image: product1,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2999,
    image: product2,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 3499,
    image: product3,
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 999,
    image: product4,
  },
];

function FeaturedProducts() {
  return (
    <div className="featured-section">
      <h2 className="section-title">Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-img" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price}</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
