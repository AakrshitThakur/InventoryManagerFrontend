import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";

let MsgObj = undefined;
export default function GeneralError({ PageNotFoundError }) {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
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
    <div className="GeneralError relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-contain flex-1 p-1">
      {/* To go to previous page */}
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/BackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black flex flex-col justify-center items-center p-1 sm:p-2 md:p-3 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md flex flex-col justify-center items-center p-1 sm:p-2 md:p-3 rounded"
        }
      >
        <em
          className={
            IsDarkModeActive
              ? "text-center leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark mb-1"
              : "text-center leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight mb-1"
          }
        >
          {PageNotFoundError ? "Oops! Page Not Found" : MsgObj.msg}
        </em>
        <div>
          <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 PrussianBlueColor text-white rounded">
            <a href={"/shops"}>Go back to landing page</a>
          </button>
        </div>
      </div>
    </div>
  );
}
