import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar"
import UserDashboard from "../components/UserDashboard"
import AdminDashboard from "../components/AdminDashboard"
import BookManagement from "../components/BookManagement"
import Catalog from "../components/Catalog"
import Users from "../components/Users"
import MyBorrowedBooks from "../components/MyBorrowedBooks"

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState("")

  const { user, isAuthenticated } = useSelector(state => state.auth)

  //if(!isAuthenticated){
    //return<Navigate to={"/login"}/>
  //}

  return <>
    <div className="relative flex min-h-screen bg-gray-100 md:pl-64">
      <div className="absolute z-10 flex items-center justify-center text-white bg-black rounded-md md:hidden right-6 top-4 sm:top-6 h-9 w-9">
        <GiHamburgerMenu className="text-2xl" onClick={() => setIsSideBarOpen(!isSideBarOpen)}/>
      </div>
      <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} setSelectedComponent={setSelectedComponent}/>
      {
        (
          () => {
            switch (selectedComponent) {
            case "DashBoard":
                return user?.role === "User" ? (
                  <UserDashboard/>
                ) : (
                  <AdminDashboard/>
                )
              break;
              case "Books":
                return <BookManagement/>
                break;
              case "Catalog":
              if(user.role === "Admin"){
                return <Catalog/>
              }
                break;
              case "Users":
              if(user.role === "Admin"){
                return <Users/>
              } 
                break;
              case "My Borrowed Books":
              if(user.role === "Admin"){
                return <MyBorrowedBooks/>
              } 
                break;
            default:
              return user?.role === "User" ? (
                <UserDashboard/>
              ) : (
                <AdminDashboard/>
              )
              break;
            }
          }
        )()
      }
    </div>
  </>;
};

export default Home;
