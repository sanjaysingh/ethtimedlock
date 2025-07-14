require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Define networks configuration
const networks = {
  hardhat: {
    chainId: 1337
  },
  ethereum: {
    url: process.env.ETHEREUM_RPC_URL || "https://eth.drpc.org",
    accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
    chainId: 1,
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
      apiURL: "https://api.etherscan.io/api",
      browserURL: "https://etherscan.io"
    }
  },
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
    chainId: 11155111,
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
      apiURL: "https://api-sepolia.etherscan.io/api",
      browserURL: "https://sepolia.etherscan.io"
    }
  },
  base: {
    url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
    accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
    chainId: 8453,
    etherscan: {
      apiKey: process.env.BASESCAN_API_KEY,
      apiURL: "https://api.basescan.org/api",
      browserURL: "https://basescan.org"
    }
  },
  optimism: {
    url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
    accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
    chainId: 10,
    etherscan: {
      apiKey: process.env.OPTIMISMSCAN_API_KEY,
      apiURL: "https://api-optimistic.etherscan.io/api",
      browserURL: "https://optimistic.etherscan.io"
    }
  },
  arbitrum: {
    url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
    accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
    chainId: 42161,
    etherscan: {
      apiKey: process.env.ARBISCAN_API_KEY,
      apiURL: "https://api.arbiscan.io/api",
      browserURL: "https://arbiscan.io"
    }
  }
};

// Generate etherscan configuration from networks
const etherscanConfig = {
  apiKey: {},
  customChains: []
};

Object.entries(networks).forEach(([networkName, config]) => {
  if (config.etherscan) {
    etherscanConfig.apiKey[networkName] = config.etherscan.apiKey;
    etherscanConfig.customChains.push({
      network: networkName,
      chainId: config.chainId,
      urls: {
        apiURL: config.etherscan.apiURL,
        browserURL: config.etherscan.browserURL
      }
    });
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: networks,
  etherscan: etherscanConfig
}; 