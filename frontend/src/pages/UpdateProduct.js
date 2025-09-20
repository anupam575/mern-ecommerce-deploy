import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../utils/axiosInstance";
import "./style/UpdateProduct.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRedux = useSelector((state) => state.auth.user);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Input fields variable
  const inputFields = [
    { name: "name", label: "Product Name", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
  ];

  // 🔹 Access control
  useEffect(() => {
    if (!userRedux || userRedux.role !== "admin") {
      toast.error("❌ Unauthorized access!");
      navigate("/");
    }
  }, [userRedux, navigate]);

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/v1/admin/product/${id}`);
        const prod = data.product;
        setProductData({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          category: prod.category,
          stock: prod.stock,
        });
        setOldImages(prod.images || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "❌ Error loading product");
      }
    };
    fetchProduct();
  }, [id]);

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/api/v1/categories");
        if (data.success) setCategories(data.categories);
      } catch (err) {
        toast.error("❌ Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previewsArr = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB`);
      } else if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} is not JPG/PNG`);
      } else {
        validFiles.push(file);
        previewsArr.push(URL.createObjectURL(file));
      }
    });

    setNewImages(validFiles);
    setPreviews(previewsArr);
  };

  const uploadImagesToCloudinary = async (images) => {
    const uploaded = [];
    if (!images.length) return uploaded;

    try {
      const sigRes = await API.get("/api/v1/get-signature");
      const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data;
      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = await res.json();
        uploaded.push({ public_id: data.public_id, url: data.secure_url });
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw err;
    }

    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImages = [];
      if (newImages.length) {
        uploadedImages = await uploadImagesToCloudinary(newImages);
      }

      const payload = {
        ...productData,
        images: uploadedImages.length ? uploadedImages : oldImages,
      };

      await API.put(`/api/v1/admin/product/${id}`, payload);
      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-product-container">
      <h2 className="update-heading">✏️ Update Product</h2>
      <form onSubmit={handleSubmit} className="update-form">
        {inputFields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={productData[field.name]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={productData[field.name]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Previews */}
        <div className="preview-container">
          {previews.length
            ? previews.map((src, idx) => (
                <img key={idx} src={src} alt={`Preview ${idx}`} className="preview-img" />
              ))
            : oldImages.map((img, idx) => (
                <img key={idx} src={img.url} alt={`Old ${idx}`} className="preview-img" />
              ))}
        </div>

        {/* 🔹 Button with Spinner */}
        <button type="submit" className="update-button" disabled={loading}>
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
