import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../features/cart/cartSlice';
import { convertDollarToRupees } from '../utils/math';
import { selectLoggedInUser } from '../features/auth/authSlice';
const ProductCard = ({ product }) => {
  const user=useSelector(selectLoggedInUser)
const dispatch=useDispatch();
 const handleAddToCart =async (e) => {
      e.preventDefault();
       if (!user) {
      toast.error("Please log in to add items to cart!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }
    const newItem = {
      product: product.id,
      quantity: 1,
      user: user.id,
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
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">

        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>


        <div className="p-4">
          

          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {convertDollarToRupees(product.price)}
              </span>
              {convertDollarToRupees(product.originalPrice) && (
                <span className="text-sm text-gray-500 line-through">
                  {convertDollarToRupees(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
<div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-primary-600 bg-primary-50  py-1 rounded">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;