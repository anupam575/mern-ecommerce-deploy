import Stripe from "stripe";
import { calcOrderPrices } from "../utils/calcOrderPrices.js";

// ✅ Process Payment (Stripe)
export const processPayment = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // frontend से expected body: { items: [{ price, quantity }], shippingFee }
    const { items, shippingFee = 0 } = req.body;

    // centralized calculation (utility से)
    const { itemsPrice, taxPrice, totalPrice } = calcOrderPrices(
      items,
      shippingFee,
      0.18
    );

    // sanity check before Stripe call
    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      console.error("❌ Invalid totalPrice detected:", totalPrice);
      return res
        .status(400)
        .json({ success: false, message: "Invalid total price for payment." });
    }

    // Stripe expects amount in paise
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "inr",
      metadata: { company: "Ecommerce" },
    });

    console.log("✅ PaymentIntent created:", paymentIntent.id);

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
      orderSummary: { itemsPrice, taxPrice, shippingFee, totalPrice },
    });
  } catch (error) {
    console.error("Payment Processing Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Send Stripe API Key
export const sendStripeApiKey = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (error) {
    console.error("Stripe API Key Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

export default { processPayment, sendStripeApiKey };
