import { useState, useEffect } from "react";

export default function DarkMode() {
  // Toggle DarkMode
  const [DarkMode, SetDarkMode] = useState(false);

  // Update the state
  useEffect(() => {
    const ModeStorage = localStorage.getItem("DarkMode") === "true";
    SetDarkMode(ModeStorage);
  }, []);

  // Main logic behind toggling of dark and light mode
  // toggle local Storage item
  useEffect(() => {
    if (DarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("DarkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("DarkMode", "false");
    }
  }, [DarkMode]);

  return (
    <div className="DarkMode flex justify-center items-center">
      <button
        className="bg-white rounded "
        onClick={() => SetDarkMode(!DarkMode)}
      >
        {DarkMode ? (
          <svg
            className="bg-white p-1 rounded"
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g
                clipPath="url(#a)"
                stroke="#000000"
                strokeWidth="1.5"
                strokeMiterlimit="10"
              >
                {" "}
                <path
                  d="M5 12H1M23 12h-4M7.05 7.05 4.222 4.222M19.778 19.778 16.95 16.95M7.05 16.95l-2.828 2.828M19.778 4.222 16.95 7.05"
                  strokeLinecap="round"
                />{" "}
                <path
                  d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  fill="#000000"
                  fillOpacity=".16"
                />{" "}
                <path d="M12 19v4M12 1v4" strokeLinecap="round" />{" "}
              </g>{" "}
              <defs>
                {" "}
                <clipPath id="a">
                  {" "}
                  <path fill="#ffffff" d="M0 0h24v24H0z" />{" "}
                </clipPath>{" "}
              </defs>{" "}
            </g>
          </svg>
        ) : (
          <svg
            className="BoxAtLight p-1 rounded"
            width="30px"
            height="30px"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              {" "}
              <title>dark-mode</title>{" "}
              <g id="Layer_2" data-name="Layer 2">
                {" "}
                <g id="Icons">
                  {" "}
                  <g>
                    {" "}
                    <rect width="48" height="48" fill="none" />{" "}
                    <g>
                      {" "}
                      <path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z" />{" "}
                      <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z" />{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
        )}
      </button>
    </div>
  );
}
