const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // ✅ अब यहाँ Stripe key properly loaded होगी
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });
  console.log("✅ PaymentIntent created:", myPayment); // ✅ check client_secret

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY, // 👈 यहाँ भी नाम सही करो
  });
});
