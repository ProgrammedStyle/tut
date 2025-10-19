"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { showLoading } from "../../slices/loadingSlice";

const Logo = ({ click = false }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();

        const handleClick = () => {
            if (pathname !== "/") {
                dispatch(showLoading()); // Only show loading if not already on home page
            }
            router.push("/");
        };

    return (
        <div className={((click && `${styles.click} `) || ``) + styles.logoCont} onClick={(click && handleClick) || null}>
            <Image src={"/tut-logo.png"} width={55} height={56} alt="Logo" className={styles.logo} />
        </div>
    );
};

export default Logo;