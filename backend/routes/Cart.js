import express from "express";
import { addToCart, deleteItem, fetchItemsByUser, updateItem } from "../controller/Cart.js";
const cartRouter=express.Router();

cartRouter.get('/',fetchItemsByUser)
.post('/',addToCart)
.delete('/:id',deleteItem)
.patch("/:id",updateItem)

export {cartRouter};