import express from "express";
import { sendConfirmationEmail } from "../controller/OrderSuccess.js";
const orderRouter=express.Router();
orderRouter.post('/',sendConfirmationEmail);

export {orderRouter};