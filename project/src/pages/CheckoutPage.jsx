import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  
  resetCartAsync,
  selectItems,
} from "../features/cart/cartSlice";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { convertDollarToRupees } from "../utils/math";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Header";
import { selectLoggedInUser, verifyUserAsync } from "../features/auth/authSlice";

const CheckoutPage = () => {
  const user=useSelector(selectLoggedInUser)
  
  
  const stripePromise = loadStripe(
    "pk_test_51RjzBN00hbxx8HuK0lOZcmj2HfN0RXSUtWBF3Y6RCOFalvoQZhiw7iEGwtnsR6kzXV41eJbEKiF31b5KxIJKE6jI00GHE8dmMG"
  );
  const dispatch = useDispatch();
  const items = useSelector(selectItems);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    if (savedStep) {
      setStep(Number(savedStep));
      localStorage.removeItem("checkoutStep"); // clear after reading
    }

  }, []);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const handleAddress = (addresses) => {
    setSelectedAddress(addresses);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [totalAmount, settotalAmount] = useState(0);
  useEffect(() => {
    if (items) {
      const total = items.reduce(
        (amount, item) => item.product.price * item.quantity + amount,
        0
      );
      settotalAmount(total);
    }
  }, [items]);

  const [paymentMethod, setpaymentMethod] = useState("cash");
  const [addresses, setaddresses] = useState([
    {
      address: "near",
      city: "sikar",
      email: "tanishsoni0415@gmail.com",
      firstName: "tanish",
      lastName: "soni",
      phone: "9587139325",
      state: "rajasthan",
      zipCode: "332311",
    },
  ]);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleCheckout = async () => {
    if (selectedAddress && step == 1) {
      

      try {
        setisloading(true);
        
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        });

        const data = await res.json();
       
        setisloading(false);
        localStorage.setItem("checkoutStep", "3");

        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({
            totalAmount,
            paymentMethod,
            selectedAddress,
            id:user.id
          })
        );
         localStorage.setItem(
          "order",
          JSON.stringify({
            total:totalAmount,
            shippingAddress:selectedAddress,
            user:user.id,
            items,


          })
        );

        window.location.href = data.url;
      } catch (err) {
        console.error("Checkout error:", err);
        alert("Something went wrong");
      }
    } else {
      toast.error("Please select an address before continuing!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };
  const [isloading, setisloading] = useState(false);

  const handleOrder = async () => {
   
    const paymentData = localStorage.getItem("paymentInfo");
    const sorder = localStorage.getItem("order");
    if (step == 3 && paymentData && sorder) {
     

      try {
        
        const { totalAmount, paymentMethod, selectedAddress,id } = JSON.parse(paymentData);
        dispatch(resetCartAsync(id));
        const sendingOrder = JSON.parse(sorder);
        const order = { totalAmount, paymentMethod, selectedAddress };
        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/c`, {
          method: "POST",
          body: JSON.stringify(sendingOrder),
          headers: { "content-type": "application/json" },
        });
        
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order`, {
          method: "POST",
          body: JSON.stringify(order),
          headers: { "content-type": "application/json" },
        });
        
        setStep(3);
        dispatch(resetCartAsync(id));
        localStorage.removeItem("paymentInfo");
        localStorage.removeItem("order");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    handleOrder();
  }, [step]);

  const subtotal = totalAmount;
  const tax = subtotal * 0.01;
  const total = subtotal + tax;

  if (items.length === 0 && step !== 3) {
    return (
      <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-primary-600 text-white" : "bg-gray-200"
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="ml-2 text-sm font-medium">Shipping</span>
          </div>
          <div
            className={`h-px bg-gray-300 flex-1 ${
              step >= 2 ? "bg-primary-600" : ""
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-primary-600 text-white" : "bg-gray-200"
              }`}
            >
              {step > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </div>
          <div
            className={`h-px bg-gray-300 flex-1 ${
              step >= 3 ? "bg-primary-600" : ""
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 3 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? "bg-primary-600 text-white" : "bg-gray-200"
              }`}
            >
              {step >= 3 ? <Check className="h-4 w-4" /> : "3"}
            </div>
            <span className="ml-2 text-sm font-medium">Complete</span>
          </div>
        </div>
      </div>

      {step === 3 ? (
        // Order Confirmation
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit((data) => {
                // e.preventDefault();
                

                setaddresses([...addresses, data]);
                reset();
                // if (step === 1) {
                //   setStep(2);
                // } else {
                //   // Simulate order processing
                //   setTimeout(() => {
                //     resetCartItems();
                //     setStep(3);
                //   }, 1000);
                // }
              })}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("firstName", {
                          required: "firstName is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName")}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "email is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "phone is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        {...register("address", {
                          required: "address is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        {...register("city", {
                          required: "city is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        {...register("state", {
                          required: "state is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        {...register("zipCode", {
                          required: "zipCode is required",
                        })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>
                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Addresses
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Choose from Existing addresses
                      </p>
                      <ul role="list">
                        {addresses &&
                          addresses.map((address, index) => (
                            <li
                              key={index}
                              className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                            >
                              <div className="flex gap-x-4">
                                <input
                                  onChange={() => handleAddress(address)}
                                  name="address"
                                  type="radio"
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <div className="min-w-0 flex-auto">
                                  <p className="text-sm font-semibold leading-6 text-gray-900">
                                    {address.firstName + address.lastName}
                                  </p>
                                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                    {address.address}
                                  </p>
                                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                    {address.zipCode}
                                  </p>
                                </div>
                              </div>
                              <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <p className="text-sm leading-6 text-gray-900">
                                  Phone: {address.phone}
                                </p>
                                <p className="text-sm leading-6 text-gray-500">
                                  {address.city}
                                </p>
                                <p className="text-sm leading-6 text-gray-500">
                                  {address.state}
                                </p>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {convertDollarToRupees(
                      (item.product.price * item.quantity).toFixed(2)
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {convertDollarToRupees(subtotal.toFixed(2))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>{convertDollarToRupees(total.toFixed(2))}</span>
              </div>
            </div>

            {step === 1 && (
              <>
                <div className="mt-6">
                  {!isloading ? (
                    <div
                      onClick={handleCheckout}
                      className="flex items-center hover:cursor-pointer justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-black"
                    >
                      Pay and Order
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm  hover:bg-black">
                      Processing...
                    </div>
                  )}
                </div>
                <div className=" flex justify-center text-center text-sm text-gray-500">
                  <p className="flex gap-1">
                    or
                    <NavLink to="/">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </NavLink>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CheckoutPage;
