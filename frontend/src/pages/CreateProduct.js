import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import "./style/CreateProduct.css";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/api/v1/categories");
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setImages(validFiles);
    setPreviews(previewsArr);
  };

  // 🔹 Upload images to Cloudinary via backend
  const uploadImagesToCloudinary = async () => {
    const uploaded = [];
    if (!images.length) return uploaded;

    try {
      const sigRes = await API.get("/api/v1/get-signature");
      console.log(sigRes);

      const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data;
      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "Cloudinary upload failed");
        }
        const data = await res.json();
        uploaded.push({ public_id: data.public_id, url: data.secure_url });
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw err;
    }

    return uploaded;
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) return toast.error("Please select at least one image");
    if (!formData.category) return toast.error("Please select a category");

    try {
      setLoading(true);
      const uploadedImages = await uploadImagesToCloudinary();

      const payload = { ...formData, images: uploadedImages };
      const { data } = await API.post("/api/v1/admin/product/new", payload);

      if (data.success) {
        toast.success("Product created successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
        });
        setImages([]);
        setPreviews([]);
      } else toast.error(data.message || "Failed to create product");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Error creating product"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name", label: "Product Name", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
  ];

  return (
    <div className="create-product-wrapper">
      {/* 🔹 Create Product Form */}
      <div className="create-product-container">
        <h2>Create New Product</h2>
        <form onSubmit={handleSubmit} className="create-product-form">
          {inputFields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              name="category"
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

          <div className="form-group">
            <label>Product Images</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {previews.length > 0 && (
            <div className="preview-container">
              {previews.map((dod, idx) => (
                <img
                  key={idx}
                  src={dod}
                  alt={`Preview ${idx}`}
                  className="preview-image"
                />
              ))}
            </div>
          )}

          {/* 🔹 Button with Spinner */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <div className="spinner-wrapper">
                <div className="spinner"></div>
                <span>Creating...</span>
              </div>
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
