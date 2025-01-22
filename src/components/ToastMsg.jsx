import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/ToastMsg.css";

const ToastMsg = ({ msg, status }) => {
  console.log("Under ToastMsg component");
  useEffect(() => {
    if (status == "success") {
      toast.success(<p className="leading-none md:leading-tight">{msg}</p>, {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className:
          "text-xs sm:text-sm md:text-md bg-green-400 text-black",
      });
    } else if (status == "error") {
      toast.error(<p className="leading-none md:leading-tight">{msg}</p>, {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className:
          "text-xs sm:text-sm md:text-md bg-red-400 text-black",
      });
    }
  }, []);

  return (
    <div>
      <ToastContainer toastStyle={{ padding: "0.25rem" }} />
    </div>
  );
};

export default ToastMsg;
