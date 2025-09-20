import cloudinary from "cloudinary";
import Product from "../models/productModel.js";
import sendToken from "../utils/jwtToken.js";
import { escapeRegex } from "../utils/escapeRegex.js";  // 👈 yaha hona chahiye
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    if (!name || !description || !price || !category || stock === undefined || !images?.length) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including at least one image",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,           // MongoDB ObjectId from frontend select
      stock,
      images,             // array of { public_id, url }
      user: req.user._id, // admin user id
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("❌ Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error while creating product",
    });
  }
};


// ✅ Middleware ensures req.user exists and role is admin
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, stock, images } = req.body;

    // 1️⃣ Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2️⃣ Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can update products" });
    }

    // 3️⃣ Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;  // ✅ handles 0 correctly

    // 4️⃣ Replace images if new ones provided
    if (images?.length) {
      // Delete old images from Cloudinary
      for (let img of product.images) {
        try {
          if (img.public_id) await cloudinary.v2.uploader.destroy(img.public_id);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
      product.images = images; // set new images array from frontend
    }

    // 5️⃣ Track who updated
    product.user = req.user._id;

    // 6️⃣ Save and respond
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};


// Get Admin Products
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get Admin Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//
export const getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("reviews.user", "name email")
      .lean(); // ✅ better performance

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product: {
        ...product,
        inStock: product.stock > 0,
        lowStock: product.stock > 0 && product.stock <= 5,
        isAvailable: product.stock > 0 && product.isActive !== false,
      },
    });
  } catch (error) {
    console.error("Get Product Details Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 8;
    const page = Number(req.query.page) || 1;

    // ✅ Safeguard for empty or missing keyword
    const keyword = req.query.keyword?.trim()
      ? {
          name: {
            $regex: escapeRegex(req.query.keyword.trim()), // sanitize user input
            $options: "i",
          },
        }
      : {};

    const queryCopy = { ...req.query };
    ["keyword", "page", "limit"].forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    const filters = JSON.parse(queryStr);

    const productsCount = await Product.countDocuments();
    const filteredProductsCount = await Product.countDocuments({
      ...keyword,
      ...filters,
    });

    const skip = resultPerPage * (page - 1);
    const products = await Product.find({ ...keyword, ...filters })
      .limit(resultPerPage)
      .skip(skip);

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getProductSuggestions = async (req, res, next) => {
  try {
    // ✅ Safeguard for empty or missing keyword
    const keyword = req.query.keyword?.trim()
      ? {
          name: {
            $regex: escapeRegex(req.query.keyword.trim()), // sanitize input
            $options: "i",
          },
        }
      : {}; // agar keyword empty hai, suggestions ko full product list pe limit 5 apply karega

    const suggestions = await Product.find({ ...keyword })
      .select("name _id") // sirf name aur id chahiye
      .limit(5);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Get Product Suggestions Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // url se id aayegi

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product -- Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create New Review or Update the review
export const createOrUpdateReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Check if already reviewed
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // ✅ Recalculate ratings
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed ? "Review updated" : "Review added",
      reviews: product.reviews,
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get All Reviews of a product with populated user
export const getProductReviews = async (req, res) => {
  try {
    // 🔹 Populate reviews.user to get name and _id
    const product = await Product.findById(req.query.id)
      .populate("reviews.user", "name _id");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 🔹 Optional: if logged in, send back current user's review id
    const myReview = req.user
      ? product.reviews.find(
          (rev) => rev.user._id.toString() === req.user._id.toString()
        )
      : null;

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      myReviewId: myReview ? myReview._id : null, // frontend can show delete button
    });
  } catch (error) {
    console.error("GetProductReviews Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// // ✅ Delete Review
// export const deleteReview = async (req, res) => {pm 
//   try {
//     const product = await Product.findById(req.query.productId);

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     const review = product.reviews.find(
//       (rev) => rev._id.toString() === req.query.id.toString()
//     );

//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     // ✅ Ownership / Role check
//     if (
//       review.user.toString() !== req.user._id.toString() &&
//       req.user.role !== "admin"
//     ) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Not allowed to delete this review" });
//     }

//     // ✅ Filter out review
//     const reviews = product.reviews.filter(
//       (rev) => rev._id.toString() !== req.query.id.toString()
//     );

//     // ✅ Recalculate ratings
//     let avg = 0;
//     reviews.forEach((rev) => (avg += rev.rating));
//     const ratings = reviews.length === 0 ? 0 : avg / reviews.length;

//     const numOfReviews = reviews.length;

//     await Product.findByIdAndUpdate(
//       req.query.productId,
//       { reviews, ratings, numOfReviews },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//       reviews,
//       ratings,
//       numOfReviews,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const deleteReview = async (req, res) => {
  try {
    console.log("Product ID (query):", req.query.productId);
    console.log("Review ID (query):", req.query.id);
    console.log("Logged-in user:", req.user);

    const product = await Product.findById(req.query.productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = product.reviews.find(
      (rev) => rev._id.toString() === req.query.id.toString()
    );
    if (!review) {
      console.log("Review not found");
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Ownership / Role check
    console.log("Review user ID:", review.user.toString());
    console.log("Logged-in user ID:", req.user._id.toString());

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      console.log("User not authorized to delete this review");
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to delete this review" });
    }

    // Filter out review
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    // Recalculate ratings
    let avg = 0;
    reviews.forEach((rev) => (avg += rev.rating));
    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numOfReviews = reviews.length;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, ratings, numOfReviews },
      { new: true, runValidators: true }
    );

    console.log("Review deleted successfully. Updated product:", updatedProduct);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviews,
      ratings,
      numOfReviews,
    });
  } catch (error) {
    console.error("DeleteReview Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get Review Stats
export const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "ProductId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const total = product.reviews.length;
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sumRating = product.reviews.reduce((acc, rev) => {
      breakdown[rev.rating] = (breakdown[rev.rating] || 0) + 1;
      return acc + rev.rating;
    }, 0);

    const average = total === 0 ? 0 : sumRating / total;

    res.status(200).json({
      success: true,
      total,
      average,
      breakdown,
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
