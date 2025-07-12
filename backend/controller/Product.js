import {Product} from "../model/Product.js";

  const fetchAllProducts = async (req, res) => {
   
    let query = Product.find({});
  
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }
    const totalDocs = await Product.countDocuments(query.getFilter());
    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
  
    try {
      const docs = await query.exec();
      res.set({
        'X-Total-Count': totalDocs,
        'Access-Control-Expose-Headers': 'X-Total-Count'
      });
      res.status(200).json(docs);
      
    } catch (err) {
      res.status(400).json(err);
    }
  };
  const fetchProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
      
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  
  export {fetchAllProducts,fetchProductById} ;