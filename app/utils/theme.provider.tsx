import { createContext, useContext, useRef, useState, useEffect } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useFetcher } from "@remix-run/react";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const prefersDarkMQ = "(prefers-color-scheme: dark)";
const getPreferredTheme = () => (window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT);

function ThemeProvider({ children, specifiedTheme }: { children: ReactNode; specifiedTheme: Theme | null }) {
  const persistTheme = useFetcher();
  const persistThemeRef = useRef(persistTheme);
  const mountRun = useRef(false);

  const [colorTheme, setColorTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      } else {
        return null;
      }
    }

    if (typeof window !== "object") {
      return null;
    }

    return getPreferredTheme();
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ);
    const handleChange = () => {
      setColorTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!colorTheme) {
      return;
    }

    persistThemeRef.current.submit({ theme: colorTheme }, { action: "action/set-theme", method: "post" });
  }, [colorTheme]);

  return <ThemeContext.Provider value={[colorTheme, setColorTheme]}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches
    ? 'dark'
    : 'light';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    console.warn(
      "혹시 이 메시지가 보인다면 저에게 알려주세요. 감사합니다!",
    );
  } else {
    cl.add(theme);
  }

  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn(
      "혹시 이 메시지가 보인다면 저에게 알려주세요. 감사합니다!",
    );
  }
})();
`;

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme();

  return (
    <>
      <meta name="color-scheme" content={theme === "light" ? "light dark" : "dark light"} />
      {ssrTheme ? null : <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />}
    </>
  );
}

const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export { isTheme, NonFlashOfWrongThemeEls, Theme, ThemeProvider, useTheme };
