import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import Msg from "../components/Msg.jsx";
import axios from "axios";
import "../CSS/LoadingPageSpinner.css";

let inc = 1;
let MsgObj = undefined;
export default function Shops() {
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [AllShops, SetAllShops] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);

  // To remove the previous value holded by state of navigation
  useEffect(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          "https://inventorymanagerbackend.onrender.com/shops"
        );
        if (response.data.GeneralError) {
          navigate("/GeneralError", {
            state: {
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else SetAllShops(response.data.shops);
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
  }, []);

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="shops flex-1 p-1">
      {MsgObj && <Msg msg={MsgObj.msg} status={MsgObj.status} />}

      {AllShops.length == 0 ? (
        <div className="grid place-items-center h-screen">
          <span className={IsDarkModeActive ? "SpinnerAtDark" : "SpinnerAtLight"}></span>
        </div>
      ) : (
        <>
          <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 md:mb-3">
            Viewing All Shops
          </h1>
          <ul>
            {AllShops.map((shop) => (
              <li
                className={
                  IsDarkModeActive
                    ? "BoxAtDark container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                    : "BoxShadowAtLight container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                }
                key={inc++}
              >
                <h2 className="text-lg md:text-xl lg:text-2xl">
                  {shop.ShopName}
                </h2>
                {/* Aligning image at left and other content on right */}
                <div className="flex flex-col md:flex md:flex-row">
                  <div className="my-1 basis-4/12">
                    <img
                      className="w-full rounded"
                      src={shop.ShopImgURL}
                      alt=""
                    />
                  </div>
                  <div className="pt-1 md:pt-0 md:pl-2 basis-8/12">
                    <div className="text-nowrap text-xs md:text-sm lg:text-md">
                      <div>
                        <p className="overflow-hidden">{shop.description}</p>
                        <div>
                          <address className="overflow-hidden">
                            {shop.address}
                          </address>
                        </div>
                        <div>
                          <Link to={`/shops/${shop._id}`}>
                            <div className="sm:mt-1">
                              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                                View shop
                              </button>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
