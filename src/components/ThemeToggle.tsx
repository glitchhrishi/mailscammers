import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "legitmail.theme";

function getInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem(KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--bronze)]/40 bg-card/90 backdrop-blur-md shadow-[var(--shadow-elegant)] hover:scale-105 hover:border-[var(--bronze)]/70 transition-all"
    >
      <Sun
        className="h-5 w-5 text-[var(--bronze)] rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform duration-500"
        strokeWidth={1.75}
      />
      <Moon
        className="absolute h-5 w-5 text-[var(--bronze)] rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform duration-500"
        strokeWidth={1.75}
      />
    </button>
  );
}
