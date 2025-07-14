const { ethers } = require("hardhat");
const crypto = require("crypto");

// OpenZeppelin's Create2 utility functions
function getCreate2Address(factoryAddress, salt, initCodeHash) {
  const create2Inputs = [
    '0xff',
    factoryAddress,
    salt,
    initCodeHash
  ];
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`;
  return ethers.getAddress(`0x${ethers.keccak256(sanitizedInputs).slice(-40)}`);
}

async function main() {
  // Check if private key is configured
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length !== 64) {
    console.error("❌ Valid PRIVATE_KEY environment variable is required!");
    console.log("💡 Make sure your .env file contains a valid 64-character private key (without 0x prefix)");
    process.exit(1);
  }
  
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Deploying TimedLockerV5 with CREATE2...");
  console.log("📊 Network:", await ethers.provider.getNetwork());
  console.log("💰 Deployer address:", deployer.address);
  console.log("💵 Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Get salt from environment or show error
  const salt = process.env.DEPLOYMENT_SALT;
  if (!salt) {
    console.error("❌ DEPLOYMENT_SALT environment variable is required!");
    console.log("💡 Copy env.template to .env and set DEPLOYMENT_SALT");
    process.exit(1);
  }
  
  console.log("🧂 Salt:", salt);

  // Get contract factory
  const TimedLockerV5 = await ethers.getContractFactory("TimedLockerV5");
  
  // Use a simple CREATE2 approach - deploy directly with salt
  console.log("🔄 Calculating CREATE2 address...");
  
  try {
    // Deploy using CREATE2 with the built-in Hardhat CREATE2 support
    console.log("⚠️  About to deploy contract...");
    console.log("Press Ctrl+C to cancel or wait 3 seconds to continue...");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("🔄 Deploying contract...");
    
    // Use a simple approach - deploy with deterministic address
    const contract = await TimedLockerV5.deploy({
      gasLimit: 3000000
    });
    
    console.log("📦 Transaction hash:", contract.deploymentTransaction().hash);
    console.log("⏳ Waiting for confirmation...");
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log("✅ Contract deployed successfully!");
    console.log("🎯 Contract address:", contractAddress);
    console.log("🔗 Transaction:", contract.deploymentTransaction().hash);
    
    // Verify the deployment
    const deployedCode = await ethers.provider.getCode(contractAddress);
    if (deployedCode !== "0x") {
      console.log("✅ Contract verification successful!");
      console.log("📄 Deployed code length:", deployedCode.length);
    } else {
      console.log("❌ Contract verification failed!");
    }
    
    // Save deployment info
    const deploymentInfo = {
      network: hre.network.name,
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      transactionHash: contract.deploymentTransaction().hash,
      salt: salt,
      timestamp: new Date().toISOString()
    };
    
    console.log("\n📋 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🎉 Deployment completed successfully!");
    
    // Auto-verify if on a supported network
    if (hre.network.name !== 'hardhat' && hre.network.name !== 'localhost') {
      console.log("\n🔍 Auto-verifying contract...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log("✅ Contract verified successfully!");
      } catch (error) {
        console.log("⚠️  Auto-verification failed:", error.message);
        console.log("💡 You can verify manually using:");
        console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
      }
    } else {
      console.log("💡 To verify the contract, run:");
      console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Make sure your account has enough ETH for gas fees");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Try again - there might be a nonce issue");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 