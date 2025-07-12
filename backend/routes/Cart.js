import express from "express";
import { addToCart, deleteItem,fetchAllItems, updateItem } from "../controller/Cart.js";
const cartRouter=express.Router();

cartRouter.get('/',fetchAllItems)
.post('/',addToCart)
.delete('/:id',deleteItem)
.patch("/:id",updateItem)

export {cartRouter};