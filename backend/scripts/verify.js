const { ethers } = require("hardhat");

async function main() {
  // Get contract address from command line arguments
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("❌ Please provide contract address as argument");
    console.log("💡 Usage: npx hardhat run scripts/verify.js --network base <CONTRACT_ADDRESS>");
    process.exit(1);
  }
  
  // Check for appropriate API key based on network
  const apiKeyMap = {
    ethereum: process.env.ETHERSCAN_API_KEY,
    sepolia: process.env.ETHERSCAN_API_KEY,
    base: process.env.BASESCAN_API_KEY,
    optimism: process.env.OPTIMISMSCAN_API_KEY,
    arbitrum: process.env.ARBISCAN_API_KEY
  };
  
  const currentApiKey = apiKeyMap[hre.network.name];
  const apiKeyName = hre.network.name === 'ethereum' || hre.network.name === 'sepolia' ? 'ETHERSCAN_API_KEY' : 
                    hre.network.name === 'base' ? 'BASESCAN_API_KEY' :
                    hre.network.name === 'optimism' ? 'OPTIMISMSCAN_API_KEY' :
                    'ARBISCAN_API_KEY';
  
  if (!currentApiKey) {
    console.error(`❌ ${apiKeyName} environment variable is required!`);
    console.log(`💡 Add ${apiKeyName} to your .env file`);
    process.exit(1);
  }
  
  console.log("🔍 Verifying TimedLockerV5 contract...");
  console.log("📊 Network:", hre.network.name);
  console.log("📍 Contract address:", contractAddress);
  
  try {
    // Verify the contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: []
    });
    
    const explorerMap = {
      ethereum: 'etherscan.io',
      sepolia: 'sepolia.etherscan.io',
      base: 'basescan.org',
      optimism: 'optimistic.etherscan.io',
      arbitrum: 'arbiscan.io'
    };
    
    const explorerUrl = explorerMap[hre.network.name];
    
    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on ${explorerUrl}: https://${explorerUrl}/address/${contractAddress}`);
    
  } catch (error) {
    if (error.message.includes("already verified")) {
      console.log("ℹ️  Contract already verified");
      console.log(`🔗 View on ${explorerUrl}: https://${explorerUrl}/address/${contractAddress}`);
    } else {
      console.error("❌ Verification failed:", error.message);
      
      if (error.message.includes("Invalid API Key")) {
        console.log("💡 Check your BASESCAN_API_KEY in .env file");
      } else if (error.message.includes("does not have bytecode")) {
        console.log("💡 Make sure the contract address is correct and deployed");
      } else if (error.message.includes("Compilation errors")) {
        console.log("💡 Make sure you're using the same compiler version");
      }
      
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 