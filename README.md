📈 Lending Platform
=============================================

🧩 Project Description
----------------------

This is a single-page decentralized application (dApp) that allows users to interact with a lending market using WebSocket communication and Ethereum-compatible smart contracts on the Rootstock (RSK) blockchain. Users can manage their accounts, place trading orders, deposit and claim funds, stake tokens, and request loans — all directly from the browser.

🚀 Core Features
----------------

*   **WebSocket Connectivity** — Connect to multiple WebSocket nodes around the world.
*   **Balance Subscription** — Subscribe and monitor live balance updates per user account.
*   **Order Placement** — Submit signed bid/ask orders with various order types (Normal, Post Only, Fill or Kill).
*   **Deposit via Smart Contract** — Deposit RBTC to the lending smart contract using MetaMask on the RSK network.
*   **Claim Deposit** — Claim tokens in the system after the smart contract confirms your deposit.
*   **Burn RBTC** — Permanently burn RBTC tokens from your user balance.
*   **Staking** — Stake RBTC into the lending market to earn yield or participate in lending pools.
*   **Borrowing** — Request a loan backed by staked collateral.
*   **Place BTC Order** — Place BTC-specific orders directly on the market.
*   **Get Lending Info** — Retrieve live lending market metrics and info.
*   **Claim Withdrawal** — Withdraw funds from the smart contract using MetaMask transaction signing.

🛠 Technologies Used
--------------------

*   HTML5 + CSS3 (Bootstrap-compatible layout)
*   Vanilla JavaScript (ES6+)
*   WebSocket API
*   ethers.js (for ECDSA signature generation)
*   web3.js (for smart contract interaction on RSK)
*   MetaMask (for transaction signing and blockchain connectivity)

🌍 Available WebSocket Nodes
----------------------------

*   `wss://node928.info:82` — Asia Node
*   `wss://bitcoin-betting.org:82` — West Europe Node
*   `wss://node82.sytes.net:82` — East Europe Node
*   `wss://sa.bitcoin-betting.com:82` — South America Node

📦 User Interface Layout
------------------------

*   Connect to WebSocket form
*   Order placement and deposit form
*   Buttons for blockchain actions: deposit, transfer, stake, borrow, etc.
*   Logging container for output and transaction feedback

🔐 Security Notes
-----------------

*   Private keys are used locally in the browser to generate digital signatures. Never share your private key.
*   All WebSocket communication is encrypted (WSS protocol).
*   Transactions are sent through MetaMask and signed securely with your wallet.

📋 Requirements
---------------

*   Web browser with MetaMask extension installed
*   RBTC testnet or mainnet funds for transactions
*   Valid private key and user ID to interact with the system

📌 Usage Flow
-------------

1.  Select or enter a WebSocket node and connect
2.  Enter your User ID and Private Key
3.  Use the interface to place orders, stake, or deposit funds
4.  Monitor logs to verify results and feedback

📧 Contact
----------

For support or contributions, please reach out via email or join the official developer community (details coming soon).