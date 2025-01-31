import { useState, useEffect } from "react";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/LoadingBarAnimation.css";

export default function LoadingBarAnimation() {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);
  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      {IsDarkModeActive ? (
        <div className="LoadingBarAnimationDark w-full">
          <div className="pt-1 ps-1 text-xs text-nowrap text-white rounded">
            Wait a second...
          </div>
        </div>
      ) : (
        <div className="LoadingBarAnimationLight w-full">
          <div className="pt-1 ps-1 text-xs text-nowrap text-white rounded">
            Wait a second...
          </div>
        </div>
      )}
    </>
  );
}
