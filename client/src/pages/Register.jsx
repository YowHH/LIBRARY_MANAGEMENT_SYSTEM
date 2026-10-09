import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import axios from "axios"; 

const Register = () => {

  const [ name, setName] =useState('')
  const [ email, setEmail] =useState('')
  const [ password, setPassword] =useState('')
  const [emailError, setEmailError] = useState('');

  const dispatch = useDispatch()
  const {loading, error, message, user, isAuthenticated} = useSelector(state => state.auth)

  const navigateTo = useNavigate()

  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      await axios.post("http://localhost:27017/api/v1/auth/check-email", { email });
      setEmailError('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setEmailError("Email already exists.");
      }
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("name", name)
    data.append("email", email)
    data.append("password", password)
    dispatch(register(data))
  }

    useEffect(() => {
      if(message){
        navigateTo(`/otp-verification/${email}`)
      }
      if(error){
        toast.error(error)
        dispatch(resetAuthSlice())
      }
    }, [dispatch, isAuthenticated, error, loading])

    if(isAuthenticated){
      return <Navigate to={"/"}/>
    }

  return (
  <>
    <div className="flex flex-col justify-center h-screen md:flex-row bg-slate-100">
      <div className="flex-col items-center justify-center hidden w-full p-8 text-white bg-black rounded-tr-[80px] md:w-1/2 md:flex rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="w-auto mb-12 h-44"/>
          </div>
          <p className="mb-12 text-gray-300">Already have an Account? Sign in now.</p>
          <Link to={"/login"} className="px-8 py-2 font-semibold transition border-2 border-white rounded-lg hover:bg-white hover:text-black">
            SIGN IN
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center w-full p-8 bg-slate-100 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="flex flex-col-reverse items-center justify-center gap-5 sm:flex-row">
              <h3 className="overflow-hidden text-4xl font-medium"> Sign Up</h3>
              <img src={logo} alt="logo" className="object-cover w-24 h-auto"/>
            </div>
          </div>
          <p className="mb-12 text-center text-gray-800">
             Please provide your information to sign up.
          </p>
        <form onSubmit={handleRegister}>
          <div className="mb-2">
            <input type="text" value={name} onChange={((e) => setName(e.target.value))} placeholder="Full Name"
            className="w-full px-4 py-3 border border-black rounded-md focus:outline bg-slate-100"
            />
          </div>
          <div className="mb-2">
            <input type="email" value={email} onChange={((e) => setEmail(e.target.value))} placeholder="Email Address" onBlur={handleEmailBlur}
            className="w-full px-4 py-3 border border-black rounded-md focus:outline bg-slate-100"
            />
          </div>
          <div className="mb-2">
            <input type="password" value={password} onChange={((e) => setPassword(e.target.value))} placeholder="Password"
            className="w-full px-4 py-3 border border-black rounded-md focus:outline bg-slate-100"
            />
          </div>
          <div className="block mt-5 font-semibold md:hidden">
            <p>
              Already have an Account?
              <Link to="/login" className="tetx-sm to-gray-500 hover:underline"> Sign In</Link>
            </p>
          </div>
          <button type="submit" 
          className="w-full py-2 mt-5 font-semibold text-white transition bg-black border-2 border-black rounded-lg hover:bg-white hover:text-black">
            SIGN UP
          </button>
        </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Register;
