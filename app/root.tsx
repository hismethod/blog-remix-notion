import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import React, { useState } from "react";
import styles from "./styles/app.css";
import lightStyles from "./styles/light.css";
import darkStyles from "./styles/dark.css";
import { NonFlashOfWrongThemeEls, ThemeProvider, useTheme } from "./utils/theme-provider";
import clsx from "clsx";

const appTitle = "bebright 블로그";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: appTitle,
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: lightStyles },
  { rel: "stylesheet", href: darkStyles, media: "(prefers-color-scheme: dark)" },
];

export default function App() {
  return (
    <ThemeProvider>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

function Document({ children }: { children: React.ReactNode; title?: string }) {
  const [theme] = useTheme();
  return (
    <html lang="ko" className={clsx(theme)}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls />
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
      <div className="container error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
