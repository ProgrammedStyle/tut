"use client";

import { Box, Tooltip } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../slices/loadingSlice";
import WhiteIconButton from "../WhiteIconButton";

const NavLink = ({ role = null, title = "", link = null }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    
        const handleClick = () => {
            if (link && link !== pathname) {
                dispatch(showLoading()); // Only show loading for different page navigation
                router.push(link);
            } else if (link === pathname) {
                // Same page navigation - just navigate without loading
                router.push(link);
            }
        };
    
    const roleBox = (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleClick}
            sx={{
                cursor: link ? 'pointer' : 'default',
                '& svg': {
                    fontSize: '28px' // Increased size for all screens
                }
            }}
        >
            { role }
        </Box>
    );
    return (
        <WhiteIconButton
            sx={{
                p: "10px", // Increased padding for all screens
                minWidth: '48px', // Increased size for all screens
                minHeight: '48px' // Increased size for all screens
            }}
        >
            <Tooltip title={title}>
                {roleBox}
            </Tooltip>
        </WhiteIconButton>
    );
};

export default NavLink;