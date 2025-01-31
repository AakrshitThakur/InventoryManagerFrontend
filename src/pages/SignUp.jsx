import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OTP_countdown from "../components/OTP_countdown.jsx";
import LoadingBarAnimation from "../components/LoadingBarAnimation";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import ToastMsg from "../components/ToastMsg.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

let MsgObj = undefined;
export default function SignUp() {
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);
  const [credentials, SetCredentials] = useState({
    username: "",
    email: "",
    psd: "",
  });
  const [ShowOTP_box, SetShowOTP_box] = useState(false);
  const [OTP, SetOTP] = useState("");

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const HandleShowLoadingBar = () => {
    SetShowLoadingBar((prev) => !prev);
  };
  const HandleSetShowOTP_box = () => {
    SetShowOTP_box((prev) => !prev);
  };
  const ResendOTP = () => {
    HandleSetShowOTP_box();
    SetOTP("");
    HandleOnSubmit();
  };
  const HandleOnChange = (event) => {
    const { name, value } = event.target;
    ShowOTP_box
      ? SetOTP(value)
      : SetCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();

      // Resetting OTP and ShowOTP_box to enable the user to resend credentials
      if (event.nativeEvent.submitter.name == "ResendOTP") {
        HandleSetShowOTP_box();
        SetOTP("");
      } else {
        HandleShowLoadingBar();
        if (ShowOTP_box) {
          const response = await axios.post(
            "https://inventorymanagerbackend.onrender.com/VerifyOTP",
            { OTP: OTP },
            { withCredentials: true }
          );
          if (response.data.GeneralError) {
            navigate("/GeneralError", {
              state: {
                msg:
                  response.data.GeneralError.msg ||
                  "Oops! Something went wrong",
                StatusCode: response.data.GeneralError.StatusCode,
              },
            });
          } else if (response.data.SuccessMsg) {
            const MsgObjToSend = {
              msg: `Hello ${response.data.SuccessMsg.username}, you can click on the "Create Shop" button to create your own shop and manage your goods.`,
              status: "success",
            };
            navigate("/shops", { state: MsgObjToSend });
          } else if (response.data.ErrorMsg) {
            const MsgObjToSend = {
              msg: response.data.ErrorMsg.msg,
              status: response.data.ErrorMsg.status,
            };
            // Checking if OTP entered by user is correct or not
            if (response.data.ErrorMsg.msg == "Invalid OTP") {
              HandleShowLoadingBar();
              navigate("/signup", { state: MsgObjToSend });
            } else {
              navigate("/shops", { state: MsgObjToSend });
            }
          }
        } else {
          // Sending credentials to the server
          const response = await axios.post(
            "https://inventorymanagerbackend.onrender.com/signup",
            credentials,
            { withCredentials: true }
          );

          // Using state property to send msg to "/shops" route

          if (response.data.UserAlreadyExists) {
            const MsgObjToSend = {
              msg: `The user already exists. Please choose a new email or log in with the email you just entered.`,
              status: "error",
            };
            navigate("/shops", { state: MsgObjToSend });
          } else if (response.data.GeneralError) {
            navigate("/GeneralError", {
              state: {
                msg:
                  response.data.GeneralError.msg ||
                  "Oops! Something went wrong",
                StatusCode: response.data.GeneralError.StatusCode,
              },
            });
          } else if (response.data.ShowOTPBox) {
            // The credentials were valid, and the OTP has been successfully sent.
            HandleSetShowOTP_box();
            HandleShowLoadingBar();
          }
        }
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

  useEffect(() => {
    // To remove the previous value (after 1 sec) holded by state of navigation
    const timer = setTimeout(() => {
      MsgObj = undefined;
    }, 1000);
    navigate(location.pathname, { replace: true });
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="SignUp flex-1 flex flex-col justify-center items-center p-1 md:p-2">
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark p-1 md:p-3 rounded"
            : "BoxShadowAtLight p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">
          Creating an account
        </h1>
        <form onSubmit={HandleOnSubmit}>
          <div className="mb-1">
            <h2 className="text-lg md:text-xl lg:text-2xl">
              Enter your username{" "}
            </h2>
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight text-xs md:text-sm lg:text-md"
              }
              type="text"
              name="username"
              onChange={HandleOnChange}
              required
            />
          </div>
          <div className="mb-1">
            <h2 className="text-lg md:text-xl lg:text-2xl">
              Enter your email{" "}
            </h2>
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight text-xs md:text-sm lg:text-md"
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
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight text-xs md:text-sm lg:text-md"
              }
              type="password"
              name="psd"
              onChange={HandleOnChange}
              required
            />
            <p className="text-xs">{credentials.psd}</p>
          </div>
          {ShowOTP_box ? (
            <div>
              <div className="mb-1">
                <h2 className="text-lg md:text-xl lg:text-2xl">
                  Enter your OTP{" "}
                </h2>
                <input
                  className={
                    IsDarkModeActive
                      ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                      : "BoxAtLight text-xs md:text-sm lg:text-md"
                  }
                  type="text"
                  name="OTP"
                  value={OTP}
                  onChange={HandleOnChange}
                  required
                />
              </div>
              <div>
                {ShowLoadingBar ? (
                  <LoadingBarAnimation />
                ) : (
                  <>
                    <button
                      type="submit"
                      className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 mr-1 bg-green-400 text-black rounded"
                    >
                      Ok
                    </button>
                    <button
                      name="ResendOTP"
                      type="submit"
                      className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 mr-1 bg-red-400 text-black rounded"
                    >
                      Resend OTP
                    </button>
                    <OTP_countdown InitialSec={60} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              {ShowLoadingBar ? (
                <LoadingBarAnimation />
              ) : (
                <button
                  type="submit"
                  className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded"
                >
                  Create account
                </button>
              )}
            </div>
          )}
        </form>
        <div className="text-xs md:text-sm lg:text-md">
          <p className="text-xs md:text-sm lg:text-md">
            Already has an account?{" "}
            <span>
              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                <a className="text-xs md:text-sm lg:text-md" href="/login">
                  Login
                </a>
              </button>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
