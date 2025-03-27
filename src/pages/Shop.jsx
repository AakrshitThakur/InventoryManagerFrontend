import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Shop.css";
import axios from "axios";

export default function Shop() {
  const navigate = useNavigate();
  const [shop, SetShop] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  // Matching id from URL using useParams() hook
  const { id } = useParams();

  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}`
        );

        if (response.data.AuthenticationError) {
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
          navigate("/shops", {
            state: {
              msg:
                response.data.AuthorizationError.msg ||
                "Oops! Something went wrong",
              status: response.data.AuthorizationError.status,
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
          // No error detected
          SetShop(response.data.shop);
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
  }, []);

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="shop relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 p-1">
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm w-11/12 sm:w-2/3 md:w-7/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm w-11/12 sm:w-2/3 md:w-7/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
        }
      >
        {shop.length == 0 ? (
          <div className="grid place-items-center h-screen">
            <span
              className={IsDarkModeActive ? "SpinnerAtDark" : "SpinnerAtLight"}
            ></span>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                  : "BoxShadowAtLight container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
              }
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                {shop.ShopName}
              </h2>
              <img className="w-full rounded" src={shop.ShopImgURL} alt="" />
              <p
                className={
                  IsDarkModeActive
                    ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b"
                    : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b"
                }
              >
                <b>{shop.author}(owner)</b>
              </p>
              <p
                className={
                  IsDarkModeActive
                    ? "leading-none text-xs md:text-sm lg:text-md BorderBottomAtDark border-b"
                    : "leading-none text-xs md:text-sm lg:text-md BorderBottomAtLight border-b"
                }
              >
                {shop.description} <b className="leading-none">(description)</b>
              </p>
              <p className="leading-none text-xs md:text-sm lg:text-md">
                <address>
                  {shop.address} <b className="leading-none">(address)</b>
                </address>
              </p>
              <div className="flex justify-around mt-1">
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                  <a href="/shops">View all shops</a>
                </button>
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 TangerineColor text-black rounded">
                  <a href={`/shops/${shop._id}/edit`}>Edit Shop</a>
                </button>
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 PrussianBlueColor text-white rounded">
                  <a href={`/shops/${id}/stockroom`}>Stockroom</a>
                </button>
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-red-400 text-black rounded">
                  <a href={`/shops/${id}/ConfirmDeleteShop`}>Delete shop</a>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
