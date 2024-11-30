import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import csrfProtection from "../utils/csrf.js";

const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(csrfProtection, protect, getUserProfile)
  .put(csrfProtection, protect, updateUserProfile);

export default router;
