import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import LoadingBarAnimation from "../components/LoadingBarAnimation.jsx";

import axios from "axios";
import "../CSS/EditShop.css";

let inc = 1;
export default function EditShop() {
  const navigate = useNavigate();
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);
  const [shop, SetShop] = useState([]);
  const [IsDarkMode, SetIsDarkMode] = useState(localStorage.getItem("DarkMode") === "true");
  const [EditFormData, SetEditFormData] = useState({});

  // Matching id from URL using useParams() hook
  const { id } = useParams();

  const HandleSetShowLoadingBar = () => SetShowLoadingBar(!ShowLoadingBar);

  const HandleOnChange = (event) => {
    const { name, value } = event.target;

    // Checking if change is occured due to change in image or other textual data
    if (name === "ShopImg")
      SetEditFormData((prev) => ({ ...prev, ShopImg: event.target.files[0] }));
    else SetEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleSetShowLoadingBar();

      const FormDataForSubmission = new FormData();
      for (const [key, value] of Object.entries(EditFormData)) {
        FormDataForSubmission.append(key, value);
      }

      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/edit`,
        FormDataForSubmission
      );
      navigate(`/shops/${response.data.ShopID}`);
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
        const response = await axios.get(`https://inventorymanagerbackend.onrender.com/shops/${id}`);
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
          // Setting shop state
          SetShop(response.data.shop);
        }
        // Setting intial EditForm data
        SetEditFormData({
          author: response.data.shop.author,
          ShopImg: "",
          ShopFilename: response.data.shop.ShopFilename,
          ShopName: response.data.shop.ShopName,
          description: response.data.shop.description,
          address: response.data.shop.address,
        });
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

    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkMode);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="EditShop flex-1 flex flex-col justify-center items-center p-1 md:p-2">
      <div
        className={
          IsDarkMode
            ? "BoxAtDark lg:w-2/5 p-2 sm:p-3 md:p-4 rounded"
            : "BoxShadowAtLight lg:w-2/5 p-2 sm:p-3 md:p-4 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1">
          Edit your information
        </h1>
        <div>
          <form onSubmit={HandleOnSubmit} method="POST">
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop auther{" "}
              </h2>
              <input
                className={
                  IsDarkMode
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="author"
                value={`${EditFormData.author}`}
                onChange={HandleOnChange}
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Your shop image
              </h2>
              <img
                className="w-40 sm:w-1/2 rounded"
                src={shop.ShopImgURL}
                alt=""
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Change your shop image
              </h2>
              <input
                className={
                  IsDarkMode
                    ? "BoxAtDark text-xs md:text-sm lg:text-md bg-white text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="file"
                name="ShopImg"
                onChange={HandleOnChange}
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop name{" "}
              </h2>
              <input
                className={
                  IsDarkMode
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="ShopName"
                value={`${EditFormData.ShopName}`}
                onChange={HandleOnChange}
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop description{" "}
              </h2>
              {/* <input className={IsDarkMode ? "DarkEditShopBorder text-black" : "LightEditShopBorder"} type="text" name="description" value={`${EditFormData.description}`} onChange={HandleOnChange} /> */}
              <textarea
                className={
                  IsDarkMode
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                name="description"
                id=""
                value={`${EditFormData.description}`}
                onChange={HandleOnChange}
                cols="35"
              >
                {EditFormData.description}
              </textarea>
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop address{" "}
              </h2>
              {/* <input className={IsDarkMode ? "DarkEditShopBorder text-black" : "LightEditShopBorder"} type="text" name="address" value={`${EditFormData.address}`} onChange={HandleOnChange} /> */}
              <textarea
                className={
                  IsDarkMode
                    ? "BoxAtDark text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight text-xs md:text-sm lg:text-md"
                }
                name="address"
                id=""
                value={`${EditFormData.address}`}
                onChange={HandleOnChange}
                cols="35"
              >
                {EditFormData.address}
              </textarea>
            </div>
            <div>
              {ShowLoadingBar ? (
                <LoadingBarAnimation />
              ) : (
                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
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
