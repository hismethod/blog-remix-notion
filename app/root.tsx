import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { theme } from "./theme";
import React, { useState } from "react";

const appTitle = "bebright 블로그";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: appTitle,
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
        <Document>
          <Outlet />
        </Document>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

function Document({ children }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        <StylesPlaceholder />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
