"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "../theme/theme-switch";

const Header = () => {
  const [isScrolledUp, setIsScrolledUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <header
      className={`sticky top-0 z-50 max-w-5xl md:max-w-screen-xl mx-auto border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolledUp ? "" : "transform -translate-y-full transition-transform ease-in-out duration-300"
        }`}
      style={{ transition: "transform 0.3s ease-in-out" }}
    >
      <div className="flex h-14 items-center justify-between mx-3 md:mx-8">
        <nav className="flex items-center gap-4 text-sm lg:gap-6 text-foreground/60">
          <Link href="/" className="text-foreground/80 font-semibold">
            CSView
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              window.open("https://github.com/muhammad-zulfikar/csview", "_blank");
            }}
            className="transition-colors hover:text-foreground/80 flex items-center gap-1"
          >
            <GitHubLogoIcon className="text-foreground/80" />
            <span className="sr-only">GitHub</span>
          </Button>
          <ThemeSwitch />
        </div>
      </div>
      <div className="border-t border-border/50"></div>
    </header>
  );
};

export default Header;
