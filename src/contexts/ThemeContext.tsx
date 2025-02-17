"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import themeData from "../styles/theme.json";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeColors: typeof themeData.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === undefined) return

    const savedTheme = window.localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else {
        setTheme("light");
        window.localStorage.setItem("theme", "light");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === undefined) return

    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    window.localStorage.setItem("theme", newTheme);
  };

  const themeColors = themeData[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
