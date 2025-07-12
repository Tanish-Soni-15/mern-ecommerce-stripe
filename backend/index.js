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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const server = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Database connected");

}
server.use(express.static(path.join(__dirname, "build")));
server.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
server.use(express.json());

server.use('/products', router);
server.use('/cart',cartRouter)
server.use('/order',orderRouter)
server.use('/payment',paymentRouter)
server.get('/', (req, res) => {
  res.json({ succes: "done" });
})

server.listen(8081, () => {
  console.log("server started");
  console.log("http://localhost:8081/");
})