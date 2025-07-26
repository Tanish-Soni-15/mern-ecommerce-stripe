import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser, signOutAsync } from "../features/auth/authSlice";

function Account() {
  const userData = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
        dispatch(signOutAsync());
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    const respone = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete`, {
      method: "GET",
      credentials: "include",
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await respone.json();
    if (respone.ok) {
      setuser(null);
      navigate("/");
    } else {
      setIsLoading(false);
      alert(data.message);
    }
  };

  return (
    <div className="">
      <Header />

      <div className="min-h-screen w-full bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl w-[90%] sm:w-[650px] px-3 py-4 sm:px-6 sm:py-8">
          <div className="text-center mb-12">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Account Settings
            </h1>
            <p className="text-xl text-gray-600">
              Manage your profile and account preferences
            </p>
          </div>

          <div className="w-full flex flex-col gap-8">
            <div className="">
              <div className="card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-blue-600" />
                    Profile Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{userData?.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">
                        {userData?.isVerified
                          ? userData?.email
                          : "guest12@gmail.com"}
                      </span>
                      {userData?.isVerified && (
                        <div className="ml-auto flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full btn-sec flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete your account? This action
                  cannot be undone and all your data will be permanently
                  removed.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
