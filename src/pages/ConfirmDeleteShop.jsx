import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";

export default function ConfirmDeleteShop() {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  const navigate = useNavigate();
  const { id } = useParams();

  // Deleting current shop from the DB
  const HandleDeleteShop = async () => {
    try {
      const response = await axios.post(
        `https://inventorymanagerbackend.onrender.com/shops/${id}/delete`,
        {},
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
        console.log(response.data.msg);
        const MsgObj = {
          msg: response.data.SuccessMsg,
          status: "success",
        };
        navigate("/shops", { state: MsgObj });
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

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ConfirmDeleteShop relative bg-MobileCreateEditDeleteBgImg sm:bg-DesktopCreateEditDeleteBgImg bg-coverCreateOrEditPageBgImg bg-cover bg-center flex-1 flex flex-col justify-center items-center p-1 md:p-2">
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
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-1">
          Sure you want to delete this shop?
        </h1>
        <div>
          <span className="mr-1">
            <button
              className="text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 bg-green-400 text-black rounded"
              onClick={HandleDeleteShop}
            >
              Yes
            </button>
          </span>
          <span>
            <button className="text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 bg-red-400 text-black rounded">
              <a href="/shops/ViewMyShops">No</a>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
