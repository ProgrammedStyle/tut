"use client";

import { Box, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import WhiteIconButton from "../WhiteIconButton";

const NavLink = ({ role = null, title = "", link = null }) => {
    const router = useRouter();
    
        const handleClick = () => {
            if (link) {
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
                    fontSize: { 
                        xs: '18px',
                        sm: '20px', 
                        md: '22px',
                        lg: '23px'
                    }
                }
            }}
        >
            { role }
        </Box>
    );
    return (
        <WhiteIconButton
            sx={{
                p: { 
                    xs: "5px",
                    sm: "6px", 
                    md: "7px",
                    lg: "8px"
                },
                minWidth: { 
                    xs: '32px',
                    sm: '36px',
                    md: '40px'
                },
                minHeight: { 
                    xs: '32px',
                    sm: '36px',
                    md: '40px'
                }
            }}
        >
            <Tooltip title={title}>
                {roleBox}
            </Tooltip>
        </WhiteIconButton>
    );
};

export default NavLink;