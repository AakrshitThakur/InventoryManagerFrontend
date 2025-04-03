import React, { useState, useRef, useEffect } from "react";

const PopupMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  // Checking if dark mode is active or not
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(
    localStorage.getItem("DarkMode") === "true"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      SetIsDarkModeActive(document.documentElement.classList.contains("dark"));
    });

    // Observe changes to the `class` attribute of the <html> element
    observer.observe(document.documentElement, { attributes: true });

    // Cleanup the observer on component unmount
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={menuRef}>
      <button onClick={toggleMenu} className="w-10 lg:w-11 text-nowrap rounded">
        <img className="w-full" src="/icons/ProfileIcon.png" alt="" />
      </button>

      {isOpen && (
        <div
          className={
            IsDarkModeActive
              ? "absolute flex flex-col justify-evenly items-center top-0 right-0 mt-12 md:w-44 md:h-44 lg:w-56 lg:h-56 bg-black BoxAtDark rounded z-50"
              : "absolute flex flex-col justify-evenly items-center top-0 right-0 mt-12 md:w-44 md:h-44 lg:w-56 lg:h-56 bg-white BoxAtLight rounded z-50"
          }
        >
          <div>
            <button className="PrussianBlueColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-white rounded px-1 md:py-1 md:px-2">
              <a href="/shops/create">Create shop</a>
            </button>
          </div>
          <div>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
              <a href="/shops/ViewMyShops">View my shops</a>
            </button>
          </div>
          <div>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
              <a href="/reqs/ViewReqsReceived">View reqs received</a>
            </button>
          </div>
          <div>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
              <a href="/reqs/ViewSentReqs">View sent reqs</a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
