import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import styles from "./styles/app.css";
import lightStyles from "./styles/light.css";
import darkStyles from "./styles/dark.css";
import { NonFlashOfWrongThemeEls, Theme, ThemeProvider, useTheme } from "./utils/theme.provider";
import clsx from "clsx";
import { getThemeSession } from "./utils/theme.server";
import Layout from "./components/layout/Layout";

const appTitle = "bebright 블로그";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: appTitle,
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: lightStyles },
];

export type LoaderData = {
  colorTheme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    colorTheme: themeSession.getTheme(),
  };

  return data;
};

export default function App() {
  const { colorTheme } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={colorTheme}>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}

function Document({ children }: { children: React.ReactNode; title?: string }) {
  const data = useLoaderData<LoaderData>();
  const [colorTheme] = useTheme();

  return (
    <html lang="ko" className={clsx(colorTheme)}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.colorTheme)} />
      </head>
      <body>
        <Layout>{children}</Layout>
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
