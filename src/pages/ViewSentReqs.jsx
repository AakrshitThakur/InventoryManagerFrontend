import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import axios from "axios";
import ToastMsg from "../components/ToastMsg.jsx";

let MsgObj = undefined;
export default function ViewSendReqs() {
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  // Matching id from URL using useParams() hook
  const { id, CategoryID, ItemID } = useParams();

  const [SentReqs, SetSentReqs] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  const HandleOnChange = (idx, value) => {
    console.log(idx, value);
    SetSentReqs((elms) =>
      elms.map((elm) => (elm.idx == idx ? { ...elm, response: value } : elm))
    );
  };

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          "https://inventorymanagerbackend.onrender.com/reqs/ViewSentReqs"
        );
        if (response.data.AuthenticationError) {
          navigate("/shops", {
            state: {
              msg:
                response.data.AuthenticationError.msg ||
                "Oops! Something went wrong",
              status: response.data.AuthenticationError.status,
            },
          });
        } else if (response.data.GeneralError) {
          navigate("/GeneralError", {
            state: {
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else {
          SetSentReqs(response.data.ReqsReceived);
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
    FetchAPI();

    // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // To remove the previous value (after 1 sec) holded by state of navigation
    const timer = setTimeout(() => {
      MsgObj = undefined;
    }, 1000);
    navigate(location.pathname, { replace: true });
    return () => {
      clearTimeout(timer);
    };
  }, [navigate, location.state]);

  return (
    <div className="ViewMyShops relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 p-1">
      {/* Showing toast messages */}
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}

      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1 ml-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm w-11/12 sm:w-10/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm w-11/12 sm:w-10/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
        }
      >
        {SentReqs.length != 0 ? (
          <h1 className="text-nowrap text-center text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 md:mb-3">
            All requests
          </h1>
        ) : (
          <p className="text-xs leading-none md:text-sm lg:text-md m-1">
            No requests were found in this account. Please log in to a different
            account.
          </p>
        )}
        <ul>
          {SentReqs.map((req) => (
            <li
              className={`${
                IsDarkModeActive ? "BoxAtDark" : "BoxShadowAtLight"
              } container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded`}
              key={req.idx}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                {req.ReceiverName}(receiver's name)
              </h2>
              {/* Aligning image at left and other content on right */}
              <div className="flex flex-col md:flex md:flex-row">
                <div className="my-1 md:w-1/3">
                  <img className="w-full rounded" src={req.ItemImgURL} alt="" />
                </div>
                <div className="flex flex-col justify-center pt-1 md:pt-0 md:pl-2 md:w-2/3">
                  <div className="text-wrap text-xs md:text-sm lg:text-md">
                    <p
                      className={
                        IsDarkModeActive
                          ? "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                          : "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                      }
                    >
                      {req.status}
                      <b className="text-wrap leading-none">(status)</b>
                      {req.status == "accepted" && <>&#10003;</>}
                      {req.status == "rejected" && <>&#10005;</>}
                      {req.status == "init" && <>&#9881;</>}
                    </p>
                  </div>
                  <div className="text-wrap text-xs md:text-sm lg:text-md">
                    <p
                      className={
                        IsDarkModeActive
                          ? "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                          : "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                      }
                    >
                      {req.quantity}
                      <b className="text-wrap leading-none">(quantity)</b>
                    </p>
                  </div>
                  <div
                    className={
                      IsDarkModeActive
                        ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                        : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                    }
                  >
                    <p className="text-wrap leading-none">
                      {req.msg}
                      <b className="text-wrap leading-none">(message)</b>
                    </p>
                  </div>
                  {req.response && (
                    <div
                      className={
                        IsDarkModeActive
                          ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                          : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                      }
                    >
                      <p className="text-wrap leading-none">
                        {req.response}
                        <b className="text-wrap leading-none">(response)</b>
                      </p>
                    </div>
                  )}
                  <div
                    className={
                      IsDarkModeActive
                        ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                        : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                    }
                  >
                    <p className="text-wrap leading-none">
                      {req.ExpiryDate}
                      <b className="text-wrap leading-none">(expiry date)</b>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// my-1 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4
