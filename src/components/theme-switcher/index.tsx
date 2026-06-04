import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../common/Button";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button onClick={toggleTheme}>
      {theme === "light" ? "◑" : "○"} {t("toolbar.theme")}
    </Button>
  );
};
