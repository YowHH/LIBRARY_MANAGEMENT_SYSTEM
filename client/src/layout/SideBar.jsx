import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

// @ts-ignore
const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {

  const dispatch = useDispatch()
  //const {} = useSelector(state => state.popup)
  const {loading, error, message, user, isAuthenticated} = useSelector(state => state.auth)
  const handleLogout = () => {
    dispatch(logout())
  }
  useEffect(() => {
    if(error){
      toast.error(error)
      // @ts-ignore
      dispatch(resetAuthSlice())
    }
    if(message){
      toast.success(message)
      // @ts-ignore
      dispatch(resetAuthSlice())
    }
  }, [dispatch, isAuthenticated, error, loading, message])

  return (
    <>
      <aside className={`${isSideBarOpen ? "left-0" : "-left-full"} z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white
      flex-col h-full`} style={{position: "fixed"}}>
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
          onClick={() => setSelectedComponent("Dashboard")}>
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
          onClick={() => setSelectedComponent("Books")}>
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>
          {
            isAuthenticated && user?.role === "Admin" && (
              <>
                <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
                onClick={() => setSelectedComponent("Catalog")}>
                  <img src={catalogIcon} alt="icon" />
                  <span>Catalog</span>
                </button>
                <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
                onClick={() => setSelectedComponent("User")}>
                  <img src={usersIcon} alt="icon" />
                  <span>Users</span>
                </button>
                <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
                //</>onClick={() => setSelectedComponent("User")}
                >
                  {/*<img src={usersIcon} alt="icon" />
                  <span>Users</span>*/}
                  <RiAdminFill className="w-6 h-6"/><span>Add New Admin</span>
                </button>
              </>
            )
          }
          {
            isAuthenticated && user?.role === "User" && (
              <>
                <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
                onClick={() => setSelectedComponent("My Borrowed Book")}>
                  <img src={catalogIcon} alt="icon" />
                  <span>My Borrowed Book</span>
                </button>
              </>
          )}
          <button className="flex items-center w-full py-2 space-x-2 font-medium bg-transparent rounded-md hover:cursor-pointer"
          //onClick={() => setSelectedComponent("My Borrowed Book")}
          >
              <img src={settingIcon} alt="icon" />
              <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button className="flex items-center justify-center py-2 mx-auto space-x-5 font-medium text-center bg-transparent rounded-md hover:cursor-pointer w-fit">
            <img src={logoutIcon} alt="icon" />
            <span>Log Out</span>
          </button>
        </div>
        <img src={closeIcon} alt="icon" onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        className="absolute top-0 block mt-4 h-fit w-fit right-4 md:hidden"
        />
      </aside>
    </>
  );
};

export default SideBar;
