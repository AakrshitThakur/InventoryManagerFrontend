import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import LoadingBarAnimation from "../components/LoadingBarAnimation.jsx";
import axios from "axios";
import "../CSS/NewCategory.css";

let inc = 1;
let MsgObj = undefined;
export default function EditItem() {
  // Using the useLocation() hook to retrieve statefull from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [EditItemData, SetEditItemData] = useState({
    ItemName: "",
    ItemDescription: "",
    PerItemPurchasePrice: "",
    PerItemSellingPrice: "",
    PerItemSellingDiscount: "",
    NoOfItems: "",
    PrevImgFilename: "",
    PrevImgPath: "",
    ItemImg: "",
    StockStatus: "",
    PaymentStatus: "",
  });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);

  const { id, CategoryID, ItemID } = useParams();

  const HandleShowLoadingBar = () => {
    SetShowLoadingBar(!ShowLoadingBar);
  };
  const HandleOnChange = (event) => {
    const { name, value } = event.target;

    // Checking if change is occured due to change in image or other textual data
    if (name === "ItemImg") {
      console.log(event.target.files[0]);
      SetEditItemData((prev) => ({
        ...prev,
        ItemImg: event.target.files[0],
      }));
    } else SetEditItemData((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleShowLoadingBar();

      const FormDataForSubmission = new FormData();
      for (const [key, value] of Object.entries(EditItemData)) {
        FormDataForSubmission.append(key, value);
      }

      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}/edit`,
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
      } else if (response.data.ItemID) {
        navigate(
          `/shops/${id}/stockroom/categories/${CategoryID}/${response.data.ItemID}`
        );
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

  // Calling FetchAPI()
  useEffect(() => {
    // Fetching API data form server
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}`
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
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else {
          // Setting intial ItemData
          SetEditItemData({
            ItemName: response.data.item.ItemName,
            ItemDescription: response.data.item.ItemDescription,
            PerItemPurchasePrice: response.data.item.PerItemPurchasePrice,
            PerItemSellingPrice: response.data.item.PerItemSellingPrice,
            PerItemSellingDiscount: response.data.item.PerItemSellingDiscount,
            NoOfItems: response.data.item.NoOfItems,
            PrevImgFilename: response.data.item.ItemFilename,
            PrevImgPath: response.data.item.ItemPath,
            ItemImg: "",
            StockStatus: response.data.item.StockStatus,
            PaymentStatus: response.data.item.PaymentStatus,
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
    FetchAPI();
  }, []);

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
    <div className="NewItem flex-1">
      <div className="flex flex-col justify-center items-center p-1 md:p-3">
        <div
          className={
            IsDarkModeActive
              ? "BoxAtDark w-3/4 lg:w-2/5 p-1 md:p-3 rounded"
              : "BoxShadowAtLight w-3/4 lg:w-2/5 p-1 md:p-3 rounded"
          }
        >
          <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1">
            Edit item
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="ItemName"
                value={EditItemData.ItemName}
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                name="ItemDescription"
                id=""
                value={`${EditItemData.ItemDescription}`}
                onChange={HandleOnChange}
                cols="35"
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-mds"
                }
                type="number"
                name="PerItemPurchasePrice"
                value={EditItemData.PerItemPurchasePrice}
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="PerItemSellingPrice"
                value={EditItemData.PerItemSellingPrice}
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="PerItemSellingDiscount"
                value={EditItemData.PerItemSellingDiscount}
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="number"
                name="NoOfItems"
                value={EditItemData.NoOfItems}
              />
            </div>
            <div className="mb-1">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Your item image
              </h2>
              <img
                className="w-40 sm:w-1/2 rounded"
                src={EditItemData.PrevImgPath}
                alt=""
              />
            </div>
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter a new item image
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                name="StockStatus"
                value={EditItemData.StockStatus}
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
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                name="PaymentStatus"
                value={EditItemData.PaymentStatus}
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
