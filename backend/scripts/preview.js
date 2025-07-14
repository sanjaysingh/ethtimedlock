const { ethers } = require("hardhat");
const crypto = require("crypto");

async function main() {
  // Check if private key is configured
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length !== 64) {
    console.error("❌ Valid PRIVATE_KEY environment variable is required!");
    console.log("💡 Make sure your .env file contains a valid 64-character private key (without 0x prefix)");
    process.exit(1);
  }
  
  const [deployer] = await ethers.getSigners();
  
  console.log("🔍 Previewing TimedLockerV5 deployment address...");
  console.log("📊 Network:", await ethers.provider.getNetwork());
  console.log("💰 Deployer address:", deployer.address);

  // Get salt from environment or show error
  const salt = process.env.DEPLOYMENT_SALT;
  if (!salt) {
    console.error("❌ DEPLOYMENT_SALT environment variable is required!");
    console.log("💡 Copy env.template to .env and set DEPLOYMENT_SALT");
    console.log("💡 Example: DEPLOYMENT_SALT=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    process.exit(1);
  }
  console.log("🧂 Salt:", salt);

  // Get contract factory
  const TimedLockerV5 = await ethers.getContractFactory("TimedLockerV5");
  
  // Calculate CREATE2 address
  const bytecode = TimedLockerV5.bytecode;
  const initCodeHash = ethers.keccak256(bytecode);
  
  // Deterministic deployment proxy
  const CREATE2_FACTORY = "0x4e59b44847b379578588920ca78fbf26c0b4956c";
  
  // Calculate the deterministic address
  const create2Address = ethers.getCreate2Address(
    CREATE2_FACTORY,
    salt,
    initCodeHash
  );
  
  console.log("📍 Predicted contract address:", create2Address);
  
  // Check if contract already exists
  const code = await ethers.provider.getCode(create2Address);
  if (code !== "0x") {
    console.log("❌ Contract already deployed at this address!");
    console.log("🔍 Deployed contract code length:", code.length);
  } else {
    console.log("✅ Address is available for deployment");
  }
  
  console.log("\n📝 To deploy with this address, run:");
  console.log(`npx hardhat run scripts/deploy.js --network ${hre.network.name}`);
  
  // Show other network predictions
  console.log("\n🌐 This address will be the same on ALL networks with:");
  console.log(`   - Same salt: ${salt}`);
  console.log(`   - Same factory: ${CREATE2_FACTORY}`);
  console.log(`   - Same contract bytecode`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 