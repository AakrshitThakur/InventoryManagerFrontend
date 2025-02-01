import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";

let MsgObj = undefined;
export default function GeneralError({ PageNotFoundError }) {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="GeneralError flex-1 flex flex-col justify-center items-center p-1 md:p-2">
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark flex flex-col justify-center items-center p-1 md:p-2 rounded"
            : "BoxShadowAtLight flex flex-col justify-center items-center p-1 md:p-2 rounded"
        }
      >
        <div className="text-center w-9/12 sm:w-80">
          <img className="w-full" src="/images/GeneralErrorImg.png" alt="" />
        </div>
        <em className="text-center leading-tight text-xs md:text-sm lg:text-md">
          {PageNotFoundError ? "Oops! Page Not Found" : MsgObj.msg}
        </em>
      </div>
    </div>
  );
}
