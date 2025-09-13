import mongoose from "mongoose";
import Expense from "../models/expense.js";
import Approval from "../models/approval.js";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// Get manager's approval history
export const getManagerApprovals = async (req, res) => {
  const managerId = req.user.userId;

  const manager = await User.findById(managerId).populate({
    path: "approvals",
    select: "status date rejectReason expenseId",
    populate: {
      path: "expenseId",
      select: "amount description category expenseDate userId",
      populate: {
        path: "userId",
        select: "name email",
      },
    },
  });

  if (!manager) {
    throw new NotFoundError("Manager not found");
  }

  // Calculate statistics
  const numOfTreatedExpenses = manager.approvals.length;
  const approvedCount = manager.approvals.filter(
    (approval) => approval.status === "approved"
  ).length;
  const rejectedCount = manager.approvals.filter(
    (approval) => approval.status === "rejected"
  ).length;

  res.status(StatusCodes.OK).json({
    message: "Manager approval history retrieved successfully",
    manager: {
      name: manager.name,
      email: manager.email,
      role: manager.role,
    },
    stats: {
      numOfTreatedExpenses,
      approvedCount,
      rejectedCount,
    },
    finalizedExpenses: manager.approvals,
  });
};

// Get employee's approved expenses history
export const getEmployeeApprovals = async (req, res) => {
  const userId = req.user.userId;

  // Find all approvals for expenses created by this employee
  const approvals = await Approval.find({
    expenseId: { $exists: true },
  })
    .populate({
      path: "expenseId",
      match: { userId: new mongoose.Types.ObjectId(userId) },
      select: "amount description category expenseDate status",
    })
    .populate({
      path: "managerId",
      select: "name email role",
    });

  // Filter out null expenseId (expenses that don't belong to this user)
  const validApprovals = approvals.filter(
    (approval) => approval.expenseId !== null
  );

  // Calculate statistics
  const numOfTreatedExpenses = validApprovals.length;
  const approvedCount = validApprovals.filter(
    (approval) => approval.status === "approved"
  ).length;
  const rejectedCount = validApprovals.filter(
    (approval) => approval.status === "rejected"
  ).length;

  // Get employee info
  const employee = await User.findById(userId).select("name email role");

  res.status(StatusCodes.OK).json({
    message: "Processed expenses",
    employee: {
      name: employee.name,
      email: employee.email,
      role: employee.role,
    },
    statistics: {
      numOfTreatedExpenses,
      approvedCount,
      rejectedCount,
    },
    approvals: validApprovals,
  });
};

// Approve expense (manager only)
export const approveExpense = async (req, res) => {
  const { id } = req.params;
  const { status, rejectReason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new BadRequestError("Status must be 'approved' or 'rejected'");
  }

  if (status === "rejected" && !rejectReason) {
    throw new BadRequestError("rejectReason is required when rejecting");
  }

  const expense = await Expense.findById(id);
  if (!expense) {
    throw new NotFoundError("Expense not found");
  }

  // guard state transitions
  if (expense.status !== "pending") {
    throw new BadRequestError(
      `Cannot change status from '${expense.status}' to '${status}'`
    );
  }

  const approvalData = {
    expenseId: id,
    managerId: req.user.userId,
    status,
    ...(status === "rejected" && { rejectReason }),
  };

  const approval = await Approval.create(approvalData);

  // Update expense status
  const update = {
    $set: { status },
  };

  const updatedExpense = await Expense.findByIdAndUpdate(id, update, {
    new: true,
  });

  // Add approval to manager's approvals array
  await User.findByIdAndUpdate(req.user.userId, {
    $push: { approvals: approval._id },
  });

  if (!updatedExpense) {
    throw new NotFoundError("Expense not found");
  }

  res.status(StatusCodes.OK).json({
    message: `Expense ${status} successfully`,
    expense: updatedExpense,
  });
};
