// backend/routes/employee.js
import express from "express";
import { createEmployee, getEmployees } from "../controllers/employeeController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Only admin can manage employees
router.post("/", authenticate, authorizeRoles("admin"), createEmployee);
router.get("/", authenticate, authorizeRoles("admin"), getEmployees);

export default router;
