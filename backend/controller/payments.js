import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.STRIPE_SECRET_KEY);
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

const payment = async (req, res) => {
console.log("hello");

  const { items, customer_email } = req.body;

  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      line_items,
      mode: "payment",
      customer_email,
      success_url: "http://localhost:5173/checkout/",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {payment};