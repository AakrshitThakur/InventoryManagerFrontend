import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import ToastMsg from "../components/ToastMsg.jsx";
import "../CSS/Shop.css";
import axios from "axios";

let MsgObj = undefined;
export default function Shop() {
  // Using the useLocation() hook to retrieve statefull data from useNavigate() hook
  const location = useLocation();
  const navigate = useNavigate();

  // Have to set this variable initially because useEffect() will be ultimately going to change navigation state
  location.state && (MsgObj = location.state);

  const [shop, SetShop] = useState([]);
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  const [HasCRUDPermissions, SetHasCRUDPermissions] = useState(false);

  // Matching id from URL using useParams() hook
  const { id } = useParams();

  useEffect(() => {
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
          SetHasCRUDPermissions(response.data.HasCRUDPermissions);
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
    <div className="shop relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 p-1">
      {MsgObj && <ToastMsg msg={MsgObj.msg} status={MsgObj.status} />}
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1 ml-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm w-11/12 sm:w-10/12 md:w-9/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm w-11/12 sm:w-10/12 md:w-9/12 h-[75vh] overflow-y-scroll p-1 md:p-2 rounded"
        }
      >
        {shop.length == 0 ? (
          <div className="grid place-items-center h-screen">
            <span
              className={IsDarkModeActive ? "SpinnerAtDark" : "SpinnerAtLight"}
            ></span>
          </div>
        ) : (
          <section>
            <h2 className="text-lg md:text-xl lg:text-2xl">
              {shop.ShopName}(name)
            </h2>
            {/* Aligning image at left and other content on right */}
            <div className="flex flex-col sm:flex-row">
              <div className="my-1 sm:w-2/5">
                <img className="w-full rounded" src={shop.ShopImgURL} alt="" />
              </div>
              <div className="flex flex-col justify-center pt-1 md:pt-0 md:pl-2 sm:w-3/5">
                <div>
                  <div
                    className={
                      IsDarkModeActive
                        ? "BorderBottomAtDark border-b"
                        : "BorderBottomAtLight border-b"
                    }
                  >
                    <p className="text-wrap leading-none text-xs md:text-sm lg:text-md">
                      {shop.author}
                      <b className="text-xs md:text-sm lg:text-md">(owner)</b>
                    </p>
                  </div>
                  <div
                    className={
                      IsDarkModeActive
                        ? "BorderBottomAtDark border-b"
                        : "BorderBottomAtLight border-b"
                    }
                  >
                    <p className="text-wrap leading-none text-xs md:text-sm lg:text-md">
                      {shop.description}
                      <b className="text-xs md:text-sm lg:text-md">
                        (description)
                      </b>
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
                      <b className="text-xs md:text-sm lg:text-md">(address)</b>
                    </address>
                  </div>
                  <div className="flex flex-col justify-evenly items-center md:flex-row mt-1">
                    {HasCRUDPermissions ? (
                      <>
                        {/* <button className="text-nowrap text-xs md:text-sm lg:text-md mb-1 sm:mb-0 px-2 py-1 md:px-3 md:py-2 sm:mr-1 bg-green-400 text-black rounded">
                          <a href="/shops">View all shops</a>
                        </button> */}
                        <button className="w-10/12 md:w-auto text-nowrap text-xs md:text-sm lg:text-md mb-1 sm:mb-0 px-2 py-1 md:px-3 md:py-2 TangerineColor text-black rounded">
                          <a href={`/shops/${shop._id}/edit`}>Edit Shop</a>
                        </button>
                        <button className="w-10/12 md:w-auto text-nowrap text-xs md:text-sm lg:text-md mb-1 sm:mb-0 px-2 py-1 md:px-3 md:py-2 PrussianBlueColor text-white rounded">
                          <a href={`/shops/${id}/stockroom`}>Stockroom</a>
                        </button>
                        <button className="w-10/12 md:w-auto text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-red-400 text-black rounded">
                          <a href={`/shops/${id}/ConfirmDeleteShop`}>
                            Delete shop
                          </a>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="w-10/12 md:w-auto text-nowrap text-xs md:text-sm lg:text-md mb-1 sm:mb-0 px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                          <a href="/shops">View all shops</a>
                        </button>
                        <button className="w-10/12 md:w-auto text-nowrap text-xs md:text-sm lg:text-md mb-1 sm:mb-0 px-2 py-1 md:px-3 md:py-2 PrussianBlueColor text-white rounded">
                          <a href={`/shops/${id}/stockroom`}>Stockroom</a>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
