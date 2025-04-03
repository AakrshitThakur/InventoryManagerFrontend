import { useState, useEffect } from "react";
import PopupMenu from "./PopupMenu";
import DarkMode from "./DarkMode.jsx";
import "../CSS/Navbar.css";

export default function Navbar() {
  // Toggle mobile menu
  const [IsMobileMenuOpen, SetIsMobileMenuOpen] = useState(
    localStorage.getItem("DarkMode") === "true"
  );

  const ToggleMobileMenu = () => {
    SetIsMobileMenuOpen(!IsMobileMenuOpen);
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

  return (
    <header
      className={
        IsDarkModeActive
          ? "NavbarDark sticky top-0 z-50 bg-white dark:bg-black"
          : "NavbarLight sticky top-0 z-50 bg-white dark:bg-black"
      }
    >
      <nav className="p-1 sm:p-2">
        <div className="px-1 sm:px-2">
          <div className="flex justify-between items-center h-16">
            {/* Logo  */}
            <div className="mr-1 md:mr-2 flex flex-shrink-0">
              <div className="BoxAtLight w-16 mr-1 rounded">
                <img
                  className="w-full rounded"
                  src="/icons/InventoryManagerLogo.jpeg"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center">
                <a href="/shops" className="text-3xl">
                  InventoryManager
                </a>
              </div>
            </div>
            {/* Menu for larger screens  */}
            <div
              className={
                IsDarkModeActive
                  ? "DesktopLinksDark hidden md:flex items-center space-x-4"
                  : "DesktopLinksLight hidden md:flex items-center space-x-4"
              }
            >
              <button className="bg-green-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
                <a href="/signup">Sign up</a>
              </button>
              <button className="bg-green-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
                <a href="/login">Log in</a>
              </button>
              <button className="bg-red-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black rounded px-1 md:py-1 md:px-2">
                <a href="/logout">Log out</a>
              </button>
              <PopupMenu />
              <DarkMode />
            </div>
            {/* Hamburger menu button for smaller screens  */}
            <div className="md:hidden flex items-center">
              <button
                id="menu-button"
                onClick={ToggleMobileMenu}
                className={
                  IsDarkModeActive
                    ? "MenuBtnDark text-white focus:outline-none"
                    : "MenuBtnLight text-black focus:outline-none"
                }
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Dropdown menu for smaller screens  */}
        {IsMobileMenuOpen && (
          <div
            id="mobile-menu"
            className={
              IsDarkModeActive
                ? "MobileLinksDark box-border flex flex-col opacity-0 md:hidden mt-1"
                : "MobileLinksLight box-border flex flex-col opacity-0 md:hidden mt-1"
            }
          >
            <button className="PrussianBlueColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-white mb-1 rounded">
              <a href="/shops/create">Create shop</a>
            </button>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/shops/ViewMyShops">View my shops</a>
            </button>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/reqs/ViewReqsReceived">View reqs received</a>
            </button>
            <button className="TangerineColor text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/reqs/ViewSentReqs">View sent reqs</a>
            </button>
            <button className="bg-green-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/signup">Sign up</a>
            </button>
            <button className="bg-green-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/login">Log in</a>
            </button>
            <button className="bg-red-400 text-nowrap text-xs sm:text-sm md:text-md lg:text-lg text-black mb-1 rounded">
              <a href="/logout">Log out</a>
            </button>
            <DarkMode />
          </div>
        )}
      </nav>
    </header>
  );
}
