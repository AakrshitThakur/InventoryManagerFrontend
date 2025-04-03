import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBarAnimation from "../components/LoadingBarAnimation";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function SendReqMsg() {
  // Matching id from URL using useParams() hook
  const { id, CategoryID, ItemID } = useParams();

  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);
  const [ReqMsgObj, SetReqMsgObj] = useState({
    quantity: 1,
    ReqMsg: "",
  });
  // To navigate user to the "/shops" route
  const navigate = useNavigate();

  const HandleOnChange = (event) => {
    const { name, value } = event.target;
    SetReqMsgObj((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleShowLoadingBar();
      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}/reqs/new`,
        ReqMsgObj,
        { withCredentials: true }
      );

      // Checking if any errors are made
      if (response.data.GeneralError) {
        navigate("/GeneralError", {
          state: {
            msg: response.data.GeneralError.msg || "Oops! Something went wrong",
            StatusCode: response.data.GeneralError.StatusCode,
          },
        });
      } else if (response.data.AuthenticationError) {
        // Authentication error
        // Navigate to '/shops' if an authentication verification issue is detected.
        navigate("/shops", {
          state: {
            msg: response.data.AuthenticationError.msg,
            status: response.data.AuthenticationError.status,
          },
        });
      } else if (response.data.AuthorizationError) {
        // Authorization error
        // Navigate to '/shops' if an authorization issue is detected.
        navigate(`/shops/${id}/stockroom/categories/${CategoryID}/`, {
          state: {
            msg: response.data.AuthorizationError.msg,
            status: response.data.AuthorizationError.status,
          },
        });
      } else {
        const MsgObjToSend = {
          msg: response.data.SuccessMsg.msg,
          status: response.data.SuccessMsg.status,
        };
        navigate(`/shops/${id}/stockroom/categories/${CategoryID}/`, {
          state: MsgObjToSend,
        });
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

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 flex flex-col justify-center items-center p-1">
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-2 ml-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] w-3/4 sm:w-1/2 backdrop-blur-sm p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] w-3/4 sm:w-1/2 backdrop-blur-sm p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl leading-none mb-2">
          Sending request
        </h1>
        <form onSubmit={HandleOnSubmit}>
          <div className="mb-1">
            <h2 className="text-lg md:text-xl lg:text-2xl leading-none">
              Enter quantity
            </h2>
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
              }
              type="number"
              name="quantity"
              value={ReqMsgObj.quantity}
              onChange={HandleOnChange}
              min="1"
              required
            />
          </div>
          <div className="mb-1">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl leading-none">
              Enter message
            </h2>
            {/* <input className={IsDarkMode ? "DarkEditShopBorder text-black" : "LightEditShopBorder"} type="text" name="description" value={`${EditFormData.description}`} onChange={HandleOnChange} /> */}
            <textarea
              className={
                IsDarkModeActive
                  ? "BoxAtDark w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight w-10/12 p-1 text-xs md:text-sm lg:text-md"
              }
              name="ReqMsg"
              id=""
              value={ReqMsgObj.WantMsg}
              onChange={HandleOnChange}
              rows="5"
            ></textarea>
          </div>
          <div>
            {ShowLoadingBar ? (
              <LoadingBarAnimation />
            ) : (
              <button
                type="submit"
                className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
