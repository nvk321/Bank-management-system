import express from "express";
import { getAccounts, createAccount, getAccountsByCustomer } from "../controllers/accountController.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authenticate, getAccounts); // list all (admin/employee)
router.post("/", authenticate, createAccount);
router.get("/customer/:customerId", authenticate, getAccountsByCustomer);

export default router;
