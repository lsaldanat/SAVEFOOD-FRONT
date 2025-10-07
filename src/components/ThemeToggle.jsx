// components/ThemeToggle.jsx
import useDarkMode from "../hooks/useDarkMode";

export default function ThemeToggle() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition"
    >
      {darkMode ? "🌙 Oscuro" : "☀️ Claro"}
    </button>
  );
}
