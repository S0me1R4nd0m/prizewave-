import { useState, useEffect } from "react";

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if viewport width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}
