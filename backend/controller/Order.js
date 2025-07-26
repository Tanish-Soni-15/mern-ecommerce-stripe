import jwt from "jsonwebtoken";
import { Order } from "../model/Order.js";
import { User } from "../model/User.js";

const createOrder = async (req, res) => {
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const { total, items, shippingAddress, user } = req.body;
  const orderId = "ORD-" + Date.now();
  const order = new Order({
    id: orderId,
    date: new Date(),
   
    total,
    items,
    shippingAddress,
    user,
    trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
    estimatedDelivery: estimatedDelivery,
  });
  try {
    const docs = await order.save();
    const result = await docs.populate("user");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const fetchAllOrdersById = async (req, res) => {
  try {

    const token = req.cookies?.token;


    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      
      
      const data = jwt.verify(token, "shhhhh");
      
      const resp = await User.findOne({ email: data.email });
      
      if (resp.isVerified == "true") {
        const result = await Order.find({ user: resp?._id });

        res.status(202).json(result);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

export { createOrder, fetchAllOrdersById };
