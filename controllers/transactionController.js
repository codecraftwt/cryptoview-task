const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const Transaction = require("../models/transaction");

// Fetch transactions for a given Ethereum address and date range
const getTransactions = async (req, res) => {
  const { address } = req.params;
  const { startDate, endDate } = req.query; // Accept start and end date as query parameters

  const chain = EvmChain.ETHEREUM;

  try {   
    let startTimestamp = startDate ? new Date(startDate).getTime() : null;
    let endTimestamp = endDate ? new Date(endDate).getTime() : null;
 
    if (startTimestamp && isNaN(startTimestamp)) {
      return res.status(400).json({ error: "Invalid start date format." });
    }
    if (endTimestamp && isNaN(endTimestamp)) {
      return res.status(400).json({ error: "Invalid end date format." });
    }

    // Fetch transaction data from Moralis
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address: address,
      chain,
      limit: 100, 
    });

    const transactions = response.toJSON();

    console.log(transactions, "transactions");

    // If no transactions found, return an error
    if (!transactions || transactions.result.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this address." });
    }
   
    const transactionsData = transactions.result
      .map((tx) => ({
        address: tx.from_address,
        hash: tx.hash,
        from: tx.from_address,
        to: tx.to_address,
        toLabel: tx.to_address_label, 
        toLogo: tx.to_address_entity_logo, 
        value: tx.value,
        timestamp: new Date(tx.block_timestamp).getTime(), 
        blockNumber: tx.block_number,
        gasUsed: tx.receipt_gas_used, 
        gasPrice: tx.gas_price, 
        transactionFee: tx.transaction_fee, 
        receiptStatus: tx.receipt_status, 
      }))
      .filter((tx) => {
        // Filter transactions based on the provided date range (if any)
        const txTimestamp = tx.timestamp;

        if (startTimestamp && txTimestamp < startTimestamp) {
          return false;
        }
        if (endTimestamp && txTimestamp > endTimestamp) {
          return false;
        }
        return true;
      });

    if (transactionsData.length === 0) {
      return res
        .status(404)
        .json({
          error:
            "No transactions found for this address within the specified date range.",
        });
    }

    // If no date range was provided, limit to the last 5 transactions
    if (!startDate && !endDate) {
      transactionsData.length = 5; 
    }

    // Save the filtered transactions to MongoDB
    await Transaction.insertMany(transactionsData);

    // Return the transactions in the response
    res.json(transactionsData);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to retrieve transactions." });
  }
};

module.exports = {
  getTransactions,
};
