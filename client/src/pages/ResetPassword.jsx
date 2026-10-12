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
    dispatch(resetPassword(data, token))
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
    
  </>;
};

export default ResetPassword;
