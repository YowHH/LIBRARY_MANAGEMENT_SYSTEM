import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const {token} = useParams()

  const dispatch = useDispatch()
  const {loading, error, message, user, isAuthenticated} = useSelector(state => state.auth)

  const handleResetPassword = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)
    dispatch(resetPassword(formData, token))
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
      <div className="flex-col items-center justify-center hidden w-full p-8 text-white bg-black md:w-1/2 md:flex rounded-tr-[80px] rounded-br-[80px]">
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
          to={"/password/forgot"}
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
          <h1 className="mb-5 overflow-hidden text-4xl font-medium text-center">Reset Password</h1>
          <p className="mb-12 text-center text-gray-800">Please enter your new password</p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
               <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
            </div>
            <div className="mb-4">
               <input
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"
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

export default ResetPassword;
