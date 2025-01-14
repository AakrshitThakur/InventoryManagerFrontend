import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBarAnimation from "../components/LoadingBarAnimation";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function SignUp() {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);
  const [credentials, SetCredentials] = useState({
    username: "",
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
        "https://inventorymanagerbackend.onrender.com/signup",
        credentials,
        { withCredentials: true }
      );

      // Using state property to send msg to "/shops" route

      if (response.data.username == "The username already exists") {
        const MsgObjToSend = {
          msg: `The username already exists. Please choose a unique username or log in with the username you just entered.`,
          status: "error",
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
          msg: `Hello ${response.data.username}, you can click on the "Create Shop" button to create your own shop and manage your goods.`,
          status: "success",
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
  const HandleShowLoadingBar = (event) => {
    SetShowLoadingBar(!ShowLoadingBar);
  };

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="SignUp flex-1 flex flex-col justify-center items-center p-1 md:p-2">
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