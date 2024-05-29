import { NextFunction, Request, Response } from 'express';
import Transaction from './../models/transaction';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getTransactions = asyncHandler(async (req: Request, res: Response ,next:NextFunction) => {
  try {
    const transactions = await Transaction.find();

    res.status(200).json(new ApiResponse(200 , transactions))
  } catch (err:any) {
    next(new ApiError(400 , "error in get Transactions ",err))
  }
}
)
export const getTransactionById = asyncHandler( async (req: Request, res: Response , next:NextFunction) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(new ApiResponse(200 , transaction))
  } catch (err:any) {
    next(new ApiError(400 , "error in get Transactions ",err))
  }
});
