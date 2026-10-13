import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const {loading, error, message, user, isAuthenticated} = useSelector(state => state.auth)

  const navigateTo = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("email", email)
    data.append("password", password)
    dispatch(login(data))
  }

  useEffect(() => {
      //if(message){
      //  toast.success(message)
      //  dispatch(resetAuthSlice())
      //}
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
        <div className="relative flex items-center justify-center w-full p-8 bg-white md:w-1/2">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="flex items-center justify-center rounded-full">
                <img src={logo} alt="logo" className="w-auto h-24" />
              </div>
            </div>
            <h1 className="mb-12 overflow-hidden text-4xl font-medium text-center">
              Welcome Back !!
            </h1>
            <p className="mb-12 text-center text-gray-800">
              Please enter your credentials to log in.
            </p>

            <form onSubmit={handleLogin}>
              <div className="flex justify-center gap-3 mb-8">
                  <input
                   type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"
                   className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                  />
              </div>
              <div className="flex justify-center gap-3 mb-8">
                  <input
                   type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                   className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                  />
              </div>
              <Link to={"/password/forgot"} className="mb-12 font-semibold text-black">
                Forgot Password ?
              </Link>
              <div className="block mt-5 font-semibold md:hidden">
                <p>New to our platform? 
                  <Link to={"/register"} className="text-sm text-gray-500 hover:underline">Sign Up</Link>
                </p>
              </div>
              <button type="submit" 
              className="w-full py-2 mt-5 font-semibold text-white transition bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black">
                SIGN IN
              </button>
            </form>
          </div>
        </div>
        <div className="flex-col items-center justify-center hidden w-full p-8 text-white md:w-1/2 bg-black md:flex rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44"/>
            </div>
            <p className="mb-12 text-gray-300">
              New to our platform? Sign up now
            </p>
            <Link to={"/register"} className="w-full px-8 py-2 mt-5 font-semibold text-white transition bg-black border-2 border-white rounded-lg hover:bg-white hover:text-black">
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
  </>;
};

export default Login;
