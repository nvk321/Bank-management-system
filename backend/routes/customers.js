import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { createCustomer, getCustomers } from "../controllers/customerController.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin"), getCustomers); // get all customers (admin only)
router.post("/", authenticate, authorizeRoles("admin"), createCustomer);

export default router;
