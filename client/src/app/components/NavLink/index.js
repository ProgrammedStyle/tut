import { Box, Tooltip } from "@mui/material";
import Link from "next/link";
import WhiteIconButton from "../WhiteIconButton";

const NavLink = ({ role = null, title = "", link = null }) => {
    const roleBox = (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"        >
            { role }
        </Box>
    );
    return (
        <WhiteIconButton
            sx={{
                p: "8px"
            }}
        >
            <Tooltip title={title}>
                {
                (link && <Link href={link} passHref>
                    { roleBox }
                </Link>)
                ||
                roleBox
                }
            </Tooltip>
        </WhiteIconButton>
    );
};

export default NavLink;