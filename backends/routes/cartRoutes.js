// backends/routes/cartRoutes.js
import express from "express";
import { isAuthenticatedUser } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/cart", isAuthenticatedUser, getCart);
router.post("/cart", isAuthenticatedUser, addToCart);
router.put("/cart/update", isAuthenticatedUser, updateCartQuantity);
router.delete("/cart/:id", isAuthenticatedUser, removeCartItem);

export default router;
