"use client";

import { Divider, Menu, MenuItem } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading } from "../../slices/loadingSlice";
import styles from "./index.module.css";

const MenuComponent = ({ menuItemsStyle = ``, menuAnchor, menuItems }) => {
    const [ anchorEl, setAnchorEl ] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const myMenuItems = [ ...menuItems ];

    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    };

        const handleClose = ( link = null ) => {
            setAnchorEl(null);
            if (link && link !== pathname) {
                dispatch(showLoading()); // Only show loading for different page navigation
                router.push(link);
            } else if (link === pathname) {
                // Same page navigation - just navigate without loading
                router.push(link);
            }
        };

    return (
        <div>
            <div onClick={handleClick}>
                { menuAnchor }
            </div>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(null)}
                onClick={() => handleClose(null)}
                slotProps={{
                    paper: {
                        sx: {
                            '& .MuiMenuItem-root': {
                                padding: '6px 16px',
                                minHeight: '37px',
                                minWidth: '139px'
                            },
                            '& .MuiList-root': {
                                padding: '8px 0'
                            }
                        }
                    }
                }}
            >
                { myMenuItems.map(( item, index ) => {
                    return (
                        ( item.role == "Divider" && <Divider key={index} /> )
                        ||
                        <MenuItem key={index} onClick={() => {handleClose(item.link)}}>
                            <div className={styles.menuItemBox + (menuItemsStyle == ``? ``:(` ${menuItemsStyle}`))}>
                                {item.content}
                            </div>
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

export default MenuComponent;