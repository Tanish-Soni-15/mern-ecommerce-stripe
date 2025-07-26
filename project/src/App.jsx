import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Account from "./pages/Account";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser, verifyUserAsync } from "./features/auth/authSlice";
import { fetchItemsByUserIdAsync } from "./features/cart/cartSlice";
import OrdersPage from "./pages/OrdersPage";
import Protected from "./components/Protected";
function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(verifyUserAsync());
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync(user.id))
      
    }
  }, [dispatch, user])
  return (
    <CartProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<Protected><CartPage /></Protected>} />
            <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            
            <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
            <Route
              path="/account"
              element={<Protected><Account  /></Protected>}
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
