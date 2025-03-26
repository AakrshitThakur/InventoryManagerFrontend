import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingBarAnimation from "../components/LoadingBarAnimation.jsx";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import axios from "axios";

import "../CSS/EditShop.css";

let inc = 1;
export default function CreateShop() {
  // To navigate user to the "/shops/:id" route
  const navigate = useNavigate();

  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);

  const [CreateFormData, SetCreateFormData] = useState({
    author: "",
    ShopName: "",
    ShopImg: "",
    description: "",
    address: "",
  });

  // Matching id from URL using useParams() hook
  const { id } = useParams();

  const HandleSetShowLoadingBar = () => {
    SetShowLoadingBar(!ShowLoadingBar);
  };

  const HandleOnChange = (event) => {
    const { name, value } = event.target;

    // Checking if change is occured due to change in image or other textual data
    if (name === "ShopImg")
      SetCreateFormData((prev) => ({
        ...prev,
        ShopImg: event.target.files[0],
      }));
    else SetCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleSetShowLoadingBar();

      const FormDataForSubmission = new FormData();
      for (const [key, value] of Object.entries(CreateFormData)) {
        FormDataForSubmission.append(key, value);
      }
      const response = await axios.post(
        "https://inventorymanagerbackend.onrender.com/shops/create",
        FormDataForSubmission
      );
      if (response.data.AuthenticationError) {
        navigate("/shops", {
          state: {
            msg: response.data.AuthenticationError.msg,
            status: response.data.AuthenticationError.status,
          },
        });
      } else if (response.data.GeneralError) {
        navigate("/GeneralError", {
          state: {
            msg: response.data.GeneralError.msg || "Oops! Something went wrong",
            StatusCode: response.data.GeneralError.StatusCode,
          },
        });
      } else {
        navigate(`/shops/${response.data.ShopID}`);
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

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="CreateShop relative bg-MobileCreateEditDeleteBgImg sm:bg-DesktopCreateEditDeleteBgImg bg-coverCreateOrEditPageBgImg bg-cover bg-center flex-1 flex flex-col justify-center items-center p-1">
      {/* To go to previous page */}
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/BlackBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1">
          Creating a new shop
        </h1>
        <div>
          <form onSubmit={HandleOnSubmit} method="POST">
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop auther{" "}
              </h2>
              <input
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="author"
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop name{" "}
              </h2>
              <input
                className={
                  IsDarkModeActive
                    ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                type="text"
                name="ShopName"
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop Image{" "}
              </h2>
              <input
                className={
                  IsDarkModeActive
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
                Shop description
              </h2>
              <textarea
                className={
                  IsDarkModeActive
                    ? "BoxAtDark w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                name="description"
                onChange={HandleOnChange}
                rows={5}
              ></textarea>
            </div>
            <div className="mb-1 sm:mb-2">
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                Shop address
              </h2>
              <textarea
                className={
                  IsDarkModeActive
                    ? "BoxAtDark w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                    : "BoxAtLight w-10/12 p-1 text-xs md:text-sm lg:text-md"
                }
                name="address"
                onChange={HandleOnChange}
                rows={5}
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
                  Create
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
