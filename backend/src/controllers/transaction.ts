import { NextFunction, Request, Response } from 'express';
import Transaction from './../models/transaction';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getTransactions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, type } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    let query = {};
    if (type) {
      query = { type };
    }

    const transactions = await Transaction.find(query).skip(skip).limit(limit);
    const total = await Transaction.countDocuments(query);

    res.status(200).json(new ApiResponse(200, { transactions, total, page: Number(page), pageSize: limit }));
  } catch (err: any) {
    next(new ApiError(400, 'Error in getTransactions', err));
  }
});
export const getTransactionById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const hash = req.params.id;

  try {
    const transaction = await Transaction.findOne({ "hash": hash });
    console.log(hash, "hash");
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(new ApiResponse(200, transaction));
  } catch (err: any) {
    next(new ApiError(400, "Error in get Transactions", err));
  }
});
