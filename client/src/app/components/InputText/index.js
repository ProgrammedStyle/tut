"use client";

import styles from "./index.module.css";
import styled from "@emotion/styled";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const InputTextComponent = styled("div")(({ theme, label }) => ({
    "&::after": {
        content: `'${label}'`,
        color: "var(--labelColor)",
        fontSize: "var(--fontSize)",
        position: "absolute",
        top: "var(--after-top)",
        left: "var(--input-padding-x)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        transform: "scale(1)",
        transformOrigin: "left",
        transition: "transform 250ms cubic-bezier(0, 0, 0.2, 1) 0s, top 250ms cubic-bezier(0, 0, 0.2, 1) 0s",
        lineHeight: "1.2"
    }
}));

const InputText = forwardRef((
    {
        inputProps = {
            type: "text",
            value: "",
            name: "",
            error: null,
            inputTextStyle: ``
        }, 
        icon = null,
        borderBottom = false,
        bgColor = false,
        linesColor = "defColor",
        focusLinesColor = "focusDefColor",
        label = "Type here",
        focus = false,
        ...rest
    },
    extRef
) => {
    const inputRef = useRef(null);
    const componentRef = useRef(null);
    const inputIconBoxRef = useRef(null);

    const [ value, setValue ] = useState(inputProps.value.trim());

    const handleDivClick = e => {
        value.trim() == "" && inputRef.current.focus();
    };

    const handleInput = e => {
        (e.target.value.trim() == "")? e.target.setAttribute("inputempty", "true") : e.target.setAttribute("inputempty", "false");
        setValue(e.target.value);
    };

    useEffect(() => {
        const e = document.createElement("div");
        const afterElemStyle = window.getComputedStyle(componentRef.current, "::after");
        const componentStyle = window.getComputedStyle(componentRef.current);
        componentRef.current.style.setProperty("--after-top", `${afterElemStyle.top}`, "important");
        e.style.width = afterElemStyle.width;
        e.style.position = "absolute";
        e.style.transform = componentStyle.getPropertyValue("--inputTransform");
        e.style.visibility = "hidden";
        componentRef.current.appendChild(e);
        const inputBorderBoxLeftSpace = parseInt(componentStyle.getPropertyValue("--inputBorderBoxLeftSpace"));
        const moreSpaceToRight = 9;
        const newSpace = parseInt(e.getBoundingClientRect().width) - inputBorderBoxLeftSpace + moreSpaceToRight;
        componentRef.current.style.setProperty("--inputBorderRightSpace", newSpace + "px");
        componentRef.current.removeChild(e);
        inputRef.current.style.paddingRight = (parseInt(window.getComputedStyle(inputRef.current).paddingRight) + inputIconBoxRef.current.offsetWidth) + "px";
        focus && inputRef.current.focus();
    }, [label]);

    useImperativeHandle(extRef, () => inputRef.current);

    return (
        <div className={styles.inputTextCont}>
            <InputTextComponent ref={componentRef} label={label} className={(bgColor? `${styles.bgColor} `:``) + (styles[linesColor]) + ` ` + (styles[focusLinesColor]) + ` ` + (borderBottom? `${styles.borderBottom} `: ``) + styles.inputBox + (inputProps.inputTextStyle == ``? ``:` ${inputProps.inputTextStyle}`)} onClick={handleDivClick}>
                <input
                    { ...rest }
                    autoComplete="on"
                    type={inputProps.type}
                    name={inputProps.name}
                    value={value}
                    error={(inputProps.error && "true") || "false"}
                    onChange={handleInput}
                    inputempty={(value.trim() == "" && "true") || "false"}
                    ref={inputRef}
                />
                <div className={`${styles.borderBox} ${styles.leftBorderBox}`}>
                    <div className={styles.leftBorder}></div>
                </div>
                <div className={`${styles.borderBox} ${styles.rightBorderBox}`}>
                    <div className={styles.rightBorder}></div>
                </div>
                <div className={`${styles.borderBox} ${styles.bottomBorderBox}`}>
                    <div className={styles.bottomBorder}></div>
                </div>
                <div className={styles.inputIconBox} ref={inputIconBoxRef} onClick={e => e.stopPropagation()}>
                    {icon}
                </div>
            </InputTextComponent>
            <div className={styles.error}>
                {inputProps.error}
            </div>
        </div>
    )
});

InputText.displayName = "InputText";

export default InputText;