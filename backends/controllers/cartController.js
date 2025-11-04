// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/productModel.js";

// 🔹 Get cart for logged-in user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json([]);
    res.json(cart.items);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // ✅ Recommended Method (declare once, assign if null)
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // ❌ Older Method with scope issue (commented out)
    /*
    const existingCart = await Cart.findOne({ user: req.user.id });
    if (!existingCart) {
      const cart = new Cart({ user: req.user.id, items: [] }); // scope problem: cart undefined outside
    }
    */

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    // Save cart and populate product details
    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.json(populatedCart.items);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// export const addToCart = async (req, res) => {
//   const { productId, quantity = 1 } = req.body;

//   try {
//     // 🧩 1️⃣ Find existing cart
//     let cart = await Cart.findOne({ user: req.user.id });

//     // 🧩 2️⃣ If no cart exists, create new one directly (without `new`)
//     if (!cart) {
//       cart = await Cart.create({
//         user: req.user.id,
//         items: [{ product: productId, quantity }],
//       });
//     } else {
//       // 🧩 3️⃣ If cart exists, check if product is already inside
//       const itemIndex = cart.items.findIndex(
//         (item) => item.product.toString() === productId
//       );

//       if (itemIndex > -1) {
//         // Product already in cart → increase quantity
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         // Add new product to cart
//         cart.items.push({ product: productId, quantity });
//       }

//       // 🧩 4️⃣ Save updated cart
//       await cart.save();
//     }

//     // 🧩 5️⃣ Populate product details for response
//     const populatedCart = await cart.populate("items.product");

//     // 🧩 6️⃣ Send response
//     res.status(200).json({
//       success: true,
//       message: "Product added to cart successfully",
//       cart: populatedCart.items,
//     });

//   } catch (error) {
//     console.error("❌ Add to Cart Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error, please try again later",
//     });
//   }
// };


// 🔹 Update cart item quantity
export const updateCartQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i._id.toString() === cartItemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (quantity <= 0) {
      // Remove item safely
      cart.items = cart.items.filter(i => i._id.toString() !== cartItemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart.items);
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Remove cart item
export const removeCartItem = async (req, res) => {
  const { id } = req.params; // cartItem _id
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemExists = cart.items.some(i => i._id.toString() === id);
    if (!itemExists) return res.status(404).json({ message: "Cart item not found" });

    cart.items = cart.items.filter(i => i._id.toString() !== id);

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart.items);
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
