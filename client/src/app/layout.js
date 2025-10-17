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
import { Oswald } from "next/font/google";
import { Suspense } from "react";

const oswald = Oswald({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

function LayoutContent({ children }) {
  // Track page views
  usePageTracking();
  
  // Restore authentication from localStorage
  useAuthPersistence();
  
  return (
    <>
      <Suspense fallback={null}>
        <UniversalLoadingHandler />
      </Suspense>
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
      </head>
      <body className={`${styles.body}`}>
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