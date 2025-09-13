import express from "express";
import {
  getManagerApprovals,
  getEmployeeApprovals,
  approveExpense,
} from "../controllers/approval.js";
import { validate } from "../middleware/validate-request.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { approveExpenseSchema } from "../data/expenseValidation-schema.js";

const router = express.Router();

// Get manager's approval history
router.get(
  "/manager",
  authenticate,
  requireRole("manager"),
  getManagerApprovals
);

// Get employee's approved expenses history
router.get(
  "/employee",
  authenticate,
  requireRole("employee"),
  getEmployeeApprovals
);

// Approve/reject expense (manager only)
router.patch(
  "/:id",
  authenticate,
  requireRole("manager"),
  validate(approveExpenseSchema),
  approveExpense
);

export default router;
