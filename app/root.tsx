import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import '~/styles/global.css'
import { light, dark } from '~/styles/theme.css'

import * as styles from '~/root.css'
import { Header } from "./components/atoms/Header";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(dark);

  const toggleTheme = () => {
    setTheme(prev => prev === light ? dark : light);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" as="style" />


        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" />

        <link rel="preload" href="https://flagcdn.com/gd.svg" as="image" />
        <link rel="preload" href="https://flagcdn.com/ch.svg" as="image" />
        <link rel="preload" href="https://flagcdn.com/sl.svg" as="image" />
        <link rel="preload" href="https://flagcdn.com/hu.svg" as="image" />

        <Meta />
        <Links />
      </head>
      <body>
        <div id="app" className={`${theme} ${styles.container}`}>
          <Header theme={theme}  onToggle={toggleTheme}/>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
