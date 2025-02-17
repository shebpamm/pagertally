"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { calculateStandbyCompensationUntil } from "../lib/calc";

import StandbyCompensationSettings from "@/components/settings";

import { useInterval } from "usehooks-ts";

export default function MoneyDisplay() {
  const getTz = () => new Date().getTimezoneOffset() * 60 * 1000;
  const getCompensation = () => calculateStandbyCompensationUntil(Date.now() - getTz(), pay);

  const initialPayObj = localStorage.getItem("standbyCompensation");
  const initialPay = initialPayObj ? parseFloat(initialPayObj) : 0;
  const [pay, setPay] = useState(initialPay);
  const [compensation, setCompensation] = useState(
    getCompensation()
  );

  const { theme, toggleTheme, themeColors } = useTheme();

  useInterval(() => {
    setCompensation(getCompensation());
  }, 1000);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${themeColors.background} p-4 transition-colors duration-300`}
    >
      <button
        onClick={toggleTheme}
        className={`absolute top-4 left-4 p-2 ${themeColors.settingsButton} transition-colors`}
      >
        {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
      </button>
      <button
        className={`absolute top-4 right-4 p-2 ${themeColors.settingsButton} transition-colors`}
      >
        <StandbyCompensationSettings onCompensationChange={pay => setPay(pay)}/>
      </button>
      <div className="text-center">
        <h1
          className={`text-6xl sm:text-8xl md:text-9xl font-bold ${themeColors.text}`}
        >
          {compensation.totalCompensation.toFixed(2).toLocaleString()}€
        </h1>
        <p className={`mt-4 text-xl ${themeColors.subText}`}>Total Amount</p>
      </div>
    </div>
  );
}
