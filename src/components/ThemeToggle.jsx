import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = document.documentElement; // <html>
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors" >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
