import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Shop.css";
import axios from "axios";

export default function Shop() {
  const navigate = useNavigate();
  const [shop, SetShop] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);

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
    <div className="shop flex-1 my-1 p-1">
      {shop.length == 0 ? (
        <div className="grid place-items-center h-screen">
          <span className={IsDarkModeActive ? "SpinnerAtDark" : "SpinnerAtLight"}></span>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div
            className={
              IsDarkModeActive
                ? "BoxAtDark w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 2xl:w-1/2 p-2 md:p-3 rounded"
                : "BoxShadowAtLight w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 2xl:w-1/2 p-2 md:p-3 rounded"
            }
          >
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              {shop.ShopName}
            </h2>
            <img className="w-full rounded" src={shop.ShopImgURL} alt="" />
            <p className="text-sm md:text-md lg:text-lg">
              <b>{shop.author}(owner)</b>
            </p>
            <p className="overflow-hidden text-xs md:text-sm lg:text-md">
              {shop.description}(description)
            </p>
            <p className="overflow-hidden text-xs md:text-sm lg:text-md">
              <address>{shop.address}(address)</address>
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
  );
}
