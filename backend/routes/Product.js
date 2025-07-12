import express from "express";
import {  fetchAllProducts, fetchProductById } from "../controller/Product.js";

const router=express.Router();

router.get('/',fetchAllProducts)
.get('/:id',fetchProductById)
export {router};