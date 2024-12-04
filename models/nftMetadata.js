const mongoose = require("mongoose");

const nftMetadataSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true },
  tokenId: { type: String, required: true },
  name: { type: String, required: true, default: "Unknown NFT" }, 
  description: { type: String, default: "No description available" }, 
  imageUrl: { type: String, default: "" }, 
});

const NFTMetadata = mongoose.model("NFTMetadata", nftMetadataSchema);

module.exports = NFTMetadata;

