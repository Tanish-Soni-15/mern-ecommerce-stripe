import express from "express";
import { sendConfirmationEmail } from "../controller/OrderSuccess.js";
import { createOrder, fetchAllOrdersById } from "../controller/Order.js";
const orderRouter=express.Router();
orderRouter.post('/',sendConfirmationEmail);
orderRouter.get('/',fetchAllOrdersById)
orderRouter.post('/c',createOrder);

export {orderRouter};