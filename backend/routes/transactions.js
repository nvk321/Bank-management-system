import express from "express";
import { deposit, withdraw, transfer } from "../controllers/transactionController.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post("/deposit", authenticate, deposit);
router.post("/withdraw", authenticate, withdraw);
router.post("/transfer", authenticate, transfer);

export default router;
