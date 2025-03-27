import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode.js";
import ToastMsg from "../components/ToastMsg.jsx";
import "../CSS/LoadingPageSpinner.css";
import "../CSS/Shops.css";
import axios from "axios";

let inc = 1;
let MsgObj = undefined;
export default function Shops() {
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [AllShops, SetAllShops] = useState([]);

  // State used for search operations
  const [search, SetSearch] = useState({
    SearchString: "",
    FilterBy: "owner",
  });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  // Clearing the SearchString and FilterBy property values of the search object to their default values
  const clear = () => {
    SetSearch({
      SearchString: "",
      FilterBy: "owner",
    });
  };

  const HandleSetSearch = (name, value) => {
    SetSearch((prev) => ({ ...prev, [name]: value }));
  };

  // Searching for the relevent results. Executed when search object is changed.
  useEffect(() => {
    const SearchResults = async () => {
      const response = await axios.get(`https://inventorymanagerbackend.onrender.com/shops`, {
        params: {
          SearchString: search.SearchString,
          FilterBy: search.FilterBy,
        },
        withCredentials: true,
      });
      try {
        if (response.data.GeneralError) {
          navigate("/GeneralError", {
            state: {
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else SetAllShops(response.data.shops);
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
    SearchResults();
  }, [search]);
 
  const HandleOnChange = async (event) => {
    const { name, value } = event.target;
    HandleSetSearch(name, value);
  };

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    // To remove the previous value (after 1 sec) holded by state of navigation
    const timer = setTimeout(() => {
      MsgObj = undefined;
    }, 1000);
    navigate(location.pathname, { replace: true });
    return () => {
      clearTimeout(timer);
    };
  }, [navigate, location.state]);

  return (
    <div className="shops flex flex-col justify-center items-center flex-1 bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center p-1">
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}

      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark grid place-items-center bg-[rgba(0,0,0,0.75)] backdrop-blur-sm w-11/12 sm:w-10/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
            : "BoxShadowAtLight grid place-items-center bg-[rgba(255,255,255,0.55)] backdrop-blur-sm w-11/12 sm:w-10/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
        }
      >
        <div className="w-3/4 sm:w-2/3 md:w-1/2">
          <div className="mb-1">
            <input
              className={
                IsDarkModeActive
                  ? "BoxAtDark w-full p-5 rounded text-lg md:text-xl lg:text-2xl bg-white text-black"
                  : "BoxAtLight w-full p-5 rounded text-lg md:text-xl lg:text-2xl"
              }
              name="SearchString"
              value={search.SearchString}
              onChange={HandleOnChange}
              type="text"
              placeholder="Search here..."
            />
          </div>
          <div className="mb-1">
            <select
              className={
                IsDarkModeActive
                  ? "BoxAtDark sm:h-7 w-1/2 mr-1 p-1 text-xs md:text-sm lg:text-md text-black rounded"
                  : "BoxAtLight sm:h-7 w-1/2 mr-1 p-1 text-xs md:text-sm lg:text-md rounded"
              }
              name="FilterBy"
              value={search.FilterBy}
              onChange={HandleOnChange}
            >
              <option value="owner">Owner</option>
              <option value="ShopName">Shop-name</option>
              <option value="address">Address</option>
            </select>
            <button
              className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-red-400 text-black rounded"
              onClick={clear}
            >
              Clear
            </button>
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl text-center leading-none">
            Search for shopkeepers to interact with them!
          </h2>
        </div>

        {AllShops.length > 0 && (
          <>
            <ul className="w-11/12">
              {AllShops.map((shop) => (
                <li
                  className={
                    IsDarkModeActive
                      ? "BoxAtDark container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                      : "BoxShadowAtLight container mx-auto mb-1 p-2 sm:mb-2 sm:p-3 md:mb-2 md:p-3 rounded"
                  }
                  key={inc++}
                >
                  <h2 className="text-lg md:text-xl lg:text-2xl">
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
                    <div className="flex flex-col justify-center pt-1 md:pt-0 md:pl-2 md:w-2/3">
                      <div>
                        <div
                          className={
                            IsDarkModeActive
                              ? "BorderBottomAtDark border-b"
                              : "BorderBottomAtLight border-b"
                          }
                        >
                          <p className="text-wrap leading-none text-xs md:text-sm lg:text-md">
                            {shop.description}
                          </p>
                        </div>
                        <div
                          className={
                            IsDarkModeActive
                              ? "BorderBottomAtDark border-b"
                              : "BorderBottomAtLight border-b"
                          }
                        >
                          <address className="text-wrap leading-none text-xs md:text-sm lg:text-md">
                            {shop.address}
                          </address>
                        </div>
                        <div>
                          <div className="sm:mt-1">
                            <Link to={`/shops/${shop._id}`}>
                              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                                View shop
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
