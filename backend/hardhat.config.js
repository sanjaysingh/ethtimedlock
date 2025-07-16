require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY || "0x________________________________________________________________";

const DEFAULT_MAINNET_RPC_URL = "https://eth.drpc.org";
const DEFAULT_SEPOLIA_RPC_URL = "https://1rpc.io/sepolia";
const DEFAULT_BASE_RPC_URL = "https://mainnet.base.org";
const DEFAULT_ARBITRUM_RPC_URL = "https://arb1.arbitrum.io/rpc";
const DEFAULT_OPTIMISM_RPC_URL = "https://mainnet.optimism.io";
const DEFAULT_POLYGON_RPC_URL = "https://polygon-rpc.com/";

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
      url: process.env.MAINNET_RPC_URL || DEFAULT_MAINNET_RPC_URL,
      accounts: [privateKey],
      chainId: 1,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || DEFAULT_SEPOLIA_RPC_URL,
      accounts: [privateKey],
      chainId: 11155111,
    },
    base: {
      url: process.env.BASE_RPC_URL || DEFAULT_BASE_RPC_URL,
      accounts: [privateKey],
      chainId: 8453,
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || DEFAULT_ARBITRUM_RPC_URL,
      accounts: [privateKey],
      chainId: 42161,
    },
    optimism: {
      url: process.env.OPTIMISM_RPC_URL || DEFAULT_OPTIMISM_RPC_URL,
      accounts: [privateKey],
      chainId: 10,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || DEFAULT_POLYGON_RPC_URL,
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