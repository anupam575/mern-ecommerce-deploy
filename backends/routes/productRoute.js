import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createOrUpdateReview,
  getProductReviews,
  getAdminProducts,
  getReviewStats,
  deleteReview,
  getProductById,
  getProductSuggestions,
   toggleProductActive
} from "../controllers/productController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js"; // ✅ use only these

const router = express.Router();

// Public products list
router.route("/products").get(getAllProducts);

// Admin products list
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// CREATE PRODUCT
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// ✅ GET single product by ID (Admin)
router
  .route("/admin/product/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProductById)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Public product details
router.route("/product/:id").get(getProductDetails);
router.patch("/:id/active", toggleProductActive);

// Reviews
router.route("/review").put(isAuthenticatedUser, createOrUpdateReview);
router.route("/review").delete(isAuthenticatedUser, deleteReview);
router.route("/reviews").get(getProductReviews);
router.route("/reviews/stats").get(getReviewStats);
router.get("/products/suggestions", getProductSuggestions);

export default router;
