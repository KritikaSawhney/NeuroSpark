
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Add page transition effect
    document.body.style.transition = "opacity 0.3s ease-in-out";
    document.body.style.opacity = "0.8";
    
    setTimeout(() => {
      document.body.style.opacity = "1";
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      disabled={isAnimating}
      className={`transition-all duration-500 overflow-hidden relative ${isAnimating ? 'animate-shake' : 'hover:scale-110'}`}
    >
      {theme === "light" ? (
        <>
          <Moon size={18} className="animate-bounce-subtle" />
          <span className="absolute inset-0 bg-primary/10 rounded-full scale-0 animate-ping-once"></span>
        </>
      ) : (
        <>
          <Sun size={18} className="animate-pulse" />
          <span className="absolute inset-0 bg-yellow-500/10 rounded-full scale-0 animate-ping-once"></span>
        </>
      )}
    </Button>
  );
};
