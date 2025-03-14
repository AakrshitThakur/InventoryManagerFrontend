import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import ToastMsg from "../components/ToastMsg";
import axios from "axios";
import "../CSS/category.css";

let MsgObj = undefined;
let inc = 1;
export default function Category() {
  // Matching id from URL using useParams() hook
  const { id, CategoryID } = useParams();

  // Using the useLocation() hook to retrieve data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [category, SetCategory] = useState({
    CategoryName: undefined,
    CategoryDescription: undefined,
    items: [],
  });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}`,
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
        } else if (response.data.CategoryObj) {
          SetCategory(response.data.CategoryObj);
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
    <div className="category relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-contain flex-1 p-1">
      {/* To go to previous page */}
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/BackArrow.png" alt="" />
        </button>
      </div>
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black text-center w-11/12 sm:w-2/3 p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md text-center w-11/12 sm:w-2/3 p-1 md:p-2 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-2">
          {category && category.CategoryName}
        </h1>
        <div>
          <button className="block w-full PrussianBlueColor text-white rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a
              className="w-full text-nowrap text-xs md:text-sm lg:text-md"
              href={`/shops/${id}/stockroom/categories/${CategoryID}/new`}
            >
              Create a new item
            </a>
          </button>
        </div>
        <div>
          <button className="block w-full TangerineColor text-black rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a
              className="w-full text-nowrap text-xs md:text-sm lg:text-md"
              href={`/shops/${id}/stockroom/categories/${CategoryID}/GraphAnalyses`}
            >
              Graph analyses
            </a>
          </button>
        </div>
        <div>
          <button className="block w-full bg-red-400 text-black rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a
              className="w-full text-nowrap text-xs md:text-sm lg:text-md"
              href={`/shops/${id}/stockroom/categories`}
            >
              Go back
            </a>
          </button>
        </div>
        <div
          className={
            IsDarkModeActive ? "ItemsAtDark mt-1" : "ItemsAtLight mt-1"
          }
        >
          <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
            Your items
          </h2>
          <ul>
            {category.items.length == 0 ? (
              <>
                <li>
                  <em className="mx-auto leading-none text-xs md:text-sm lg:text-md">
                    No items were found in this category. Please create new
                    items or go to a different category.
                  </em>
                </li>
              </>
            ) : (
              <>
                {category.items.map((item) => (
                  <li
                    className={
                      IsDarkModeActive
                        ? "BoxAtDark container HoverOnListsForDark text-left mx-auto p-1 mb-1 rounded"
                        : "BoxAtLight container HoverOnListsForLight text-left mx-auto p-1 mb-1 rounded"
                    }
                    key={inc++}
                  >
                    <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                      {item.ItemName}
                    </h2>
                    {/* Aligning image at left and other content on right */}
                    <div className="flex flex-col md:flex md:flex-row">
                      <div className="my-1 md:w-1/3">
                        <img
                          className="w-full rounded"
                          src={item.ItemPath}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col justify-center pt-1 md:pt-0 md:pl-2 md:w-2/3">
                        <div>
                          <p className="text-wrap leading-none text-xs md:text-sm lg:text-md">
                            {item.ItemDescription}
                          </p>
                          <div>
                            <div className="sm:mt-1">
                              <Link
                                to={`/shops/${id}/stockroom/categories/${CategoryID}/${item._id}`}
                              >
                                <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                                  View item
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
