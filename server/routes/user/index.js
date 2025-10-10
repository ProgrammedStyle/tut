import emailVerifySend from "../../controllers/user/email/verify/send.js";
import emailVerifyCheck from "../../controllers/user/email/verify/check.js";
import createUser from "../../controllers/user/create.js";
import router from "./social/index.js";

router.post("/email/verify/send", emailVerifySend);
router.post("/email/verify/check", emailVerifyCheck);
router.post("/create", createUser);

export default router;