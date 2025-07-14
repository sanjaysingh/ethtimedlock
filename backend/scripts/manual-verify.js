const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function generateManualVerificationDetails() {
    try {
        console.log("🔍 Generating manual verification details...");
        
        // Get contract details
        const contractName = "TimedLockerV5";
        const contractPath = "contracts/TimedLockerV5.sol";
        const solcVersion = "0.8.20";
        
        // Create verification directory
        const verificationDir = path.join(__dirname, '../verification');
        if (!fs.existsSync(verificationDir)) {
            fs.mkdirSync(verificationDir, { recursive: true });
        }
        
        // 1. Use Hardhat's built-in flatten command and post-process it
        console.log("📄 Flattening contract using Hardhat's built-in flatten...");
        const flattenedPath = path.join(verificationDir, `${contractName}_flattened.sol`);
        
        try {
            // Generate flattened contract using Hardhat
            const flattenedOutput = execSync(`npx hardhat flatten ${contractPath}`, { 
                cwd: path.join(__dirname, '..'),
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            // Post-process the flattened output to fix pragma version issues
            const fixedFlattenedCode = fixPragmaVersions(flattenedOutput, solcVersion);
            
            // Write the fixed flattened code to file
            fs.writeFileSync(flattenedPath, fixedFlattenedCode);
            
            console.log("✅ Contract flattened and pragma versions fixed successfully");
        } catch (error) {
            console.error("❌ Error flattening contract:", error.message);
            throw error;
        }
        
        // 2. Get compiler settings from hardhat config
        const hardhatConfigPath = path.join(__dirname, '../hardhat.config.js');
        const hardhatConfigContent = fs.readFileSync(hardhatConfigPath, 'utf8');
        
        // Extract optimization settings from hardhat config content
        let optimizationSettings = { enabled: false, runs: 200 }; // Default Hardhat values
        
        // Look for optimizer configuration in the file
        const optimizerEnabledMatch = hardhatConfigContent.match(/optimizer:\s*{\s*enabled:\s*(true|false)/);
        const optimizerRunsMatch = hardhatConfigContent.match(/runs:\s*(\d+)/);
        
        if (optimizerEnabledMatch) {
            optimizationSettings.enabled = optimizerEnabledMatch[1] === 'true';
        }
        if (optimizerRunsMatch) {
            optimizationSettings.runs = parseInt(optimizerRunsMatch[1]);
        }
        
        const compilerSettings = {
            version: `v${solcVersion}+commit.e11b9ed9`, // This is the typical format for Etherscan
            optimization: optimizationSettings,
            evmVersion: "default"
        };
        
        // 3. Get constructor arguments (if any)
        // TimedLockerV5 doesn't have constructor arguments, but we'll include the structure
        const constructorArgs = [];
        const encodedConstructorArgs = ""; // Empty for contracts without constructor args
        
        // 4. Generate verification details
        const verificationDetails = {
            contractName: contractName,
            contractPath: contractPath,
            flattenedSourcePath: `verification/${contractName}_flattened.sol`,
            compiler: {
                version: compilerSettings.version,
                solcVersion: solcVersion,
                optimization: compilerSettings.optimization,
                evmVersion: compilerSettings.evmVersion
            },
            constructorArguments: {
                decoded: constructorArgs,
                encoded: encodedConstructorArgs
            },
            license: "MIT",
            manualVerificationSteps: [
                "1. Go to the block explorer (Etherscan, Basescan, etc.)",
                "2. Navigate to your deployed contract address",
                "3. Click on 'Contract' tab",
                "4. Click 'Verify and Publish'",
                "5. Select 'Solidity (Single file)'",
                "6. Fill in the form with the details below:",
                "   - Contract Name: " + contractName,
                "   - Compiler: " + compilerSettings.version,
                "   - License: MIT",
                "7. Copy the flattened source code from the .sol file",
                "8. Paste constructor arguments (if any)",
                "9. Click 'Verify and Publish'"
            ],
            networks: {
                ethereum: {
                    explorer: "https://etherscan.io",
                    apiUrl: "https://api.etherscan.io/api"
                },
                sepolia: {
                    explorer: "https://sepolia.etherscan.io",
                    apiUrl: "https://api-sepolia.etherscan.io/api"
                },
                base: {
                    explorer: "https://basescan.org",
                    apiUrl: "https://api.basescan.org/api"
                },
                optimism: {
                    explorer: "https://optimistic.etherscan.io",
                    apiUrl: "https://api-optimistic.etherscan.io/api"
                },
                arbitrum: {
                    explorer: "https://arbiscan.io",
                    apiUrl: "https://api.arbiscan.io/api"
                }
            }
        };
        
        // Write verification details to JSON file
        const detailsPath = path.join(verificationDir, 'verification-details.json');
        fs.writeFileSync(detailsPath, JSON.stringify(verificationDetails, null, 2));
        
        console.log("\n✅ Manual verification details generated successfully!");
        console.log("\n📁 Files created:");
        console.log(`   📄 ${flattenedPath}`);
        console.log(`   📋 ${detailsPath}`);
        
        console.log("\n💡 BETTER APPROACH: Use Hardhat's built-in verify command!");
        console.log("   After deployment, run: npx hardhat verify --network <network> <contract-address>");
        console.log("   This handles flattening and verification automatically!");
        
        console.log("\n🎯 Manual Verification Steps (if needed):");
        console.log("1. Deploy your contract first");
        console.log("2. Go to the block explorer for your network");
        console.log("3. Navigate to your contract address");
        console.log("4. Use the details in 'verification-details.json'");
        console.log("5. Copy the flattened source code from the .sol file");
        console.log("   (Generated using Hardhat's built-in flatten command)");
        
        console.log("\n📋 Quick Reference:");
        console.log(`   Contract Name: ${contractName}`);
        console.log(`   Compiler: ${compilerSettings.version}`);
        console.log(`   License: MIT`);
        console.log(`   Constructor Args: ${encodedConstructorArgs || 'None'}`);
        
        return verificationDetails;
        
    } catch (error) {
        console.error("❌ Error generating verification details:", error.message);
        throw error;
    }
}

function fixPragmaVersions(flattenedCode, targetSolcVersion) {
    console.log("🔧 Fixing pragma versions and cleaning up flattened code...");
    
    const lines = flattenedCode.split('\n');
    const cleanedLines = [];
    let spdxSeen = false;
    let pragmaSeen = false;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip dotenv messages
        if (trimmed.includes('[dotenv@') || trimmed.includes('injecting env') || trimmed.includes('tip:')) {
            continue;
        }
        
        // Handle SPDX license identifier - keep only the first one
        if (trimmed.startsWith('// SPDX-License-Identifier:')) {
            if (!spdxSeen) {
                cleanedLines.push('// SPDX-License-Identifier: MIT');
                spdxSeen = true;
            }
            continue;
        }
        
        // Handle pragma statements - replace all with our target version
        if (trimmed.startsWith('pragma solidity')) {
            if (!pragmaSeen) {
                cleanedLines.push(`pragma solidity ^${targetSolcVersion};`);
                pragmaSeen = true;
            }
            continue;
        }
        
        // Skip Hardhat flattening header comments
        if (trimmed.startsWith('// Sources flattened with hardhat')) {
            continue;
        }
        
        // Skip OpenZeppelin file headers
        if (trimmed.startsWith('// File @openzeppelin/') || trimmed.startsWith('// File contracts/')) {
            continue;
        }
        
        // Skip "Original license" comments
        if (trimmed.startsWith('// Original license:')) {
            continue;
        }
        
        // Skip OpenZeppelin version comments
        if (trimmed.startsWith('// OpenZeppelin Contracts (last updated')) {
            continue;
        }
        
        // Keep all other lines
        cleanedLines.push(line);
    }
    
    // Join lines and clean up excessive empty lines
    let result = cleanedLines.join('\n');
    
    // Remove multiple consecutive empty lines
    result = result.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // Ensure proper spacing after license and pragma
    result = result.replace(/(pragma solidity.*?;)(\n+)/, '$1\n\n');
    
    return result.trim() + '\n';
}

// Allow running this script directly
if (require.main === module) {
    generateManualVerificationDetails()
        .then(() => {
            console.log("\n🎉 Done! Check the 'verification' folder for all files.");
        })
        .catch((error) => {
            console.error("❌ Failed:", error.message);
            process.exit(1);
        });
}

module.exports = { generateManualVerificationDetails }; 