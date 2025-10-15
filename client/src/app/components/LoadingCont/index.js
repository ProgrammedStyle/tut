"use client";

import { useSelector } from "react-redux";
import { Box, LinearProgress, Backdrop } from "@mui/material";

const LoadingCont = () => {
    const { show } = useSelector((state) => state.loading);

    if (!show) return null;

    return (
        <>
            {/* White semi-transparent overlay - GMAIL STYLE */}
            <Backdrop
                sx={{
                    zIndex: 999998, // Below the progress bar
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Subtle white shadow like Gmail
                    backdropFilter: 'none'
                }}
                open={show}
            />
            
            {/* Gmail-style BLUE linear progress bar at the TOP */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999999,
                    height: '3px' // Gmail uses thin bar
                }}
            >
                <LinearProgress 
                    sx={{
                        height: '3px',
                        backgroundColor: 'transparent',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1a73e8', // Gmail blue (exact color)
                        }
                    }}
                />
            </Box>
        </>
    );
};

export default LoadingCont;