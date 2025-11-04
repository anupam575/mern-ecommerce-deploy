export const calcOrderPrices = (items, shippingFee = 0, taxRate = 0.18) => {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("⚠️ calcOrderPrices: items array empty or invalid", items);
    return { itemsPrice: 0, taxPrice: 0, shippingFee, totalPrice: 0 };
  }

  const itemsPrice = items.reduce((acc, item, index) => {
    const price = Number(item.price ?? item.product?.price); // ✅ fallback added
    const qty = Number(item.quantity);

    if (isNaN(price) || isNaN(qty)) {
      console.warn(`⚠️ Invalid item at index ${index}:`, item);
      return acc;
    }

    return acc + price * qty;
  }, 0);

  const taxPrice = +(itemsPrice * taxRate).toFixed(2);
  const totalPrice = +(itemsPrice + taxPrice + Number(shippingFee)).toFixed(2);

  console.log("✅ calcOrderPrices result:", { itemsPrice, taxPrice, shippingFee, totalPrice });

  return { itemsPrice, taxPrice, shippingFee, totalPrice };
};
