import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import appStyles from "./styles/app.css";
import colorStyles from "./styles/light.css";
import { NonFlashOfWrongThemeEls, Theme, ThemeProvider, useColorTheme } from "./utils/theme-provider";
import clsx from "clsx";
import { getThemeSession } from "./utils/theme.server";
import Layout from "./components/layout/Layout";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "bebright 블로그",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: colorStyles },
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

export default function AppWithProviders() {
  const { colorTheme } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={colorTheme}>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const data = useLoaderData<LoaderData>();
  const [colorTheme] = useColorTheme();

  return (
    <html lang="ko" className={clsx(colorTheme)}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.colorTheme)} />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
