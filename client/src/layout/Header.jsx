import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [ currentTime, setCurrentTime ] = useState("")
  const [ currentDate, setCurrentDate ] = useState("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const hours = now.getHours() % 12 || 12
      const minnutes = now.getMinutes().toString().padStart(2, "0")
      const ampm = now.getHours() >= 12 ? "P.M." : "A.M."
      setCurrentTime(`${hours}:${minnutes}:${ampm}`)
      const options = /** @type {Intl.DateTimeFormatOptions} */ ({ month: "short", day: "numeric", year: "numeric" })
      setCurrentDate(now.toLocaleDateString("en-US", options))
    }
    updateDateTime()
    const intervalId = setInterval(updateDateTime, 1000)
    return () => clearInterval(intervalId)
  }, [])
  return <>
  <header className="top-0 left-0 items-center justify-between w-full px-6 py-4 bg-white shadow-md asolute">
    <div className="flex items-center gap-2">
      <img src={userIcon} alt="userIcon" className="w-8 h-8"/>
      <div className="flex flex-col">
        <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">{user && user.name}</span>
        <span className="text-sm font-medium sm:text-lg sm:font-semibold">{user && user.role}</span>
      </div>
    </div>
    <div className="items-center hidden gap-2 md:flex">
      <div className="flex flex-col items-end text-sm font-semibold lg:text-base">
        <span>{currentTime}</span>
        <span>{currentDate}</span>
      </div>
      <span className="bg-black h-14 w-[2px]"/>
      <img src={settingIcon} alt="settingIcon" className="w-8 h-8"
      onClick={() => toggleSettingPopup()}
      />
    </div>
  </header>
  </>;
};

export default Header;
