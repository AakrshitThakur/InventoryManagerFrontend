import { useState, useEffect } from "react";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Msg.css";

export default function Msg(MsgObj) {
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);
  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="msg mb-1">
      {MsgObj.status == "success" ? (
        <i>
          <p
            className={
              IsDarkModeActive
                ? "DarkMsgCustom leading-none text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 relative bg-green-400 text-black rounded"
                : "LightMsgCustom leading-none text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 relative bg-green-400 text-black rounded"
            }
          >
            {MsgObj.msg}
          </p>
        </i>
      ) : (
        <i>
          <p
            className={
              IsDarkModeActive
                ? "DarkMsgCustom leading-none text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2  bg-red-400 text-black rounded"
                : "LightMsgCustom leading-none text-xs md:text-sm lg:text-md px-1 py-1 md:px-2 md:py-2 bg-red-400 text-black rounded"
            }
          >
            {MsgObj.msg}
          </p>
        </i>
      )}
    </div>
  );
}
