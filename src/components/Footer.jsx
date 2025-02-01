import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import { useState, useEffect } from "react";
import "../CSS/Footer.css";

export default function Footer() {
  const [IsDarkMode, SetIsDarkMode] = useState(localStorage.getItem("DarkMode") === "true");
  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkMode);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      className={
        IsDarkMode ? "DarkFooter bg-black text-white" : "bg-black text-white"
      }
    >
      <div className="p-1 sm:p-2 lg:p-3">
        <div className="flex flex-col md:flex-row md:justify-evenly gap-3">
          <div className="AboutUsFooter basis-6/12">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl mb-1">
              About Us
            </h2>
            <p className="text-justify leading-tight text-white">
              This website, developed by Aakrshit Thakur, a BCA graduate,
              provides an efficient solution for shopkeepers and individuals to
              seamlessly manage and organize their inventory or goods.{" "}
            </p>
          </div>

          <div className="basis-3/12">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl mb-1">
              Quick Links
            </h2>
            <ul>
              <li className="flex justify-start">
                <div>
                  <button className="text-nowrap text-xs md:text-sm lg:text-md px-1 md:py-1 md:px-2 mr-1 bg-green-400 text-black rounded">
                    <a href="/shops/login">Log in</a>
                  </button>
                </div>
                <div>
                  <button className="text-nowrap text-xs md:text-sm lg:text-md px-1 md:py-1 md:px-2 mr-1 bg-red-400 text-black rounded">
                    <a href="/shops/logout">Log out</a>
                  </button>
                </div>
                <div>
                  <button className="TangerineColor text-nowrap text-xs md:text-sm lg:text-md px-1 md:py-1 md:px-2 text-black rounded">
                    <a href="/shops">View all shops</a>
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div className="basis-3/12">
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl mb-1">
              Follow Us
            </h2>
            <ul className="flex space-x-4">
              <li className="flex justify-start">
                <div className="w-5 sm:w-6 md:w-7 mr-1">
                  <a href="https://www.linkedin.com/in/aakrshit-thakur-14433627b/">
                    <img
                      className="w-full rounded"
                      src="/icons/LinkedinIcon.png"
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-5 sm:w-6 md:w-7">
                  <a href="https://github.com/AakrshitThakur">
                    <img
                      className="w-full rounded"
                      src="/icons/GithubIcon.png"
                      alt=""
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
