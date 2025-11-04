import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

import { calcOrderPrices } from "../utils/calcOrderPrices.js";

// ✅ Create New Order (for both COD and Payment)
export const newOrder = async (req, res, next) => {
  try {
    const { shippingInfo, orderItems, paymentInfo } = req.body;

    // Calculate accurate prices again (backend validation)
    const { itemsPrice, taxPrice, shippingFee, totalPrice } = calcOrderPrices(orderItems);

    // Prevent duplicate orders (for paymentIntent IDs)
    const existingOrder = await Order.findOne({
      "paymentInfo.id": paymentInfo.id,
      user: req.user._id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists with this payment ID.",
        order: existingOrder,
      });
    }

    // Create new order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice: shippingFee,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Order
export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found with this Id" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged in user Orders
export const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// All Orders - Admin with Pagination
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price stock")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      success: true,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalAmount,
      orders: orders.map((order) => ({
        _id: order._id,
        user: order.user,
        orderItems: order.orderItems.map((item) => ({
          product: item.product?._id || null,
          name: item.product?.name || "Deleted Product",
          price: item.product?.price || 0,
          quantity: item.quantity,
          currentStock: item.product?.stock ?? 0,
        })),
        shippingInfo: order.shippingInfo,
        paymentInfo: order.paymentInfo,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found with this Id" });

    // Already delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ success: false, message: "Order already delivered" });
    }

    const newStatus = req.body.status;

    // Update stock on Shipped or Delivered
    if (newStatus === "Shipped" || newStatus === "Delivered") {
      for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity, "decrease");
      }
    }

    // Undo stock if order is cancelled
    if (newStatus === "Cancelled") {
      for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity, "increase");
      }
    }

    order.orderStatus = newStatus;
    if (newStatus === "Delivered") order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: `Order ${newStatus.toLowerCase()} successfully` });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock helper function
async function updateStock(productId, quantity, operation = "decrease") {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (operation === "decrease") product.stock -= quantity;
  if (operation === "increase") product.stock += quantity;

  if (product.stock < 0) product.stock = 0;

  await product.save({ validateBeforeSave: false });
}


export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found with this Id" });

    await order.deleteOne();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};