"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-3 right-3 md:bottom-4 md:right-4 p-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg shadow-md focus:outline-none backdrop-blur supports-[backdrop-filter]:bg-background/60
        ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    >
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  );
};

export default ScrollToTopButton;
