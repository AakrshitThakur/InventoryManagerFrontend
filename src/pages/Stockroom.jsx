import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Stockroom.css";

export default function Stockroom() {
  // Matching id from URL using useParams() hook
  const { id } = useParams();

  const navigate = useNavigate();

  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stockroom relative flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-cover bg-center flex-1 p-1">
      <div className="absolute top-0 left-0 w-5 sm:w-7 mt-1">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/WhiteBackArrow.png" alt="" />
        </button>
      </div>
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-[rgba(0,0,0,0.75)] backdrop-blur-sm w-11/12 sm:w-3/4 p-1 md:p-2 rounded"
            : "BoxShadowAtLight bg-[rgba(255,255,255,0.55)] backdrop-blur-sm w-11/12 sm:w-3/4 p-1 md:p-2 rounded"
        }
      >
        <h1 className="text-nowrap text-center text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-3">
          Stockroom
        </h1>
        <div>
          <button className="block w-full text-xs md:text-sm lg:text-md TangerineColor text-black rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a className="w-full" href={`/shops/${id}/stockroom/categories`}>
              View categories
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}
