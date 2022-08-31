import { Link } from "@remix-run/react";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { Theme, useColorTheme } from "~/utils/theme-provider";
import Logo from "../Logo";

export default function Header() {
  return (
    <nav className="sticky top-0 px-10 backdrop-blur border-b-2 bg-white/90 dark:bg-black/90">
      <div className="container relative h-16 flex flex-row items-center justify-between py-4">
        <Logo />
        <div className="relative flex mx-auto text-xl items-center space-x-4">
          <Link to="/about">
            <span>About</span>
          </Link>
          <Link to="/post">
            <span>블로그</span>
          </Link>
        </div>
        <div>
          <AppColorThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

function AppColorThemeSwitcher() {
  const [colorTheme, setColorTheme] = useColorTheme();
  const toggleTheme = () => setColorTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  const iconSize = 24;

  return <button onClick={toggleTheme}>{colorTheme == Theme.LIGHT ? <MdDarkMode size={iconSize} /> : <MdOutlineLightMode size={iconSize} />}</button>;
}
