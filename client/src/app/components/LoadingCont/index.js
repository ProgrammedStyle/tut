"use client";

import styles from "./index.module.css";

const LoadingCont = () => {
    return (
        <div className={styles.LoadingCont}>
            <div className={styles.loadingBarBox}>
                <div className={styles.first}></div>
                <div className={styles.second}></div>
            </div>
        </div>
    );
};

export default LoadingCont;