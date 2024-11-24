import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addPassword,
  getPassword,
  getUserPasswords,
  deletePassword,
  updatePassword,
} from "../controllers/passwordsController.js";

const router = express.Router();

router.route("/").post(protect, addPassword);
router.route("/").get(protect, getUserPasswords);
router.route("/:id").get(protect, getPassword);
router.route("/:id").delete(protect, deletePassword);
router.route("/:id").put(protect, updatePassword);

export default router;
