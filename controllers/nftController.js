const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const NFTMetadata = require("../models/nftMetadata"); // Model for MongoDB

// Controller function to get NFT metadata
const getNftMetadata = async (req, res) => {
  const { contractAddress, tokenId } = req.params;

  try {
    // Fetch NFT metadata from Moralis API
    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      address: contractAddress,
      chain: EvmChain.ETHEREUM,
      tokenId: tokenId,
    });

    // Log the response to inspect
    console.log("Moralis Response:", response.toJSON());

    // Extract metadata from the response and parse it
    const metadata = response?.toJSON()?.metadata
      ? JSON.parse(response.toJSON().metadata)
      : {};

    // If metadata is missing, return an error
    if (
      !metadata ||
      !metadata.name ||
      !metadata.description ||
      !metadata.image
    ) {
      console.error("Incomplete metadata:", metadata); // Log for debugging
      return res
        .status(404)
        .json({ error: "NFT metadata not found or incomplete" });
    }

    // Prepare NFT data
    const nftData = {
      contractAddress,
      tokenId,
      name: metadata.name || "Unknown NFT", // Default value if missing
      description: metadata.description || "No description available", // Default value if missing
      imageUrl: metadata.image || "", // Default value if missing
    };

    // Save metadata to MongoDB (optional)
    const newNFT = new NFTMetadata(nftData);
    await newNFT.save();

    // Return the metadata as a response
    res.json(nftData);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({ error: "Failed to retrieve NFT metadata." });
  }
};

module.exports = {
  getNftMetadata,
};

// const { Web3 } = require("web3");
// const axios = require("axios");
// const NFTMetadata = require("../models/nftMetadata");

// // MetaMask API URL (replace with your actual API key)
// const META_MASK_API_KEY = "c60d0df7a9cc40b8afe05456a5fdfc23"; // Replace this with your actual API key
// const metamaskUrl = `https://api.metamask.io/v1/eth/goerli?apiKey=${META_MASK_API_KEY}`;
// const web3 = new Web3(metamaskUrl);

// // Define the contract ABI for tokenURI function
// const nftABI = [
//   {
//     constant: true,
//     inputs: [{ name: "tokenId", type: "uint256" }],
//     name: "tokenURI",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// // Function to retrieve NFT metadata based on contractAddress and tokenId
// const getNftMetadata = async (req, res) => {
//   const { contractAddress, tokenId } = req.params; // Using req.params for dynamic route parameters

//   try {
//     // Create contract instance
//     const contract = new web3.eth.Contract(nftABI, contractAddress);

//     // Fetch the token URI (this could be an IPFS URL or a JSON file on a server)
//     const tokenURI = await contract.methods.tokenURI(tokenId).call();

//     // Fetch the metadata from the token URI
//     const metadataResponse = await axios.get(tokenURI);
//     const metadata = metadataResponse.data;

//     // Prepare the NFT data
//     const nftData = {
//       contractAddress,
//       tokenId,
//       name: metadata.name,
//       description: metadata.description,
//       imageUrl: metadata.image, // assuming the image URL is stored here
//     };

//     // Return the metadata as a response
//     res.json(nftData);
//   } catch (error) {
//     console.error("Error fetching NFT metadata:", error);
//     res.status(500).json({ error: "Failed to retrieve NFT metadata." });
//   }
// };

// // Function to manually create or save NFT metadata (POST)
// const createNftMetadata = async (req, res) => {
//   const { contractAddress, tokenId, name, description, imageUrl } = req.body;

//   try {
//     // Prepare the NFT data
//     const nftData = {
//       contractAddress,
//       tokenId,
//       name,
//       description,
//       imageUrl,
//     };

//     // Save the metadata to MongoDB
//     const newNFT = new NFTMetadata(nftData);
//     await newNFT.save();

//     // Return the created metadata as a response
//     res.status(201).json(newNFT);
//   } catch (error) {
//     console.error("Error saving NFT metadata:", error);
//     res.status(500).json({ error: "Failed to save NFT metadata." });
//   }
// };

// module.exports = {
//   getNftMetadata,
//   createNftMetadata,
// };
