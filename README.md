# ETH Timed Locker

This project is a decentralized application (DApp) for locking Ether in a smart contract until a specified time. It consists of a simple web-based frontend and a Solidity smart contract backend.

## How It Works

The `TimedLockerV5` smart contract allows a user (a "locker") to deposit Ether on behalf of another user (a "beneficiary"). The funds are locked until a specific timestamp is reached, at which point the beneficiary can withdraw them. To prevent spam, beneficiaries must first designate which locker addresses are allowed to deposit funds for them.

The client application provides a user-friendly interface for the following features:

-   **Wallet Connection**: Connect to the DApp using a web3 wallet like MetaMask.
-   **Add/Remove Designated Lockers**: Beneficiaries can manage a list of addresses that are permitted to lock funds for them.
-   **Deposit Funds**: Lockers can deposit Ether for a beneficiary, specifying the amount and the unlock time.
-   **Withdraw Funds**: Beneficiaries can withdraw any funds that have reached their unlock time.
-   **View Locked Funds**: Users can see a list of all funds currently locked for their address.

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
4.  Edit the `.env` file to add your deployer account's private key. Optionally update the RPC URLs for your desired networks if you don't like default ones specified in hardhat.config.js.

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

# Deploy to Polygon
npm run deploy:polygon
```

### Flattening the Contract for Verification

To generate a single, flattened file for easier verification on block explorers, run the following command from the `backend` directory:

```bash
npm run flatten
```

This will create `TimedLockerV5_flattened.sol` in the `verification` directory.

## Frontend (Client)

The `app` folder contains a simple frontend for interacting with the smart contract.

### Running the Frontend

To run the client, simply open the `app/index.html` file in a web browser that has a wallet extension like MetaMask installed.
