import Stripe from "stripe";

// ✅ Centralized order price calculation (helper function inside same file)
const calcOrderPrices = (items, shippingFee = 0, taxRate = 0.18) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxPrice = +(itemsPrice * taxRate).toFixed(2);
  const totalPrice = itemsPrice + taxPrice + shippingFee;

  return { itemsPrice, taxPrice, shippingFee, totalPrice };
};

// ✅ Process Payment
export const processPayment = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // frontend से expected body: { items: [{ price, quantity }], shippingFee }
    const { items, shippingFee = 0 } = req.body;

    // centralized calculation
    const { itemsPrice, taxPrice, totalPrice } = calcOrderPrices(items, shippingFee, 0.18);

    // Stripe amount = paise
    const myPayment = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "inr",
      metadata: { company: "Ecommerce" },
    });

    console.log("✅ PaymentIntent created:", myPayment);

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
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
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (error) {
    console.error("Stripe API Key Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
