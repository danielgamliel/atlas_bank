import { Router } from "express";
import {getTransactions, getTransactionById,transferMoney} from "../controllers/transactions.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/transactions",authenticate, getTransactions);
router.post("/transactions",authenticate, transferMoney);
router.get("/transactions/:transactionId",authenticate, getTransactionById);

export default router;
