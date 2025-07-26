import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  deleteItemFromCartAsync,
    resetCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { convertDollarToRupees } from "../utils/math";
import Header from "../components/Header";
import { selectLoggedInUser } from "../features/auth/authSlice";
const CartPage = () => {
   const user=useSelector(selectLoggedInUser)
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [cartItems, setcartItems] = useState([]);
  const [totalAmount, settotalAmount] = useState(0)
  useEffect(()=>{
  if (items) {
    const total = items.reduce(
      (amount, item) => item.product.price * item.quantity + amount,
      0
    );
    settotalAmount(total)
  }
  },[items])


  const handleQuantity = (quantity, item) => {
   
    
    dispatch(
      updateCartAsync({
        id: item.id,
        product: item.product.id,
        quantity: +quantity,
      })
    );
  };

  const handleRemove = ( id) => {
    
    dispatch(deleteItemFromCartAsync(id));
  };

  useEffect(() => {
    setcartItems(items);
  }, [items]);

  const resetCartItems = () => {
    dispatch(resetCartAsync(user.id));
    setcartItems([]);
  };

  if (items.length === 0) {
    return (
      <>
      <Header />
      <div
        className="flex h-[70vh] w-screen mt-[80px] flex-col md:flex-row  justify-center items-center gap-4 pb-20"
        style={{ opacity: "1", transition: "none" }}
      >
        <div>
          <img
            className="w-80 rounded-lg p-4 mx-auto"
            src="https://orebishopping.reactbd.com/static/media/emptyCart.230e4848b62fb3cab325.png"
            alt="emptyCart"
          />
        </div>
        <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
          <h1 className="font-titleFont text-xl font-bold uppercase">
            Your Cart feels lonely.
          </h1>
          <p className="text-sm text-center px-10 -mt-2">
            Your Shopping cart lives to serve. Give it purpose - fill it with
            books, electronics, videos, etc. and make it happy.
          </p>
          <NavLink to="/">
            <button className="bg-gray-900 rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
              Continue Shopping
            </button>
          </NavLink>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {items && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={resetCartItems}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.product.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleQuantity(item.quantity>1?item.quantity-1:item.quantity,item)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-500" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantity( item.quantity + 1,item)
                        }
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {convertDollarToRupees((item.product.price * item.quantity).toFixed(2))}
                      </p>
                      <p className="text-sm text-gray-500">
                        {convertDollarToRupees(item.product.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {convertDollarToRupees(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {convertDollarToRupees((totalAmount*0.01).toFixed(2))}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {convertDollarToRupees((totalAmount*1.01).toFixed(2))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-[#262626] text-white py-3 px-4 rounded-lg hover:bg-black transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/"
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default CartPage;
