import express from "express";
import mongoose from "mongoose";
import { router } from "./routes/Product.js";
import cors from 'cors'
import { cartRouter } from "./routes/Cart.js";
import { orderRouter } from "./routes/Order.js";
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import { paymentRouter } from "./routes/Payment.js";
import { authRouter } from "./routes/Auth.js";
import cookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const server = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Database connected");

}

server.use(cookieParser());
server.use(express.static(path.join(__dirname, "build")));
const allowedOrigins = [
  "https://mern-ecommerce-stripe.vercel.app",
  process.env.CLIENT_URL
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
server.use(express.json());

server.use('/products', router);
server.use('/cart',cartRouter)
server.use('/order',orderRouter)
server.use('/payment',paymentRouter)
server.use('/',authRouter)
server.get('/', (req, res) => {
  res.json({ succes: "done" });
})

server.listen(8081, () => {
  console.log("server started");
  console.log("http://localhost:8081/");
})