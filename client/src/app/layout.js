'use client';

import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import Header from "./components/Header";
import styles from "./layoutIndex.module.css";
import { Provider } from "react-redux";
import { store } from "./store";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={styles.html}>
      <body className={styles.body}>
        <Provider store={ store }>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
