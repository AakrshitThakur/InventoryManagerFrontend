import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import LoadingBarAnimation from "../components/LoadingBarAnimation";
import axios from "axios";
import "../CSS/NewCategory.css";

export default function CreateNewCategory() {
  const navigate = useNavigate();

  const [CategoryData, SetCategoryName] = useState({
    CategoryName: "",
    CategoryDescription: "",
  });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");
  const [ShowLoadingBar, SetShowLoadingBar] = useState(false);

  const { id } = useParams();

  const HandleShowLoadingBar = () => {
    SetShowLoadingBar(!ShowLoadingBar);
  };
  const HandleOnChange = (event) => {
    const { name, value } = event.target;
    SetCategoryName((prev) => ({ ...prev, [name]: value }));
  };
  const HandleOnSubmit = async (event) => {
    try {
      event.preventDefault();
      HandleShowLoadingBar();
      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/new`,
        CategoryData,
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
        navigate(`/shops/${id}/stockroom/categories`, {
          state: {
            msg: response.data.SuccessMsg,
            status: "success",
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

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="NewCategory bg-MobileCreateEditDeleteBgImg sm:bg-DesktopCreateEditDeleteBgImg bg-cover flex-1 flex flex-col justify-center items-center p-1 md:p-3">
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1">
          Making a new category
        </h1>
        <form onSubmit={HandleOnSubmit} method="POST">
          <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
            Enter category name
          </h2>
          <div className="mb-2">
            <input
              onChange={HandleOnChange}
              className={
                IsDarkModeActive
                  ? "BoxAtDark sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight sm:h-7 w-10/12 p-1 text-xs md:text-sm lg:text-md"
              }
              type="text"
              name="CategoryName"
              value={CategoryData.CategoryName}
              required
            />
          </div>
          <div className="mb-2">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
              Enter category description
            </h2>
            {/* <input className={IsDarkMode ? "DarkEditShopBorder text-black" : "LightEditShopBorder"} type="text" name="description" value={`${EditFormData.description}`} onChange={HandleOnChange} /> */}
            <textarea
              className={
                IsDarkModeActive
                  ? "BoxAtDark w-10/12 p-1 text-xs md:text-sm lg:text-md text-black"
                  : "BoxAtLight w-10/12 p-1 text-xs md:text-sm lg:text-md"
              }
              name="CategoryDescription"
              id=""
              value={`${CategoryData.CategoryDescription}`}
              onChange={HandleOnChange}
              rows="5"
            ></textarea>
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
  );
}
