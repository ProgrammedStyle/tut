"use client";

import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from "./layoutIndex.module.css";
import { Provider } from "react-redux";
import { store } from "./store";
import LoadingCont from "./components/LoadingCont";
import "./index.css";
import { usePageTracking } from "./hooks/usePageTracking";
import UniversalLoadingHandler from "./components/UniversalLoadingHandler";
import { useAuthPersistence } from "./hooks/useAuthPersistence";
import { LanguageProvider } from "./contexts/LanguageContext";

function LayoutContent({ children }) {
  // Track page views
  usePageTracking();
  
  // Restore authentication from localStorage
  useAuthPersistence();
  
  return (
    <>
      <UniversalLoadingHandler />
      <LoadingCont />
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={styles.html}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={styles.body}>
        <Provider store={ store }>
          <LanguageProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LayoutContent>{children}</LayoutContent>
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </body>
    </html>
  );
};