import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Stockroom.css";

export default function Stockroom() {
  // Matching id from URL using useParams() hook
  const { id } = useParams();

  const [IsDarkModeActive, SetIsDarkModeActive] = useState(localStorage.getItem("DarkMode") === "true");

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stockroom flex flex-col justify-center items-center bg-[url('/images/GeneralBgImg.png')] bg-contain flex-1 p-1">
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark bg-black text-center w-3/4 lg:w-2/4 p-1 md:p-3 rounded"
            : "BoxShadowAtLight bg-opacity-10 backdrop-blur-md text-center w-3/4 lg:w-2/4 p-1 md:p-3 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-3">
          Stockroom
        </h1>
        <div>
          <button className="block w-full text-xs md:text-sm lg:text-md PrussianBlueColor text-white rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a className="w-full" href={`/shops/${id}/stockroom/categories`}>
              View categories
            </a>
          </button>
        </div>
        <div>
          <button className="block w-full text-xs md:text-sm lg:text-md bg-red-400 text-black rounded px-1 py-1 md:px-2 md:py-2">
            <a className="w-full" href={`/shops/${id}`}>
              Go back
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}
