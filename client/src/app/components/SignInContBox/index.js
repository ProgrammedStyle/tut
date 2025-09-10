import styles from "./index.module.css";
import layoutStyles from "../../layoutIndex.module.css";

const SignInContBox = ({ children }) => {
    return (
        <div className={styles.cont + " " + layoutStyles.bodyCont}>
            {children}
        </div>
    );
};

export default SignInContBox;