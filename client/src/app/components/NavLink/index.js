"use client";

import { Box, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../slices/loadingSlice";
import WhiteIconButton from "../WhiteIconButton";

const NavLink = ({ role = null, title = "", link = null }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    
        const handleClick = () => {
            if (link) {
                dispatch(showLoading()); // Show loading immediately
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
                    fontSize: '23px' // Fixed desktop size for all screens
                }
            }}
        >
            { role }
        </Box>
    );
    return (
        <WhiteIconButton
            sx={{
                p: "8px", // Fixed desktop padding for all screens
                minWidth: '40px', // Fixed desktop size for all screens
                minHeight: '40px' // Fixed desktop size for all screens
            }}
        >
            <Tooltip title={title}>
                {roleBox}
            </Tooltip>
        </WhiteIconButton>
    );
};

export default NavLink;