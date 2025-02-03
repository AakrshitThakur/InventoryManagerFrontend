import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import LoadingBarAnimation from "../components/LoadingBarAnimation.jsx";
import axios from "axios";
import "../CSS/NewCategory.css";

let inc = 1;
let MsgObj = undefined;
export default function NewItem() {
  // Using the useLocation() hook to retrieve statefull from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [ItemData, SetItemData] = useState({
    ItemName: "",
    ItemDescription: "",
    PerItemPurchasePrice: "",
    PerItemSellingPrice: "",
    PerItemSellingDiscount: "",
    NoOfItems: "",
    ItemImg: "",
    StockStatus: "",
    PaymentStatus: "",
  });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);

  const { id, CategoryID } = useParams();

  const HandleShowLoadingBar = () => {
    SetShowLoadingBar(!ShowLoadingBar);
  };
  const HandleOnChange = (event) => {
    const { name, value } = event.target;

    // Checking if change is occured due to change in image or other textual data
    if (name === "ItemImg") {
      console.log(event.target.files[0]);
      SetItemData((prev) => ({
        ...prev,
        ItemImg: event.target.files[0],
      }));
    } else SetItemData((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleShowLoadingBar();

      const FormDataForSubmission = new FormData();
      for (const [key, value] of Object.entries(ItemData)) {
        FormDataForSubmission.append(key, value);
      }

      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/new`,
        FormDataForSubmission,
        { withCredentials: true }
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
            msg: response.data.AuthorizationError.msg,
            status: response.data.AuthorizationError.status,
          },
        });
      } else if (response.data.GeneralError) {
        navigate("/GeneralError", {
          state: {
            msg: response.data.GeneralError.msg || "Oops! Something went wrong",
            StatusCode: response.data.GeneralError.StatusCode,
          },
        });
      } else if (response.data.SuccessMsg) {
        navigate(`/shops/${id}/stockroom/categories/${CategoryID}`, {
          state: {
            msg: response.data.SuccessMsg.msg,
            status: response.data.SuccessMsg.status,
          },
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

  // To remove the previous value holded by state of navigation
  useEffect(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="NewItem bg-MobileCreateEditDeleteBgImg sm:bg-DesktopCreateEditDeleteBgImg bg-cover flex-1">
      <div className="flex flex-col justify-center items-center p-1 md:p-3">
        <div
          className={
            IsDarkModeActive
              ? "BoxAtDark bg-black w-3/4 lg:w-2/5 p-1 md:p-3 rounded"
              : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md w-3/4 lg:w-2/5 p-1 md:p-3 rounded"
          }
        >
          <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1">
            Creating a new item
          </h1>
          <form onSubmit={HandleOnSubmit} method="POST">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter item name
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="ItemName"
                value={ItemData.ItemName}
                required
              />
            </div>
            <div className="mb-1">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Enter item description
              </h2>
              {/* <input className={IsDarkMode ? "DarkEditShopBorder text-black" : "LightEditShopBorder"} type="text" name="description" value={`${EditFormData.description}`} onChange={HandleOnChange} /> */}
              <textarea
                className={
                  IsDarkModeActive
                    ? "BoxAtDark w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                name="ItemDescription"
                id=""
                value={`${ItemData.ItemDescription}`}
                onChange={HandleOnChange}
                rows="5"
              ></textarea>
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter per item purchase price
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-mds"
                }
                type="number"
                name="PerItemPurchasePrice"
                value={ItemData.PerItemPurchasePrice}
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter per item selling price
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="PerItemSellingPrice"
                value={ItemData.PerItemSellingPrice}
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter per item selling discount
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="PerItemSellingDiscount"
                value={ItemData.PerItemSellingDiscount}
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter no of items
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="NoOfItems"
                value={ItemData.NoOfItems}
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter item image
            </h2>
            <div className="mb-1">
              <input
                onChange={HandleOnChange}
                className={
                  IsDarkModeActive
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="file"
                name="ItemImg"
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter stock status
            </h2>
            <div className="mb-1">
              <select
                className={
                  IsDarkModeActive
                    ? "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                name="StockStatus"
                value={ItemData.StockStatus}
                onChange={HandleOnChange}
              >
                <option value="">--Select--</option>
                <option value="Available">Available</option>
                <option value="Not available">Not available</option>
              </select>
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter payment status
            </h2>
            <div className="mb-1">
              <select
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                name="PaymentStatus"
                value={ItemData.PaymentStatus}
                onChange={HandleOnChange}
              >
                <option value="">--Select--</option>
                <option value="Available">Available</option>
                <option value="Not available">Not available</option>
              </select>
            </div>
            <div>
              {ShowLoadingBar ? (
                <LoadingBarAnimation />
              ) : (
                <button className="text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 bg-green-400 text-black rounded">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
