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
        fontFamily: '"Roboto", "Helvetica", "arial", sans-serif',
        // All screen sizes use desktop font sizes
        h1: {
            fontSize: '4rem', // 64px
        },
        h2: {
            fontSize: '3rem', // 48px
        },
        h3: {
            fontSize: '2.5rem', // 40px
        },
        h4: {
            fontSize: '2rem', // 32px
        },
        h5: {
            fontSize: '1.5rem', // 24px
        },
        h6: {
            fontSize: '1.25rem', // 20px
        },
        body1: {
            fontSize: '13px', // 18px
        },
        body2: {
            fontSize: '13px', // 16px
        },
        button: {
            fontSize: '1.125rem', // 18px
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minHeight: '48px',
                    padding: '12px 24px',
                    fontSize: '13px'
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: '12px'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        fontSize: '1rem'
                    }
                }
            }
        },
        MuiMenuItem: {
            defaultProps: {
                // Disable Material-UI's dense mode on mobile
                dense: false
            },
            styleOverrides: {
                root: {
                    // Desktop padding for all screen sizes
                    padding: '6px 16px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    fontSize: '1rem',
                    minHeight: '48px'
                },
                // Ensure gutters (dense mode) doesn't reduce padding
                gutters: {
                    paddingLeft: '16px',
                    paddingRight: '16px'
                }
            }
        },
        MuiList: {
            defaultProps: {
                // Disable dense list on mobile
                dense: false
            },
            styleOverrides: {
                root: {
                    // Ensure list padding is consistent
                    paddingTop: '8px',
                    paddingBottom: '8px'
                }
            }
        }
    }
});

export default theme;