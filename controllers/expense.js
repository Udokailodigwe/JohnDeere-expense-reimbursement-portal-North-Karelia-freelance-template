import Expense from "../models/expense.js";
import { StatusCodes } from "http-status-codes";
import { pickFields, parseDate } from "../utils/utility.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createExpense = async (req, res) => {
  req.body.userId = req.user.userId;

  const expense = await Expense.create(req.body);

  res.status(StatusCodes.CREATED).json({
    message: "Expense submitted successfully",
    expense,
  });
};

export const getExpenses = async (req, res) => {
  // Use validated query data if available, otherwise fall back to req.query
  const queryData = req.validatedQuery || req.query;
  const { status, category, startDate, endDate } = queryData;

  const query = { userId: req.user.userId };

  if (status) query.status = status;
  if (category) query.category = category;

  // Date range filter
  if (startDate || endDate) {
    query.expenseDate = {};
    if (startDate) query.expenseDate.$gte = new Date(startDate);
    if (endDate) query.expenseDate.$lte = new Date(endDate);
  }

  const [expenses, totalExpenses] = await Promise.all([
    Expense.find(query)
      .populate("userId", "name email")
      .sort({ expenseDate: -1 }),
    Expense.countDocuments(query),
  ]);

  res.status(StatusCodes.OK).json({
    message: "Expenses retrieved successfully",
    totalExpenses,
    expenses,
  });
};

export const getAllEmployeeExpenses = async (req, res) => {
  // Use validated query data if available, otherwise fall back to req.query
  const queryData = req.validatedQuery || req.query;
  const { status, category, startDate, endDate, userId } = queryData;

  // Start with empty query - managers can see all expenses
  const query = {};

  // Filter by specific user if provided
  if (userId) query.userId = userId;

  if (status) query.status = status;
  if (category) query.category = category;

  // Date range filter
  if (startDate || endDate) {
    query.expenseDate = {};
    if (startDate) query.expenseDate.$gte = new Date(startDate);
    if (endDate) query.expenseDate.$lte = new Date(endDate);
  }

  const [expenses, totalExpenses] = await Promise.all([
    Expense.find(query)
      .populate("userId", "name email")
      .sort({ expenseDate: -1 }),
    Expense.countDocuments(query),
  ]);

  res.status(StatusCodes.OK).json({
    message: "All employeeexpenses retrieved successfully",
    totalExpenses,
    expenses,
  });
};

export const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id).populate("userId", "name email");

  if (!expense) {
    throw new NotFoundError("Expense not found");
  }

  res.status(StatusCodes.OK).json({ expense });
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;

  const existingExpense = await Expense.findOne({
    _id: id,
    userId: req.user.userId,
  });

  if (!existingExpense) {
    throw new NotFoundError("Expense not found");
  }

  if (existingExpense.status !== "pending") {
    throw new BadRequestError("Cannot edit expense that is not pending");
  }

  // Define allowed fields for update
  const allowedFields = [
    "amount",
    "description",
    "category",
    "expenseDate",
    "notes",
  ];

  // Pick only allowed fields from request body using utility function
  const updateData = pickFields(req.body, allowedFields);

  // Handle special transformations using utility function
  if (updateData.expenseDate) {
    updateData.expenseDate = parseDate(updateData.expenseDate) || new Date();
  }

  const expense = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    message: "Expense updated successfully",
    expense,
  });
};
