import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";

const App = () => {
  const { user, isAuthenticated } = useSelector(
    (/** @type {any} */ state) => state?.auth ?? {}
  );
  const dispatch = /** @type {any} */ (useDispatch());

  useEffect(() => {
    const hasToken = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("token="));

    if (hasToken) {
      dispatch(getUser());
    }
  }, [dispatch]); 

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      dispatch(fetchAllUsers());
    }
  }, [isAuthenticated, user, dispatch]); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;