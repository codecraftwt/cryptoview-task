const express = require("express");
const router = express.Router();
const { getTransactions } = require("../controllers/transactionController"); 

//route to get transactions by address
router.get("/:address/transactions", getTransactions); 

module.exports = router;
