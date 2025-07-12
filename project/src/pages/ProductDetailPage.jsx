import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByIdAsync, selectedProduct } from '../features/getProducts/productSlice';
import { addToCartAsync } from '../features/cart/cartSlice';
import { convertDollarToRupees } from '../utils/math';
const ProductDetailPage = () => {
  const { id } = useParams();
  const product = useSelector(selectedProduct);
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
   useEffect(() => {
    dispatch(fetchProductByIdAsync(id));
  }, [dispatch,id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

   const handleAddToCart =async (e) => {
      e.preventDefault();
       const newItem = {
      product: product.id,
      quantity: 1,
    };
      try{
        await dispatch(addToCartAsync(newItem)).unwrap();
      toast.success("Product is added to cart!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
          style: {
            backgroundColor: "#28a745",
            color: "white",
            fontWeight: "bold",
          },
        });
      } catch (error) {
        toast.error("Error adding to cart!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.gallery[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            {product.gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">{convertDollarToRupees(product.price)}</span>
            {convertDollarToRupees(product.originalPrice) && (
              <span className="text-xl text-gray-500 line-through">
                {convertDollarToRupees(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Save {(convertDollarToRupees((product.originalPrice - product.price).toFixed(2)))}
              </span>
            )}
          </div>

        

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
<div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-600 bg-primary-50  py-1 rounded">
                {product.category}
              </span>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black border-black border-2 px-6 py-3 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="flex-1 cursor-pointer bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;