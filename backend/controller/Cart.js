import { Cart } from "../model/Cart.js";

const addToCart = async (req, res) => {
    const item = new Cart(req.body);
    try {
        const docs = await item.save()
        const result = await docs.populate('product');
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
}

const fetchItemsByUser = async (req, res) => {
    const { user } = req.query;
   
    
    try {
        const cartItems = await Cart.find({ user: user }).populate("product");
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(400).json(error);
    }
}
const deleteItem=async (req,res)=>{
    const { id } = req.params;
    
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
const updateItem=async (req,res)=>{
    const { id } = req.params;
    
    
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result=await cart.populate('product')
    
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};



export { addToCart ,fetchItemsByUser,deleteItem,updateItem};