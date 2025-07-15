require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY || "0x________________________________________________________________";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth.drpc.org",
      accounts: [privateKey],
      chainId: 1,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
      accounts: [privateKey],
      chainId: 11155111,
    },
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: [privateKey],
      chainId: 8453,
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      accounts: [privateKey],
      chainId: 42161,
    },
    optimism: {
      url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
      accounts: [privateKey],
      chainId: 10,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/",
      accounts: [privateKey],
      chainId: 137,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
}; 