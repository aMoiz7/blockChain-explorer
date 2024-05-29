import { Router } from 'express';
import { getTransactionById, getTransactions } from '../controllers/transaction';


const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);

export default router;
