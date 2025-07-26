import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

function EmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state or default
  const email = location.state?.email || "your-email@example.com";

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerifyEmail = async () => {
    setIsVerifying(true);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkUser`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    

    if (response.ok) {
      setIsVerifying(false);
      setIsVerified(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to analyze page after successful verification
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setIsVerifying(false);
      alert(data.message);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCooldown(60); // 60 seconds cooldown
    sendEmail();
    // Simulate resend email API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message (you could add a toast notification here)
   
  };
  const sendEmail = async () => {
    const data = location.state;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-email`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      
    } else {
      const result = await response.json();
      alert(result.message);
      setIsLoading(false);
    }
  };
  // useEffect(() => {
  //   sendEmail();
  // }, []);
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Your account has been verified. You'll be redirected to the
              dashboard shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Icon and Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-600">We've sent a verification link to</p>
              <p className="text-blue-600 font-medium break-all">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Check your email
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Click the verification link in your email to activate your
                    account. The link will expire in 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleVerifyEmail}
                disabled={isVerifying}
                className={`w-full btn-pri flex items-center justify-center ${
                  isVerifying ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I've Verified My Email
                  </>
                )}
              </button>

              <button
                onClick={handleResendEmail}
                disabled={!canResend}
                className={`w-full btn-sec flex items-center justify-center ${
                  !canResend ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {!canResend ? `Resend in ${resendCooldown}s` : "Resend Email"}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                Didn't receive the email? Check your spam folder or try
                resending.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign Up
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  Secure Verification
                </h4>
                <p className="text-gray-600 text-xs">
                  Your email verification is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
