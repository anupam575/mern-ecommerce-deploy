import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// CREATE
router.post("/admin/category/new", createCategory);

// READ
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

// UPDATE
router.put("/admin/category/:id", updateCategory);

// DELETE
router.delete("/admin/category/:id", deleteCategory);

export default router;
