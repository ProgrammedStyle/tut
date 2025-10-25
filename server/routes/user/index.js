import express from "express";
import emailVerifySend from "../../controllers/user/email/verify/send.js";
import emailVerifyCheck from "../../controllers/user/email/verify/check.js";
import createUser from "../../controllers/user/create.js";
import signin from "../../controllers/user/signin.js";
import signout from "../../controllers/user/signout.js";
import forgotPassword from "../../controllers/user/forgotPassword.js";
import resetPassword from "../../controllers/user/resetPassword.js";
import getStats from "../../controllers/user/stats.js";
import { updateProfile, verifyNewEmail } from "../../controllers/user/profile.js";
import authenticateUser from "../../middleware/auth.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import listUsers from "../../controllers/user/list.js";
import deleteUser from "../../controllers/user/delete.js";
import updateStatus from "../../controllers/user/updateStatus.js";
import exportUsers from "../../controllers/user/export.js";
import socialRoutes from "./social/index.js";
import me from "../../controllers/user/me.js";

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
    console.log(`User route hit: ${req.method} ${req.path}`);
    next();
});

router.post("/email/verify/send", emailVerifySend);
router.post("/email/verify/check", emailVerifyCheck);
router.post("/create", createUser);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Social authentication routes
console.log('Registering social routes...');
router.use("/", socialRoutes);
console.log('Social routes registered');

// Protected routes (require authentication)
router.get("/me", authenticateUser, me); // Get current user from cookie
router.put("/profile", authenticateUser, updateProfile);
router.post("/verify-email", verifyNewEmail);

// Admin-only routes (require admin role)
router.get("/stats", requireAdmin, getStats); // Dashboard stats - admin only
router.get("/list", requireAdmin, listUsers); // User list - admin only
router.get("/export", requireAdmin, exportUsers); // Export users - admin only
router.delete("/:id", requireAdmin, deleteUser); // Delete user - admin only
router.put("/:id/status", requireAdmin, updateStatus); // Update user status - admin only

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "User routes are working!" });
});

export default router;