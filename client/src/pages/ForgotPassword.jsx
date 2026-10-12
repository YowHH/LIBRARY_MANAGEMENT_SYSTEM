import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("")

  const dispatch = useDispatch()
  const {loading, error, message, user, isAuthenticated} = useSelector(state => state.auth)

  const handleForgotPassword = (e) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  useEffect(() => {
      if(message){
        toast.success(message)
        dispatch(resetAuthSlice())
      }
      if(error){
        toast.error(error)
        dispatch(resetAuthSlice())
      }
    }, [dispatch, isAuthenticated, error, loading])

    if(isAuthenticated){
      return <Navigate to={"/"}/>
    }

  return <>
    <div className="flex flex-col justify-center h-screen md:flex-row">
      <div className="flex-col items-center justify-center hidden w-full p-8 text-white bg-black rounded-tr-[80px] rounded-br-[80px] md:w-1/2 md:flex">
        <div className="text-center h-[450px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44"/>
          </div>
          <h3 className="mb-12 text-gray-300 max-w-[320px] mx-auto text-3xl font-medium leading-10">
            &quot;Your premier digital library for boworring and reading books&quot;
          </h3>
        </div>
      </div>
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
              <img src={logo} alt="logo" className="w-auto h-24"/>
            </div>
          </div>
          <h1 className="mb-5 overflow-hidden text-4xl font-medium text-center">Forgot Password</h1>
          <p className="mb-12 text-center text-gray-800">Please enter your email</p>
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
               <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
            </div>
            <button type="submit" 
            className="w-full py-2 mt-5 font-semibold text-white transition bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  </>;
};

export default ForgotPassword;
