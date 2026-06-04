import { useLayoutEffect, useState } from "react";

export const useUIPreferences = () => {
  const [theme, setThemeState] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") ?? "light",
  );
  const setTheme = (
    updater: "light" | "dark" | ((t: "light" | "dark") => "light" | "dark"),
  ) => {
    setThemeState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem("theme", next);
      return next;
    });
  };
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [devMode, setDevMode] = useState(false);

  return { theme, setTheme, sidebarOpen, setSidebarOpen, devMode, setDevMode };
};
