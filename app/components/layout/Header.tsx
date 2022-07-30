import { Link } from "@remix-run/react";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { Theme, useTheme } from "~/utils/theme.provider";
import Logo from "../Logo";

export default function Header() {
  return (
    <nav className="sticky top-0 w-full backdrop-blur flex-none bg-white/50 dark:bg-black/50">
      <div className="relative flex items-center justify-between py-4">
        <Logo />
        <div className="relative flex items-center space-x-4">
          <Link to="/about">
            <span>About</span>
          </Link>
          <Link to="/post">
            <span>블로그</span>
          </Link>
          <AppColorThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

function AppColorThemeSwitcher() {
  const [theme, setTheme] = useTheme();
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };
  const iconSize = 24;

  return <button onClick={toggleTheme}>{theme == Theme.LIGHT ? <MdDarkMode size={iconSize} /> : <MdOutlineLightMode size={iconSize} />}</button>;
}
