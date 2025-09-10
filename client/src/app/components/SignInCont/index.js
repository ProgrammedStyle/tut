import styles from "./index.module.css";

const SignInCont = ({ title = "", image = null, children = null }) => {
    return (
        <div className={styles.cont}>
            <div className={styles.contLBox}>
                {title && (
                <div className={styles.contTitle}>
                    {title}
                </div>
                )}

                {image && (
                <div>
                    {image}
                </div>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default SignInCont;