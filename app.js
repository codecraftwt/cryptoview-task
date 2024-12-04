require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nftRoutes = require("./routes/nftRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const initMoralis = require("./config/moralis");

const app = express();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/nftDB";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Initialize Moralis
initMoralis();

app.use(express.json());

app.use("/api/nft", nftRoutes);
app.use("/api/transcation", transactionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
