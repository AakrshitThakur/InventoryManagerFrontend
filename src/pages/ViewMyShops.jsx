import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import axios from "axios";
import "../CSS/ViewMyShops.css";

let inc = 1;
export default function Shops() {
  // Using the useLocation() hook to retrieve data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  const [MyShops, SetMyShops] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          "https://inventorymanagerbackend.onrender.com/shops/ViewMyShops"
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
          SetMyShops(response.data.MyShops);
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

  return (
    <div className="ViewMyShops flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-contain flex-1 p-1">
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black w-2/3 p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md w-2/3 p-1 md:p-2 rounded"
        }
      >
        {MyShops.length != 0 ? (
          <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 md:mb-3">
            Viewing {MyShops[0].author}'s Shops
          </h1>
        ) : (
          <p className="text-xs leading-none md:text-sm lg:text-md m-1">
            No items were found in this account. Please create new items or log
            in to a different account.
          </p>
        )}
        <ul>
          {MyShops.map((shop) => (
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                  : "BoxShadowAtLight container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                {shop.ShopName}
              </h2>
              {/* Aligning image at left and other content on right */}
              <div className="flex flex-col md:flex md:flex-row">
                <div className="my-1 md:w-1/3">
                  <img
                    className="w-full rounded"
                    src={shop.ShopImgURL}
                    alt=""
                  />
                </div>
                <div className="pt-1 md:pt-0 md:pl-2 md:w-2/3">
                  <div className="text-nowrap text-xs md:text-sm lg:text-md">
                    <div>
                      <p
                        className={
                          IsDarkModeActive
                            ? "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                            : "text-wrap leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                        }
                      >
                        {shop.description}
                        <b className="text-wrap leading-none">(description)</b>
                      </p>
                      <div
                        className={
                          IsDarkModeActive
                            ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b sm:mb-1"
                            : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b sm:mb-1"
                        }
                      >
                        <address className="text-wrap leading-none">
                          {shop.address}{" "}
                          <b className="text-wrap leading-none">(address)</b>
                        </address>
                      </div>
                      <div>
                        <Link to={`/shops/${shop._id}`}>
                          <div className="mt-1">
                            <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black text-md rounded">
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
      </div>
    </div>
  );
}

// my-1 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4
