import { IconButton } from "@mui/material";

const WhiteIconButton = ({ children, ...props }) => {
    const newProps = { ...props };
    newProps.TouchRippleProps = {
        sx: {
            color: "rgba(255, 255, 255, 0.7)"
        }
    };
    return (
        <IconButton { ...newProps }>
            { children }
        </IconButton>
    );
};

export default WhiteIconButton;