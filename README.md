# ETH Timed Locker

This project is a decentralized application (DApp) for locking Ether in a smart contract until a specified time. It consists of a simple web-based frontend and a Solidity smart contract backend.

## How It Works

The `TimedLockerV5` smart contract allows a user (a "locker") to deposit Ether on behalf of another user (a "beneficiary"). The funds are locked until a specific timestamp is reached, at which point the beneficiary can withdraw them. To prevent spam, beneficiaries must first designate which locker addresses are allowed to deposit funds for them.

## Backend (Smart Contract)

The `backend` folder contains the Solidity smart contract and a Hardhat development environment for deploying it.

### Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the template:
    ```bash
    cp env.template .env
    ```
4.  Edit the `.env` file to add your deployer account's private key and RPC URLs for your desired networks.

### Deploying the Contract

The contract is configured for deterministic deployment, meaning it will have the **same address** on any EVM-compatible chain you deploy it to.

To deploy, run one of the following commands from the `backend` directory:

```bash
# Deploy to Ethereum Mainnet
npm run deploy:mainnet

# Deploy to Sepolia Testnet
npm run deploy:sepolia

# Deploy to Base
npm run deploy:base

# Deploy to Arbitrum One
npm run deploy:arbitrum

# Deploy to Optimism
npm run deploy:optimism
```

## Frontend (Client)

The `app` folder contains a simple frontend for interacting with the smart contract.

### Running the Frontend

To run the client, simply open the `app/index.html` file in a web browser that has a wallet extension like MetaMask installed.
