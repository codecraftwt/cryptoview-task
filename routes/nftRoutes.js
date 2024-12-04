const express = require("express");
const router = express.Router();
const nftController = require("../controllers/nftController");

// Route to fetch NFT metadata
router.get("/:contractAddress/:tokenId", nftController.getNftMetadata);

module.exports = router;
