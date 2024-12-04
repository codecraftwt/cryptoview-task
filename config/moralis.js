require("dotenv").config();

const Moralis = require("moralis").default;

// Initialize Moralis with the API
const initMoralis = async () => {
  try {
    if (!Moralis.Core.isStarted) {
      const apiKey = process.env.MORALIS_API_KEY;

      if (!apiKey) {
        throw new Error(
          "Moralis API key is missing in the environment variables"
        );
      }

      await Moralis.start({
        apiKey: apiKey,
      });

      console.log("Moralis initialized");
    }
  } catch (error) {
    console.error("Error initializing Moralis:", error);
  }
};

module.exports = initMoralis;
