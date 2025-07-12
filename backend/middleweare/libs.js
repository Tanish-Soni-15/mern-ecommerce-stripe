import nodemailer from "nodemailer";
import { ENV } from "../config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.GOOGLE_ACOUNT_USER,
    pass: ENV.GOOGLE_ACOUNT_PASS,
  },
});
