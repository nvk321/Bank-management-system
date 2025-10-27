import express from "express";
import { loginUser, seedAdmin, registerUser } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/seed-admin", seedAdmin);    // call once, then remove/disable
router.post("/register", registerUser);   // create user + customer (for customers)

export default router;
