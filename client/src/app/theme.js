import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2"
        },

        secondary: {
            main: "#dc004e"
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "arial", sans-serif'
    }
});

export default theme;