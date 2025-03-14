import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBarAnimation from "../components/LoadingBarAnimation";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Login() {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);
  const [ShowPassword, SetShowPassword] = useState(false);
  const [credentials, SetCredentials] = useState({
    email: "",
    psd: "",
  });
  // To navigate user to the "/shops" route
  const navigate = useNavigate();

  const HandleOnChange = (event) => {
    const { name, value } = event.target;
    SetCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleShowLoadingBar();
      const response = await axios.post(
        "https://inventorymanagerbackend.onrender.com/login",
        credentials,
        { withCredentials: true }
      );

      // Using state property to send msg to "/shops" route
      if (response.data.ErrorMsg) {
        const MsgObjToSend = {
          msg: response.data.ErrorMsg.msg,
          status: response.data.ErrorMsg.status,
        };
        navigate("/shops", { state: MsgObjToSend });
      } else if (response.data.GeneralError) {
        navigate("/GeneralError", {
          state: {
            msg: response.data.GeneralError.msg || "Oops! Something went wrong",
            StatusCode: response.data.GeneralError.StatusCode,
          },
        });
      } else {
        const MsgObjToSend = {
          msg: response.data.SuccessMsg.msg,
          status: response.data.SuccessMsg.status,
        };
        navigate("/shops", { state: MsgObjToSend });
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
  const HandleShowLoadingBar = () => {
    SetShowLoadingBar(!ShowLoadingBar);
  };
  const HandleSetShowPassword = () => {
    SetShowPassword((prev) => !prev);
  };

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-MobileCreateEditDeleteBgImg sm:bg-DesktopCreateEditDeleteBgImg bg-cover flex-1 flex flex-col justify-center items-center p-1">
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/BackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">
          Log in to your account
        </h1>
        <form onSubmit={HandleOnSubmit}>
          <div className="mb-1">
            <h2 className="text-lg md:text-xl lg:text-2xl">
              Enter your email{" "}
            </h2>
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
              }
              type="email"
              name="email"
              onChange={HandleOnChange}
              required
            />
          </div>
          <div className="mb-1">
            <h2 className="text-lg md:text-xl lg:text-2xl">
              Enter your password{" "}
            </h2>
            <div className="flex">
              <input
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type={ShowPassword ? "text" : "password"}
                name="psd"
                onChange={HandleOnChange}
                required
              />
              <span
                className="flex justify-normal items-center sm:ml-1 w-4"
                onClick={HandleSetShowPassword}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="auto"
                  fill="currentColor"
                  class="bi bi-eye"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            {ShowLoadingBar ? (
              <LoadingBarAnimation />
            ) : (
              <button
                type="submit"
                className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded"
              >
                Login
              </button>
            )}
          </div>
        </form>
        <div className="">
          <div>
            <p className="text-xs md:text-sm lg:text-md">
              Don't have any account?{" "}
              <span>
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                  <a className="text-xs md:text-sm lg:text-md" href="/signup">
                    Sign up
                  </a>
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
