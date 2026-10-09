import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const inputRefs = useRef([]);

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return;

    const newOtp = otp.split("");
    newOtp[index] = numericValue;
    setOtp(newOtp.join("").slice(0, 5));

    if (index < 4 && numericValue) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));

      if (!newOtp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    setOtp(pastedData);
    const focusIndex = Math.min(pastedData.length, 4);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    if (otp.length !== 5) {
      toast.error("INCORRECT OTP");
      return;
    }
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center h-screen md:flex-row">
        <div className="relative flex items-center justify-center w-full p-8 bg-white md:w-1/2">
          <Link
            to={"/login"}
            className="fixed px-4 py-2 font-bold transition duration-300 border-2 border-black rounded-3xl w-52 top-10 -left-20 hover:bg-black hover:text-white text-end"
          >
            Back
          </Link>
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="flex items-center justify-center rounded-full">
                <img src={logo} alt="logo" className="w-auto h-24" />
              </div>
            </div>
            <h1 className="mb-12 overflow-hidden text-4xl font-medium text-center">
              Check your MailBox
            </h1>
            <p className="mb-12 text-center text-gray-800">
              Please enter your OTP to proceed.
            </p>

            <form onSubmit={handleOtpVerification}>
              <div className="flex justify-center gap-3 mb-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste} // 支持粘贴
                    className="w-12 text-2xl font-semibold text-center transition-colors border border-gray-400 rounded-lg h-14 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                ))}
              </div>
              <button type="submit" 
              className="w-full py-2 mt-5 font-semibold text-white transition bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black">
                VERIFY
              </button>
            </form>
          </div>
        </div>
        <div>
          <div>
            <div>
              <img src={logo_with_title} alt="logo" />
            </div>
            <p>New to our platform? Sign up now</p>
            <Link to={"/register"} className="w-full px-8 py-2 mt-5 font-semibold text-white transition bg-black border-2 border-white rounded-lg hover:bg-black hover:text-white">
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;