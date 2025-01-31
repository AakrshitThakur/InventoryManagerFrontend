import React, { useState, useEffect } from "react";

export default function OTP_countdown({ InitialSec }) {
  const [seconds, SetSeconds] = useState(InitialSec);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        SetSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Clear the interval when the component unmounts or the component re-renders
      return () => clearInterval(timer);
    }
  }, [seconds]);

  return (
    <span>
      {seconds > 0 ? (
        <span className="leading-none text-xs">{seconds}s</span>
      ) : (
        <span className="leading-none text-xs">Timeout! Please try again</span>
      )}
    </span>
  );
}
