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
      className="fixed bottom-6 right-6 z-50 group flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-105 transition-all"
    >
      <Sun className="h-5 w-5 text-foreground rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform duration-500" />
      <Moon className="absolute h-5 w-5 text-foreground rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform duration-500" />
    </button>
  );
}
