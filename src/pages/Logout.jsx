import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";

export default function Logout() {
  const navigate = useNavigate();
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  const HandleLogout = async () => {
    try {
      const response = await axios.post(
        "https://inventorymanagerbackend.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      if (
        response.data.msg ==
        "Successfully logged out. Please sign up or log in to continue."
      ) {
        const MsgToSend = {
          msg: response.data.msg,
          status: "success",
        };
        navigate("/shops", { state: MsgToSend });
      } else if (response.data.GeneralError) {
        navigate("/GeneralError", {
          state: {
            msg: response.data.GeneralError.msg || "Oops! Something went wrong",
            StatusCode: response.data.GeneralError.StatusCode,
          },
        });
      } else {
        const MsgToSend = {
          msg: response.data.msg,
          status: "error",
        };
        navigate("/shops", { state: MsgToSend });
      }
    } catch (FrontendError) {
      console.error(FrontendError.message);
      navigate("/GeneralError", {
        state: {
          msg: FrontendError.message || "Oops! Something went wrong",
          StatusCode: FrontendError.StatusCode,
        },
      });
    }
  };
  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="logout relative bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 flex flex-col justify-center items-center p-1">
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1 ml-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2">
          Sure you want to log out?
        </h1>
        <div>
          <span className="mr-1">
            <button
              className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded"
              onClick={HandleLogout}
            >
              Yes
            </button>
          </span>
          <span>
            <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-red-400 text-black rounded">
              <a className="text-xs md:text-sm lg:text-md" href="/shops">
                No
              </a>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
