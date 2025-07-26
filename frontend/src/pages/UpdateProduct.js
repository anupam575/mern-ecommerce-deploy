import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style/UpdateProduct.css"; // ✅ External CSS file

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/product/${id}`
        );
        const prod = data.product;
        setProductData({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          images: [],
        });
        setImagePreview(prod.images[0]?.url);
      } catch (err) {
        alert("Error loading product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setProductData({ ...productData, images: [reader.result] });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:4000/api/v1/admin/product/${id}`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      alert("✅ Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Error updating product");
    }
  };

  return (
    <div className="update-product-container">
      <h2 className="update-heading">✏️ Update Product</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="form-input"
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
          className="form-textarea"
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="form-input"
        />
        <input
          type="number"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          className="form-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-file"
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-img" />
          </div>
        )}
        <button type="submit" className="update-button">
          🔄 Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
