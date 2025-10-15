import styles from "./index.module.css";

const SignInContBox = ({ children }) => {
    return (
        <div className={styles.cont}>
            {children}
        </div>
    );
};

export default SignInContBox;