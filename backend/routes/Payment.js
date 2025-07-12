import express from "express";
import { payment } from "../controller/payments.js";
const paymentRouter=express.Router();
paymentRouter.post('/',payment);

export {paymentRouter};