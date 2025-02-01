import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import ToastMsg from "../components/ToastMsg";
import axios from "axios";
import "../CSS/Stockroom.css";

let inc = 1;
let MsgObj = undefined;
export default function Categories() {
  // Matching id from URL using useParams() hook
  const { id } = useParams();

  // Using the useLocation() hook to retrieve data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [categories, SetCategories] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories`,
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
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else {
          SetCategories(response.data.categories);
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
  useEffect(() => {
    // To remove the previous value (after 1 sec) holded by state of navigation
    const timer = setTimeout(() => {
      MsgObj = undefined;
    }, 1000);
    navigate(location.pathname, { replace: true });
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    // flex flex-col justify-center items-center
    <div className="stockroom flex-1 my-2 p-1">
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}
      <div className="flex flex-col justify-center items-center">
        <div
          className={
            IsDarkModeActive
              ? "BoxAtDark text-center w-3/4 lg:w-2/4 p-1 md:p-3 rounded"
              : "BoxShadowAtLight text-center w-3/4 lg:w-2/4 p-1 md:p-3 rounded"
          }
        >
          <div>
            <button className="block w-full text-xs md:text-sm lg:text-md PrussianBlueColor text-white rounded px-1 py-1 md:px-2 md:py-2 mb-1">
              <a
                className="w-full text-xs md:text-sm lg:text-md"
                href={`/shops/${id}/stockroom/categories/new`}
              >
                Create a new category
              </a>
            </button>
          </div>
          <div>
            <button className="block w-full text-xs md:text-sm lg:text-md TangerineColor text-black rounded px-1 py-1 md:px-2 md:py-2 mb-1">
              <a
                className="w-full text-xs md:text-sm lg:text-md"
                href={`/shops/${id}/stockroom`}
              >
                Go back
              </a>
            </button>
          </div>
          <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-2">
            Your categories
          </h1>
          <ul className="w-9/12 text-left">
            {categories.length == 0 && (
              <li>
                <p className="mx-auto leading-none text-xs md:text-sm lg:text-md m-1">
                  No categories were found in this shop. Please create new
                  categories or go to a different shop.
                </p>
              </li>
            )}
            {categories.map((category) => (
              <a href={`/shops/${id}/stockroom/categories/${category._id}`}>
                <li
                  className={
                    IsDarkModeActive
                      ? "BoxAtDark container overflow-hidden mx-auto p-1 md:p-2 mb-1 rounded"
                      : "BoxAtLight container overflow-hidden mx-auto p-1 md:p-2 mb-1 rounded"
                  }
                  key={inc++}
                >
                  <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                    {category.CategoryName}
                  </h2>
                  <p className="text-ellipsis overflow-hidden text-xs md:text-sm lg:text-md">
                    {category.CategoryDescription}
                  </p>
                  <em className="text-xs">Tab to view</em>
                </li>
              </a>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
