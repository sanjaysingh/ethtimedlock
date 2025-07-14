const fs = require('fs');
const crypto = require('crypto');

async function main() {
  console.log("🚀 Setting up TimedLockerV5 deployment environment...");
  
  // Check if .env already exists
  if (fs.existsSync('.env')) {
    console.log("⚠️  .env file already exists!");
    console.log("💡 If you want to recreate it, delete .env first");
    return;
  }
  
  // Generate a random salt
  const salt = `0x${crypto.randomBytes(32).toString('hex')}`;
  
  // Read the template
  const template = fs.readFileSync('env.template', 'utf8');
  
  // Replace the salt in the template
  const envContent = template.replace(
    'DEPLOYMENT_SALT=your_secure_random_salt_here',
    `DEPLOYMENT_SALT=${salt}`
  );
  
  // Write the .env file
  fs.writeFileSync('.env', envContent);
  
  console.log("✅ Created .env file with secure random salt");
  console.log("🧂 Generated salt:", salt);
  console.log("");
  console.log("🔒 SECURITY WARNING:");
  console.log("   • Keep your salt PRIVATE (like a password)");
  console.log("   • Anyone with your salt can predict your contract addresses");
  console.log("   • Don't commit your salt to git repositories");
  console.log("   • The same salt gives you the same address on all networks");
  console.log("");
  console.log("📝 Next steps:");
  console.log("1. Edit .env file and add your private key");
  console.log("2. Run 'npm run preview:ethereum' to see the contract address");
  console.log("3. Run 'npm run deploy:sepolia' to deploy to testnet first");
  console.log("");
  console.log("💡 Your contract will have the SAME address on all networks!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  }); 