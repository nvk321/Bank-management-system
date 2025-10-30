import express from "express";
import { createBranch, getBranches } from "../controllers/branchController.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post("/", authenticate, createBranch); // admin only ideally
router.get("/", authenticate, getBranches);

export default router;
