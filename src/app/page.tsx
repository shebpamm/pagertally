"use client"

import { useState } from "react"
import { Settings, Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { calculateStandbyCompensationUntil } from "../lib/calc"

import { useInterval } from 'usehooks-ts'

export default function MoneyDisplay() {
  const [compensation, setCompensation] = useState(calculateStandbyCompensationUntil(Date.now(), 1))
  const { theme, toggleTheme, themeColors } = useTheme()

  useInterval(() => {
    const tz = new Date().getTimezoneOffset()*60*1000
    const comp = calculateStandbyCompensationUntil(Date.now() - tz, 16.405)
    console.log(comp)
    setCompensation(comp)
  }, 1000)

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
      <button className={`absolute top-4 right-4 p-2 ${themeColors.settingsButton} transition-colors`}>
        <Settings size={24} />
      </button>
      <div className="text-center">
        <h1 className={`text-6xl sm:text-8xl md:text-9xl font-bold ${themeColors.text}`}>
          {compensation.totalCompensation.toFixed(2).toLocaleString()}€
        </h1>
        <p className={`mt-4 text-xl ${themeColors.subText}`}>Total Amount</p>
      </div>
    </div>
  )
}

